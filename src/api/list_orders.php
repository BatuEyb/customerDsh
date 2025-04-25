<?php
include 'api.php'; // veritabanı bağlantısı
include 'session.php';

$response = [];

try {
    // Siparişleri ve müşteri bilgilerini çek
    $ordersSql = "
        SELECT 
            o.id AS id,
            o.customer_id,
            c.name AS customer_name,
            c.address AS customer_address,
            c.email AS customer_email,
            c.phone AS customer_phone,
            o.total_amount,
            o.status,
            u.name AS created_by_name,
            o.created_at,
            o.updated_at
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        LEFT JOIN users u ON o.created_by = u.id
        ORDER BY o.created_at DESC
    ";
    $stmt = $conn->prepare($ordersSql);
    $stmt->execute();
    $orderResult = $stmt->get_result();

    $orders = [];

    while ($row = $orderResult->fetch_assoc()) {
        $order_id = $row['id'];

        // Bu siparişe ait ürünleri çek
        $itemsSql = "
            SELECT 
                oi.stock_id,
                s.product_name,
                oi.unit_price,
                oi.discount,
                oi.discounted_unit_price,
                oi.total_amount,
                oi.serial_number
            FROM order_items oi
            JOIN stocks s ON oi.stock_id = s.id
            WHERE oi.order_id = ?
        ";
        $itemsStmt = $conn->prepare($itemsSql);
        $itemsStmt->bind_param("i", $order_id);
        $itemsStmt->execute();
        $itemsResult = $itemsStmt->get_result();

        $items = [];
        while ($item = $itemsResult->fetch_assoc()) {
            $items[] = [
                'stock_id' => (int)$item['stock_id'],
                'product_name' => $item['product_name'],
                'unit_price' => (float)$item['unit_price'],
                'discount' => (float)$item['discount'],
                'discounted_unit_price' => isset($item['discounted_unit_price']) ? (float)$item['discounted_unit_price'] : null,
                'total_amount' => (float)$item['total_amount'],
                'serial_number' => $item['serial_number'],
            ];
        }

        $row['items'] = $items;
        $orders[] = $row;
    }

    $response['success'] = true;
    $response['orders'] = $orders;

} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>