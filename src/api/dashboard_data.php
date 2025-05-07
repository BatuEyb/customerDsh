<?php
// dashboard_api.php
// Tüm dashboard verilerini sağlayan API script'i

include 'api.php';
include 'session.php'; // Oturum işlemleri
// İstek metodu GET olmalı
$action = isset($_GET['action']) ? $_GET['action'] : null;

switch ($action) {
    // 1. Toplam Müşteri Sayısı
    case 'total_customers':
        $sql = "SELECT COUNT(*) AS total_customers FROM customers";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        echo json_encode($row);
        break;

    // 2. Toplam Sipariş Sayısı
    case 'total_orders':
        $sql = "SELECT COUNT(*) AS total_orders FROM orders";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        echo json_encode($row);
        break;

    // 3. Toplam Bakiye, Borç ve Ödeme
    case 'balance':
        $sql = "SELECT
                    SUM(CASE WHEN type = 'Borç' THEN amount ELSE 0 END) AS total_debt,
                    SUM(CASE WHEN type = 'Ödeme' THEN amount ELSE 0 END) AS total_payment,
                    (SUM(CASE WHEN type = 'Ödeme' THEN amount ELSE 0 END)
                     - SUM(CASE WHEN type = 'Borç' THEN amount ELSE 0 END)) AS total_balance
                FROM transactions";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        echo json_encode($row);
        break;

    // 4. Son 7 Günlük Sipariş Hareketleri
    case 'recent_movements':
        $sql = "SELECT DATE(created_at) AS date, COUNT(*) AS count
                FROM orders
                WHERE created_at >= CURDATE() - INTERVAL 7 DAY
                GROUP BY DATE(created_at)
                ORDER BY date ASC";
        $result = $conn->query($sql);
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    // 5. Önümüzdeki 7 Günlük Randevular
    case 'upcoming_appointments':
        $sql = "SELECT * FROM installations
                WHERE randevu_tarihi BETWEEN CURDATE() AND CURDATE() + INTERVAL 7 DAY
                ORDER BY randevu_tarihi ASC";
        $result = $conn->query($sql);
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    // 6. Son Eklenen 7 Müşteri
    case 'recent_customers':
        $sql = "SELECT * FROM customers
                ORDER BY created_at DESC
                LIMIT 7";
        $result = $conn->query($sql);
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    // 7. Müşteri Temsilcisi Bazlı Satış
    case 'sales_by_rep':
        $sql = "SELECT
                    u.id AS user_id,
                    u.name AS representative,
                    COUNT(o.id) AS total_sales_count,
                    SUM(o.total_amount) AS total_sales_revenue
                FROM users u
                LEFT JOIN orders o ON u.id = o.created_by
                GROUP BY u.id, u.name
                ORDER BY total_sales_revenue DESC";
        $result = $conn->query($sql);
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    // 8. Marka Bazlı Satış Dağılımı (Sadece "Kombi" kategorisi)
    case 'brand_sales_distribution':
        $sql = "SELECT
                    u.name AS representative,
                    s.brand,
                    COUNT(oi.id) AS quantity_sold
                FROM users u
                JOIN orders o ON u.id = o.created_by
                JOIN order_items oi ON o.id = oi.order_id
                JOIN stocks s ON oi.stock_id = s.id
                JOIN categories c ON s.category_id = c.id
                WHERE c.name = 'Kombi'
                GROUP BY u.name, s.brand";
        $result = $conn->query($sql);
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    // 9. Kombi Kategorisi Satış Özeti (marka bazında)
    case 'kombi_sales_by_rep':
    // Her temsilci için "Kombi" kategorisinden satılan ürünleri marka bazında say
    $sql = "SELECT
                u.id AS user_id,
                u.name AS representative,
                s.brand,
                COUNT(oi.id) AS sold_count
            FROM users u
            JOIN orders o ON u.id = o.created_by
            JOIN order_items oi ON o.id = oi.order_id
            JOIN stocks s ON oi.stock_id = s.id
            JOIN categories c ON s.category_id = c.id
            WHERE c.name = 'Kombi'
            GROUP BY u.id, u.name, s.brand";
    $result = $conn->query($sql);
    $temp = [];
    while ($row = $result->fetch_assoc()) {
        $uid = $row['user_id'];
        if (!isset($temp[$uid])) {
            $temp[$uid] = [
                'user_id' => $uid,
                'representative' => $row['representative'],
                'kombi_sold_count' => 0,
                'brands' => []
            ];
        }
        // Toplam satışı güncelle
        $temp[$uid]['kombi_sold_count'] += (int)$row['sold_count'];
        // Marka bazında adet
        $temp[$uid]['brands'][$row['brand']] = (int)$row['sold_count'];
    }
    $data = array_values($temp);

    // En çok satış yapan kullanıcıyı en üstte göstermek için sırala
    usort($data, function($a, $b) {
        return $b['kombi_sold_count'] <=> $a['kombi_sold_count'];
    });

    echo json_encode($data);
    break;

    // 10. Verilen Teklifler ve Detayları
    case 'quotes_overview':
    // Teklif bilgileri
    $quotes = [];
    $sql1 = "SELECT
                qt.id,
                qt.customer_id,
                qt.total_amount,
                qt.status,
                qt.created_by,
                qt.created_at,
                u.name AS creator_name
                FROM quotes qt
                LEFT JOIN users u ON qt.created_by = u.id";
    $res1 = $conn->query($sql1);
    while ($q = $res1->fetch_assoc()) {
        $q['total_amount'] = (float)$q['total_amount'];
        $q['items'] = [];
        $quotes[$q['id']] = $q;
    }
    // Teklif öğeleri
    $sql2 = "SELECT
                qi.quote_id,
                s.product_name,
                qi.quantity,
                qi.unit_price,
                qi.discounted_unit_price,
                qi.total_price
                FROM quote_items qi
                JOIN stocks s ON qi.stock_id = s.id";
    $res2 = $conn->query($sql2);
    while ($item = $res2->fetch_assoc()) {
        $item['quantity'] = (int)$item['quantity'];
        $item['unit_price'] = (float)$item['unit_price'];
        $item['discounted_unit_price'] = isset($item['discounted_unit_price']) ? (float)$item['discounted_unit_price'] : null;
        $item['total_price'] = (float)$item['total_price'];
        $quotes[$item['quote_id']]['items'][] = $item;
    }
    // Sonuç
    echo json_encode(array_values($quotes));
    break;

    // 11. Verilen Siparişler
    case 'orders_overview':
    $orders = [];
    $sql1 = "SELECT o.id, o.customer_id, o.total_amount, o.status, o.created_by, o.created_at,
                        c.name AS customer_name, u.name AS creator_name
                FROM orders o
                LEFT JOIN customers c ON o.customer_id = c.id
                LEFT JOIN users u ON o.created_by = u.id";
    $res1 = $conn->query($sql1);
    while ($o = $res1->fetch_assoc()) {
        $o['total_amount'] = (float)$o['total_amount'];
        $o['items'] = [];
        $orders[$o['id']] = $o;
    }
    $sql2 = "SELECT oi.order_id, s.product_name, oi.quantity, oi.unit_price, oi.discounted_unit_price, oi.total_amount
                FROM order_items oi JOIN stocks s ON oi.stock_id = s.id";
    $res2 = $conn->query($sql2);
    while ($item = $res2->fetch_assoc()) {
        $item['quantity'] = (int)$item['quantity'];
        $item['unit_price'] = (float)$item['unit_price'];
        $item['discounted_unit_price'] = $item['discounted_unit_price'] !== null ? (float)$item['discounted_unit_price'] : null;
        $item['total_amount'] = (float)$item['total_amount'];
        $orders[$item['order_id']]['items'][] = $item;
    }
    echo json_encode(array_values($orders));
    break;

    // 12. Bugün Gelen Ödemeler
    case 'today_payments':
    $data = [];
    // Sadece 'Ödeme' tipi ve bugünün tarihindeki işlemler
    $sql = "SELECT
                t.id,
                t.customer_id,
                t.amount,
                t.description,
                t.transaction_date,
                c.name AS customer_name,
                u.name AS processed_by
            FROM transactions t
            LEFT JOIN customers c ON t.customer_id = c.id
            LEFT JOIN users u ON t.created_by = u.id
            WHERE t.type = 'Ödeme'
                AND DATE(t.transaction_date) = CURDATE()
            ORDER BY t.transaction_date ASC";
    $res = $conn->query($sql);
    while ($row = $res->fetch_assoc()) {
        $row['amount'] = (float)$row['amount'];
        $data[] = $row;
    }
    echo json_encode($data);
    break;

    // 13. Kombi Marka Satış Özeti
    case 'kombi_sales_by_brand':
    $data = [];
    $sql = "SELECT
                s.brand,
                SUM(oi.quantity) AS total_sold,
                SUM(CASE WHEN o.status = 'İş Tamamlandı' THEN oi.quantity ELSE 0 END) AS completed,
                SUM(CASE WHEN o.status <> 'İş Tamamlandı' THEN oi.quantity ELSE 0 END) AS pending
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN stocks s ON oi.stock_id = s.id
            JOIN categories c ON s.category_id = c.id
            WHERE c.name = 'Kombi'
            GROUP BY s.brand";
    $res = $conn->query($sql);
    while ($row = $res->fetch_assoc()) {
        $row['total_sold'] = (int)$row['total_sold'];
        $row['completed'] = (int)$row['completed'];
        $row['pending'] = (int)$row['pending'];
        $data[] = $row;
    }
    echo json_encode($data);
    break;

    // 14. Tüm Siparişler Listesi (sadece installation’ı olanlar + order_type eklendi)
case 'orders_list':
    $orders = [];
    $sql = "
        SELECT
          o.id,
          o.customer_id,
          c.name           AS customer_name,
          o.status,
          o.total_amount,
          o.order_type,                    -- yeni alan
          o.created_at,
          u.name           AS creator_name,
          MAX(inst.hata_durumu)  AS has_error,
          MAX(inst.ad_soyad)    AS ad_soyad,
          MAX(inst.igdas_adi)   AS igdas_adi,
          MAX(inst.tuketim_no)  AS tuketim_no,
          MAX(inst.telefon1)    AS telefon1,
          MAX(inst.sokak_adi)   AS sokak_adi,
          MAX(inst.bina_no)     AS bina_no,
          MAX(inst.daire_no)    AS daire_no
        FROM orders o
        INNER JOIN order_items oi      ON o.id = oi.order_id
        INNER JOIN installations inst  ON oi.id = inst.order_item_id
        LEFT JOIN customers c          ON o.customer_id = c.id
        LEFT JOIN users u              ON o.created_by = u.id
        WHERE o.status != 'İş Tamamlandı'  -- <<< filtre eklendi
        GROUP BY o.id
        ORDER BY o.created_at DESC
    ";
    if (!($res = $conn->query($sql))) {
        echo json_encode(['error' => $conn->error]);
        exit;
    }
    while ($row = $res->fetch_assoc()) {
        $orders[] = [
            'id'             => (int)  $row['id'],
            'customer_id'    => (int)  $row['customer_id'],
            'customer_name'  =>        $row['customer_name'],
            'status'         =>        $row['status'],
            'order_type'     =>        $row['order_type'],    // yeni ekleme
            'total_amount'   => (float)$row['total_amount'],
            'created_at'     =>        $row['created_at'],
            'creator_name'   =>        $row['creator_name'],
            'ad_soyad'       =>        $row['ad_soyad'],
            'igdas_adi'      =>        $row['igdas_adi'],
            'tuketim_no'     =>        $row['tuketim_no'],
            'telefon1'       =>        $row['telefon1'],
            'sokak_adi'      =>        $row['sokak_adi'],
            'bina_no'        =>        $row['bina_no'],
            'daire_no'       =>        $row['daire_no'],
            'has_error'      => (int)  $row['has_error'],
        ];
    }
    echo json_encode($orders);
    break;

}

// Bağlantıyı kapat
$conn->close();
?>
