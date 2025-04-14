<?php
include 'api.php'; // veritabanı bağlantısı
include 'session.php';

$response = [];

try {
    $stmt = $conn->prepare("
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
        ORDER BY o.created_at DESC;
    ");
    $stmt->execute();
    $orderResult = $stmt->get_result();

    $orders = [];

    while ($row = $orderResult->fetch_assoc()) {
        $order_id = $row['id'];

        // Sipariş ürünlerini getir
        $itemsStmt = $conn->prepare("
            SELECT 
                oi.stock_id,
                s.product_name,
                oi.quantity,
                oi.unit_price,
                oi.discount, 
                oi.discounted_unit_price,
                oi.total_amount,
                oi.serial_number,
                oi.address,
                oi.service_name,
                oi.phone_number,
                oi.job_status
            FROM order_items oi
            JOIN stocks s ON oi.stock_id = s.id
            WHERE oi.order_id = ?
        ");
        $itemsStmt->bind_param("i", $order_id);
        $itemsStmt->execute();
        $itemsResult = $itemsStmt->get_result();

        $items = [];
        while ($item = $itemsResult->fetch_assoc()) {
            // serial_number virgül ile ayrılmışsa, diziye çevir
            $service_name= array_filter(array_map('trim', explode(',', $item['service_name'])));
            $phone_number= array_filter(array_map('trim', explode(',', $item['phone_number'])));
            $job_status= array_filter(array_map('trim', explode(',', $item['job_status'])));
            $address= array_filter(array_map('trim', explode(',', $item['address'])));
            $serials = array_filter(array_map('trim', explode(',', $item['serial_number'])));
            $item['serial_number'] = $serials;
            $item['address'] = $address;
            $item['service_name'] = $service_name;
            $item['phone_number'] = $phone_number;
            $item['job_status'] = $job_status;
            $items[] = $item;
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
