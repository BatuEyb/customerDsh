<?php
include 'api.php'; // veritabanı bağlantısı
include 'session.php';

$response = [];

try {
    $stmt = $conn->prepare("
        SELECT 
        q.id AS quote_id,
        q.customer_id,
        c.name AS customer_name,
        c.address AS customer_address,
        c.email AS customer_email,
        c.phone AS customer_phone,
        q.total_amount,
        q.status,
        u.name AS created_by_name,  -- Kullanıcının adı
        q.created_at,
        q.updated_at
        FROM quotes q
        JOIN customers c ON q.customer_id = c.id
        LEFT JOIN users u ON q.created_by = u.id
        ORDER BY q.created_at DESC;
    ");
    $stmt->execute();
    $quoteResult = $stmt->get_result();

    $quotes = [];

    while ($row = $quoteResult->fetch_assoc()) {
        $quote_id = $row['quote_id'];

        // Teklif ürünlerini getir
        $itemsStmt = $conn->prepare("
            SELECT 
                qi.stock_id,
                s.product_name,
                qi.quantity,
                qi.unit_price,
                qi.total_price
            FROM quote_items qi
            JOIN stocks s ON qi.stock_id = s.id
            WHERE qi.quote_id = ?
        ");
        $itemsStmt->bind_param("i", $quote_id);
        $itemsStmt->execute();
        $itemsResult = $itemsStmt->get_result();

        $items = [];
        while ($item = $itemsResult->fetch_assoc()) {
            $items[] = $item;
        }

        $row['items'] = $items;
        $quotes[] = $row;
    }

    $response['success'] = true;
    $response['quotes'] = $quotes;

} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>