<?php
include 'api.php'; // veritabanı bağlantısı
include 'session.php';

$customerId = isset($_GET['customer_id']) 
    ? (int) $_GET['customer_id'] 
    : 0;

$response = [];

try {
    // 1) SQL’i WHERE şartı ile birlikte kur
    $whereClause = '';
    if ($customerId > 0) {
        $whereClause = 'WHERE o.customer_id = ?';
    }

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
            o.order_type,
            u.name AS created_by_name,
            o.created_at,
            o.updated_at
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        LEFT JOIN users u ON o.created_by = u.id
        {$whereClause}
        ORDER BY o.created_at DESC
    ";
    // 2) Hazırlama ve parametre bind
    $stmt = $conn->prepare($ordersSql);
    if ($customerId > 0) {
        $stmt->bind_param("i", $customerId);
    }
    $stmt->execute();
    $orderResult = $stmt->get_result();

    $orders = [];

    while ($row = $orderResult->fetch_assoc()) {
        $order_id = $row['id'];

        // Bu siparişe ait ürünleri çek
        $itemsSql = "
            SELECT
                oi.id AS order_item_id,
                oi.stock_id,
                s.product_name,
                oi.unit_price,
                oi.discount,
                oi.discounted_unit_price,
                oi.total_amount,
                oi.serial_number,
                -- installations tablosundan LEFT JOIN ile verileri alıyoruz
                inst.tuketim_no,
                inst.igdas_adi    AS service_name,
                inst.ad_soyad,
                inst.telefon1     AS phone_number,
                inst.telefon2     AS phone_number2,
                inst.il,
                inst.ilce,
                inst.mahalle,
                inst.sokak_adi,
                inst.bina_no,
                inst.daire_no,
                inst.randevu_tarihi,
                inst.hata_durumu,
                inst.hata_sebebi,
                inst.not_text
            FROM order_items oi
            JOIN stocks s ON oi.stock_id = s.id
            LEFT JOIN installations inst 
              ON inst.order_item_id = oi.id
            WHERE oi.order_id = ?
            ORDER BY oi.total_amount DESC
        ";
        $itemsStmt = $conn->prepare($itemsSql);
        $itemsStmt->bind_param("i", $order_id);
        $itemsStmt->execute();
        $itemsResult = $itemsStmt->get_result();

        $items = [];
        while ($item = $itemsResult->fetch_assoc()) {
            // Adres bilgisini tek bir string olarak hazırlayalım
            $addressParts = [];
            foreach (['il','ilce','mahalle','sokak_adi','bina_no','daire_no'] as $field) {
                if (!empty($item[$field])) {
                    $addressParts[] = $item[$field];
                }
            }
            $fullAddress = $addressParts ? implode(', ', $addressParts) : null;

            $installation = null;
            // Eğer LEFT JOIN sonucu tuketim_no alanı doluysa kurulumu var demektir
            if ($item['tuketim_no'] !== null) {
                $installation = [
                    'tuketim_no'    => $item['tuketim_no'],
                    'service_name'  => $item['service_name'],
                    'ad_soyad'      => $item['ad_soyad'],
                    'phone_number'  => $item['phone_number'],
                    'phone_number2' => $item['phone_number2'],
                    'randevu_tarihi' => $item['randevu_tarihi'],
                    'hata_durumu' => $item['hata_durumu'],
                    'hata_sebebi' => $item['hata_sebebi'],
                    'not_text' => $item['not_text'],
                    'address'       => $fullAddress,
                ];
            }

            $items[] = [
                'order_item_id' => (int)$item['order_item_id'],
                'stock_id' => (int)$item['stock_id'],
                'product_name' => $item['product_name'],
                'unit_price' => (float)$item['unit_price'],
                'discount' => (float)$item['discount'],
                'discounted_unit_price' => isset($item['discounted_unit_price']) ? (float)$item['discounted_unit_price'] : null,
                'total_amount' => (float)$item['total_amount'],
                'serial_number' => $item['serial_number'],
                'installation'         => $installation,
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