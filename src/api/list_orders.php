<?php
include 'api.php'; // veritabanı bağlantısı
include 'session.php';

$customerId     = isset($_GET['customer_id'])   ? (int) $_GET['customer_id'] : 0;
$orderType         = isset($_GET['order_type'])        ? $_GET['order_type']         : '';
$dateFrom       = isset($_GET['date_from'])     ? $_GET['date_from']      : '';
$dateTo         = isset($_GET['date_to'])       ? $_GET['date_to']        : '';
$representative = isset($_GET['representative'])? $_GET['representative'] : '';

$response = [];

try {
    // Dinamik WHERE parçalarını hazırlıyoruz
    $whereParts = [];
    $params     = [];
    $types      = '';

    if ($customerId > 0) {
        $whereParts[] = 'o.customer_id = ?';
        $params[]     = $customerId;
        $types       .= 'i';
    }

    if ($orderType !== '') {
        // Burada order_item_status filtresini ekliyoruz
        $whereParts[] = 'o.order_type = ?';
        $params[]     = $orderType;
        $types       .= 's';
    }

    if ($dateFrom !== '') {
        $whereParts[] = 'DATE(o.created_at) >= ?';
        $params[]     = $dateFrom;
        $types       .= 's';
    }
    if ($dateTo !== '') {
        $whereParts[] = 'DATE(o.created_at) <= ?';
        $params[]     = $dateTo;
        $types       .= 's';
    }

    if ($representative !== '') {
        $whereParts[] = 'o.created_by = ?';
        $params[]     = $representative;
        $types       .= 's';
    }

    $whereClause = $whereParts
        ? 'WHERE ' . implode(' AND ', $whereParts)
        : '';

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
            o.order_type,
            u.name AS created_by_name,
            u.id AS created_by_id,
            o.created_at,
            o.updated_at
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        LEFT JOIN users u ON o.created_by = u.id
        {$whereClause}
        ORDER BY o.created_at DESC
    ";

    $stmt = $conn->prepare($ordersSql);
    if (!empty($params)) {
        // bind_param için referanslar gerekiyor
        $bindNames[] = $types;
        foreach ($params as $key => $val) {
            // değişkene referans ataması
            $bindNames[] = &$params[$key];
        }
        call_user_func_array([$stmt, 'bind_param'], $bindNames);
    }
    $stmt->execute();
    $orderResult = $stmt->get_result();

    $orders = [];
    while ($row = $orderResult->fetch_assoc()) {
        $order_id = (int)$row['id'];

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
                inst.not_text,
                oi.delivery,
                oi.order_item_status
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
            if ($item['tuketim_no'] !== null) {
                $installation = [
                    'tuketim_no'    => $item['tuketim_no'],
                    'service_name'  => $item['service_name'],
                    'ad_soyad'      => $item['ad_soyad'],
                    'phone_number'  => $item['phone_number'],
                    'phone_number2' => $item['phone_number2'],
                    'randevu_tarihi'=> $item['randevu_tarihi'],
                    'hata_durumu'   => $item['hata_durumu'],
                    'hata_sebebi'   => $item['hata_sebebi'],
                    'not_text'      => $item['not_text'],
                    'address'       => $fullAddress,
                ];
            }

            $items[] = [
                'order_item_id'          => (int)$item['order_item_id'],
                'stock_id'               => (int)$item['stock_id'],
                'product_name'           => $item['product_name'],
                'unit_price'             => (float)$item['unit_price'],
                'discount'               => (float)$item['discount'],
                'discounted_unit_price'  => isset($item['discounted_unit_price']) ? (float)$item['discounted_unit_price'] : null,
                'total_amount'           => (float)$item['total_amount'],
                'serial_number'          => $item['serial_number'],
                'installation'           => $installation,
                'delivery'      => $item['delivery'],
                'order_item_status'      => $item['order_item_status'],
            ];
        }

        $row['items'] = $items;
        $orders[]     = $row;
    }

    $response['success'] = true;
    $response['orders']  = $orders;

} catch (Exception $e) {
    $response['success'] = false;
    $response['error']   = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
