<?php
include 'api.php'; // Veritabanı bağlantısı

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Müşteri ID eksik.']);
    exit;
}

// İsteğe bağlı: müşteri ile ilişkili teklif/sipariş var mı kontrol edebilirsin

$stmt = $conn->prepare("DELETE FROM customers WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Müşteri başarıyla silindi.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Silme işlemi sırasında hata oluştu.']);
}

$stmt->close();
$conn->close();
?>
