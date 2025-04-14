<?php
include 'api.php'; // veritabanı bağlantısı
include 'session.php'; // oturum kontrolü

header('Content-Type: application/json');

// Gelen veriyi al
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['order_id'])) {
    echo json_encode(["success" => false, "message" => "Sipariş ID belirtilmedi."]);
    exit;
}

$order_id = $data['order_id'];

// İşlem başlat
$conn->begin_transaction();

try {
    // Önce bağlı teklif ürünlerini sil
    $stmt1 = $conn->prepare("DELETE FROM order_items WHERE order_id = ?");
    $stmt1->bind_param("i", $order_id);
    $stmt1->execute();

    // Ardından teklifin kendisini sil
    $stmt2 = $conn->prepare("DELETE FROM orders WHERE id = ?");
    $stmt2->bind_param("i", $order_id);
    $stmt2->execute();

    $conn->commit();

    log_activity("Sipariş silindi: $order_id");

    echo json_encode(["success" => true, "message" => "Sipariş başarıyla silindi."]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Sipariş silinemedi.", "error" => $e->getMessage()]);
}
?>
