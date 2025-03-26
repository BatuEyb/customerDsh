<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// OPTIONS isteğine 200 OK döndür (Tarayıcı preflight request atarsa engellenmez)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'takip');

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($mysqli->connect_error) {
    die("Bağlantı hatası: " . $mysqli->connect_error);
}

// urunler_api.php - CRUD işlemleri
$request_method = $_SERVER["REQUEST_METHOD"];
switch ($request_method) {
    case 'GET':
        getProducts($mysqli);
        break;
    case 'POST':
        addProduct($mysqli);
        break;
    case 'PUT':
        updateProduct($mysqli);
        break;
    case 'DELETE':
        deleteProduct($mysqli);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Geçersiz istek yöntemi"]);
        break;
}

function getProducts($mysqli) {
    $query = "SELECT * FROM urunler";
    $result = $mysqli->query($query);
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    echo json_encode($products);
}

function addProduct($mysqli) {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $mysqli->prepare("INSERT INTO urunler (kategori, urun_adi, marka, stok_numarasi, stok_adedi, fiyat) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssiii", $data['kategori'], $data['urun_adi'], $data['marka'], $data['stok_numarasi'], $data['stok_adedi'], $data['fiyat']);
    if ($stmt->execute()) {
        echo json_encode(["message" => "Ürün eklendi"]);
    } else {
        echo json_encode(["message" => "Ekleme başarısız"]);
    }
}

function deleteProduct($mysqli) {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
        echo json_encode(["message" => "ID eksik"]);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM urunler WHERE id=?");
    $stmt->bind_param("i", $data['id']);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Ürün silindi"]);
    } else {
        echo json_encode(["message" => "Silme başarısız"]);
    }
}

function updateProduct($mysqli) {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id'])) {
        echo json_encode(["message" => "ID eksik"]);
        return;
    }

    // Güncellenecek ürünün mevcut verilerini al
    $stmt = $mysqli->prepare("SELECT stok_numarasi FROM urunler WHERE id = ?");
    $stmt->bind_param("i", $data['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $prev_stok_numarasi = $row['stok_numarasi']; // Önceki stok numarası

    // Eğer stok numarası boş veya null olarak gelirse, önceki değeri kullan
    $stok_numarasi = isset($data['stok_numarasi']) && !empty($data['stok_numarasi']) ? $data['stok_numarasi'] : $prev_stok_numarasi;

    // Eğer fiyat güncelleniyorsa, stok numarasını değiştirme
    $stmt = $mysqli->prepare("UPDATE urunler SET kategori=?, urun_adi=?, marka=?, stok_numarasi=?, stok_adedi=?, fiyat=? WHERE id=?");
    $stmt->bind_param("ssssdis", 
        $data['kategori'], 
        $data['urun_adi'], 
        $data['marka'], 
        $stok_numarasi, 
        $data['stok_adedi'], 
        $data['fiyat'], 
        $data['id']
    );

    if ($stmt->execute()) {
        echo json_encode(["message" => "Ürün başarılı bir şekilde güncellendi"]);
    } else {
        echo json_encode(["message" => "Güncelleme başarısız"]);
    }
}

function getCategories($mysqli) {
    $query = "SELECT DISTINCT kategori FROM urunler";
    $result = $mysqli->query($query);
    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row['kategori'];
    }
    echo json_encode($categories);
}
?>
