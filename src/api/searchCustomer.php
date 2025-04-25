<?php
include 'api.php';
include 'session.php';

$customerType = isset($_GET['customer_type']) ? $_GET['customer_type'] : '';
$search = isset($_GET['search']) ? '%' . $_GET['search'] . '%' : '';

// Sorguyu parçalı kur
if ($customerType !== '' && $search !== '') {
    $stmt = $conn->prepare("SELECT * FROM customers WHERE customer_type = ? AND name LIKE ? ORDER BY updated_at DESC");
    $stmt->bind_param("ss", $customerType, $search);
} elseif ($customerType !== '') {
    $stmt = $conn->prepare("SELECT * FROM customers WHERE customer_type = ? ORDER BY updated_at DESC");
    $stmt->bind_param("s", $customerType);
} elseif ($search !== '') {
    $stmt = $conn->prepare("SELECT * FROM customers WHERE name LIKE ? ORDER BY updated_at DESC");
    $stmt->bind_param("s", $search);
} else {
    $stmt = $conn->prepare("SELECT * FROM customers ORDER BY updated_at DESC");
}

$stmt->execute();
$result = $stmt->get_result();

$customers = [];
while($row = $result->fetch_assoc()) {
    $customers[] = $row;
}

echo json_encode([
    "success" => true,
    "customers" => $customers
  ]);
$conn->close();
?>
