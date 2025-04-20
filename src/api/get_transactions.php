<?php
// get_transactions.php
// Müşteriye ait işlemleri getirir (Borç ve Ödeme geçmişi)

include 'api.php';  // Veritabanı bağlantısı
include 'session.php';  // Kullanıcı oturum kontrolü, gerekirse

header('Content-Type: application/json; charset=utf-8');

$response = [];

try {
    // customer_id parametresini al
    if (!isset($_GET['customer_id']) || !is_numeric($_GET['customer_id'])) {
        throw new Exception('Geçersiz müşteri ID');
    }
    $customer_id = intval($_GET['customer_id']);

    // İşlemleri çek
    $sql = "
        SELECT
            order_id,
            type,
            amount,
            description,
            transaction_date
        FROM transactions
        WHERE customer_id = ?
        ORDER BY transaction_date ASC
    ";
    $stmt = $conn->prepare($sql);
    if (! $stmt) {
        throw new Exception('Hazırlama hatası: ' . $conn->error);
    }
    $stmt->bind_param('i', $customer_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        // Tarihi ISO 8601 formatına dönüştürebilirsiniz
        $transactions[] = [
            'order_id'         => (int) $row['order_id'],
            'type'             => $row['type'],
            'amount'           => (float) $row['amount'],
            'description'      => $row['description'],
            'transaction_date' => $row['transaction_date'],
        ];
    }

    $response['success'] = true;
    $response['transactions'] = $transactions;

} catch (Exception $e) {
    http_response_code(400);
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

echo json_encode($response, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
?>
