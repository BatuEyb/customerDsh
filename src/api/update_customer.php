<?php
header('Content-Type: application/json');
include 'api.php'; // Veritabanı bağlantısı

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'] ?? null;
$name = $data['name'] ?? '';
$phone = $data['phone'] ?? '';
$email = $data['email'] ?? '';
$address = $data['address'] ?? '';

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Müşteri ID eksik.']);
    exit;
}

$stmt = $conn->prepare("UPDATE customers SET name=?, phone=?, email=?, address=? WHERE id=?");
$stmt->bind_param("ssssi", $name, $phone, $email, $address, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Müşteri başarıyla güncellendi.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Güncelleme sırasında hata oluştu.']);
}

$stmt->close();
$conn->close();
?>
