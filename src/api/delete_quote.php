<?php
include 'api.php'; // veritabanı bağlantısı
include 'session.php'; // oturum kontrolü

header('Content-Type: application/json');

// Gelen veriyi al
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['quote_id'])) {
    echo json_encode(["success" => false, "message" => "Teklif ID belirtilmedi."]);
    exit;
}

$quote_id = $data['quote_id'];

// İşlem başlat
$conn->begin_transaction();

try {
    // Önce bağlı teklif ürünlerini sil
    $stmt1 = $conn->prepare("DELETE FROM quote_items WHERE quote_id = ?");
    $stmt1->bind_param("i", $quote_id);
    $stmt1->execute();

    // Ardından teklifin kendisini sil
    $stmt2 = $conn->prepare("DELETE FROM quotes WHERE id = ?");
    $stmt2->bind_param("i", $quote_id);
    $stmt2->execute();

    $conn->commit();

    log_activity("Teklif silindi: $quote_id");

    echo json_encode(["success" => true, "message" => "Teklif başarıyla silindi."]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Teklif silinemedi.", "error" => $e->getMessage()]);
}
?>
