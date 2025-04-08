<?php
include 'api.php'; // veritabanı bağlantısı
include 'session.php';

$created_by = $_SESSION['user_id']; // Oturumdaki kullanıcı ID'si
$username = $_SESSION['username']; // Oturumdaki kullanıcı adı

// Gelen veriyi al
$data = json_decode(file_get_contents("php://input"), true);

// Verileri al
$customer_id = $data['customer_id'];
$total_amount = $data['total_amount'];
$quote_items = $data['quote_items']; // quote_items bir dizi olacak

$conn->begin_transaction();

try {
    // 1. Teklifi quotes tablosuna ekle
    $stmt = $conn->prepare("INSERT INTO quotes (customer_id, total_amount, status, created_by, updated_by, created_at, updated_at) 
                            VALUES (?, ?, 'Bekliyor', ?, ?, NOW(), NOW())");
    $stmt->bind_param("idss", $customer_id, $total_amount, $created_by, $created_by);
    $stmt->execute();

    // Yeni eklenen teklifin id'sini al
    $quote_id = $conn->insert_id;

    // 2. Ürünleri quote_items tablosuna ekle
    $itemStmt = $conn->prepare("INSERT INTO quote_items (quote_id, stock_id, quantity, unit_price, total_price, created_at, updated_at) 
                                VALUES (?, ?, ?, ?, ?, NOW(), NOW())");

    // Her bir item için verileri ekle
    foreach ($quote_items as $item) {
        $stock_id = $item['stock_id'];
        $quantity = $item['quantity'];
        $unit_price = $item['unit_price'];
        $total_price = $item['total_price'];

        // quote_items tablosuna ekleme
        $itemStmt->bind_param("iiddd", $quote_id, $stock_id, $quantity, $unit_price, $total_price);
        $itemStmt->execute();
    }

    // İşlemleri commit et
    $conn->commit();

    // Aktivite logunu kaydet
    log_activity("Teklif Oluşturuldu : $quote_id");

    // Başarı mesajı döndür
    echo json_encode(["success" => true, "quote_id" => $quote_id]);

} catch (Exception $e) {
    // Hata durumunda işlemi geri al
    $conn->rollback();

    // Hata mesajı döndür
    echo json_encode(["success" => false, "message" => "Teklif oluşturulamadı", "error" => $e->getMessage()]);
}
?>
