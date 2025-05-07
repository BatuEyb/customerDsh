<?php
include 'api.php'; include 'session.php';
$response = [];
try {
    $stmt = $conn->prepare("SELECT id, name FROM users");
    $stmt->execute();
    $result = $stmt->get_result();
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = ['id' => (int)$row['id'], 'name' => $row['name']];
    }
    $response = ['success' => true, 'users' => $users];
} catch (Exception $e) {
    $response = ['success' => false, 'message' => $e->getMessage()];
}
header('Content-Type: application/json');
echo json_encode($response);
?>