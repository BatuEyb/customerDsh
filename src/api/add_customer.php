<?php
include 'api.php'; // Veritabanı bağlantısı
include 'session.php';

// Veriyi alalım (gelen JSON verisini alıyoruz)
$data = json_decode(file_get_contents('php://input'), true);

// Verinin doğru şekilde alındığını kontrol edelim
error_log("Gelen Veri: " . print_r($data, true)); // Bu, gelen veriyi loglayacaktır.

$created_by = $_SESSION['user_id']; // Oturumdaki kullanıcı ID'si
$username = $_SESSION['username']; // Oturumdaki kullanıcı adı

// Zorunlu alanların dolu olup olmadığını kontrol et
if (isset($data['name']) && !empty($data['name']) && 
    isset($data['email']) && !empty($data['email']) &&
    isset($data['phone']) && !empty($data['phone']) &&
    isset($data['address']) && !empty($data['address']) &&
    isset($data['customer_type']) && !empty($data['customer_type'])) {

    // SQL sorgusunu hazırla
    $sql = "INSERT INTO customers (name, email, phone, address, customer_type, tc_identity_number, tax_number, created_by, updated_by, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

    // Hazırlanan sorguyu çalıştırmak için statement kullan
    $customerName = $data['name'];

    // Eğer TC Kimlik Numarası veya Vergi Numarası boş ise, NULL gönder
    $tc_identity_number = isset($data['tc_identity_number']) && !empty($data['tc_identity_number']) ? $data['tc_identity_number'] : NULL;
    $tax_number = isset($data['tax_number']) && !empty($data['tax_number']) ? $data['tax_number'] : NULL;
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssissiiss", $data['name'], $data['email'], $data['phone'], $data['address'], $data['customer_type'], $tc_identity_number, $tax_number, $created_by, $created_by);
    
    // Sorguyu çalıştır ve sonucu kontrol et
    if ($stmt->execute()) {
        echo json_encode(["message" => "Müşteri başarıyla eklendi."]);
        log_activity("Müşteri Eklendi: $customerName");
    } else {
        echo json_encode(["message" => "Müşteri eklenirken hata oluştu."]);
    }

    $stmt->close();
} else {
    echo json_encode(["message" => "Eksik zorunlu veri!"]);
}

// Bağlantıyı kapat
$conn->close();
?>
