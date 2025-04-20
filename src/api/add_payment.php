<?php
include 'api.php'; // Veritabanı bağlantısı
include 'session.php';

$response = [];

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['customer_id'], $data['amount'])) {
        throw new Exception("Eksik parametreler.");
    }

    $customer_id = $data['customer_id'];
    $order_id = isset($data['order_id']) && !empty($data['order_id']) ? $data['order_id'] : null;
    $amount = $data['amount'];
    $description = isset($data['description']) ? $data['description'] : "Manuel ödeme";
    $created_by = $_SESSION['user_id'];
    $updated_by = $_SESSION['user_id'];

    $stmt = $conn->prepare("
        INSERT INTO transactions 
        (customer_id, order_id, type, amount, description, created_by, updated_by, created_at, updated_at)
        VALUES (?, ?, 'Ödeme', ?, ?, ?, ?, NOW(), NOW())
    ");
    $stmt->bind_param("iidsss", $customer_id, $order_id, $amount, $description, $created_by, $updated_by);
    $stmt->execute();

    $response['success'] = true;
    $response['message'] = "Ödeme başarıyla eklendi.";

} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
