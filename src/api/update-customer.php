<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *"); // Tüm kaynaklara izin ver
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE"); // İzin verilen metodlar
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // İzin verilen başlıklar
header("Content-Type: application/json");

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

// İstek sadece POST ise devam et
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // JSON verisini al
    $data = json_decode(file_get_contents("php://input"), true);

    // Gerekli alanların olup olmadığını kontrol et
    if (!isset($data['id']) || empty($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Eksik müşteri ID"]);
        exit;
    }

    // Müşteri ID'yi al
    $id = $data['id'];

    // Güncellenebilecek alanlar
    $allowedFields = [
        "ad_soyad", "telefon1", "telefon2", "tuketim_no",
        "il", "ilce", "mahalle", "sokak_adi", "bina_no", "daire_no",
        "cihaz_turu", "cihaz_markasi", "cihaz_modeli", "cihaz_seri_numarasi",
        "is_tipi","not_text","hata_sebebi","is_durumu", "randevu_tarihi",
        "siparis_tarihi", "montaj_tarihi", "musteri_temsilcisi", "igdas_sozlesme"
    ];

    // Güncellenecek alanları belirle
    $updateFields = [];
    $updateValues = [];

    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updateFields[] = "$field = ?";
            $updateValues[] = $data[$field];
        }
    }

    // Eğer güncellenecek bir alan yoksa hata döndür
    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode(["error" => "Güncellenecek veri yok"]);
        exit;
    }

    // SQL UPDATE sorgusunu hazırla
    $updateValues[] = $id; // En sona ID'yi ekle
    $sql = "UPDATE customer_form SET " . implode(", ", $updateFields) . " WHERE id = ?";

    // Sorguyu çalıştır
    $query = $db->prepare($sql);
    $result = $query->execute($updateValues);

    // Başarı durumu
    if ($result) {
        echo json_encode(["message" => "Müşteri başarıyla güncellendi"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Güncelleme başarısız"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Geçersiz istek yöntemi"]);
}
?>
