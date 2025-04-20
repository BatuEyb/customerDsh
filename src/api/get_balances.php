<?php
include 'api.php'; // Veritabanı bağlantısı
include 'session.php';

$response = [];

try {
    // Tüm müşterilerin borç, ödeme ve bakiye durumlarını çek
    $stmt = $conn->prepare("
        SELECT 
            c.id AS customer_id,
            c.name AS customer_name,
            c.email,
            c.phone,
            c.address,
            c.customer_type,
            c.tax_number,
            c.tc_identity_number,

            -- Borç toplamı
            IFNULL(SUM(CASE WHEN t.type = 'Borç' THEN t.amount ELSE 0 END), 0) AS total_debt,

            -- Ödeme toplamı
            IFNULL(SUM(CASE WHEN t.type = 'Ödeme' THEN t.amount ELSE 0 END), 0) AS total_payment,

            -- Bakiye = borç - ödeme
            IFNULL(SUM(CASE WHEN t.type = 'Borç' THEN t.amount ELSE 0 END), 0) - 
            IFNULL(SUM(CASE WHEN t.type = 'Ödeme' THEN t.amount ELSE 0 END), 0) AS balance

        FROM customers c
        LEFT JOIN transactions t ON c.id = t.customer_id
        GROUP BY c.id
        ORDER BY c.name ASC
    ");

    $stmt->execute();
    $result = $stmt->get_result();

    $balances = [];

    while ($row = $result->fetch_assoc()) {
        $balances[] = $row;
    }

    $response['success'] = true;
    $response['balances'] = $balances;

} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
