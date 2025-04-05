<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

// OPTIONS isteğine 200 OK döndür (Tarayıcı preflight request atarsa engellenmez)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host = "localhost";
$dbname = "takip";
$username = "root"; // XAMPP kullanıyorsan genelde "root"
$password = ""; // XAMPP'de genelde boş bırakılır

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Veritabanı bağlantı hatası: " . $e->getMessage()]));
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = $_GET['id'];

    if (!empty($id)) {
        $query = $db->prepare("DELETE FROM customer_form WHERE id = ?");
        $result = $query->execute([$id]);

        if ($result) {
            echo json_encode(["message" => "Müşteri silindi"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Silme işlemi başarısız"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Eksik müşteri ID"]);
    }
}
?>
