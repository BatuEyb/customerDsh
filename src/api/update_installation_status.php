<?php
include 'api.php';
include 'session.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if (empty($data['installation_id']) || !isset($data['order_item_status'])) {
    echo json_encode(['success'=>false,'message'=>'Eksik parametre']);
    exit;
}

$id     = (int)$data['installation_id'];
$status = $conn->real_escape_string($data['order_item_status']);

$stmt = $conn->prepare("
    UPDATE order_items oi
    JOIN installations inst ON oi.id = inst.order_item_id
    JOIN orders o          ON oi.order_id = o.id
    SET
      oi.order_item_status = ?,
      o.updated_at         = NOW()
    WHERE inst.id = ?
");
$stmt->bind_param('si', $status, $id);

if ($stmt->execute()) {
    echo json_encode(['success'=>true]);
} else {
    echo json_encode(['success'=>false,'message'=>$stmt->error]);
}
