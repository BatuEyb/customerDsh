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

    // 3. Toplam Bakiye, Borç ve Ödeme (hem genel hem müşteri bazlı)
case 'balance':
    // 1) Genel toplamlar
    $sql = "
        SELECT
            SUM(CASE WHEN type = 'Borç'  THEN amount ELSE 0 END) AS total_debt,
            SUM(CASE WHEN type = 'Ödeme' THEN amount ELSE 0 END) AS total_payment,
            (SUM(CASE WHEN type = 'Ödeme' THEN amount ELSE 0 END)
             - SUM(CASE WHEN type = 'Borç'  THEN amount ELSE 0 END)
            ) AS total_balance
        FROM transactions
    ";
    $res = $conn->query($sql);
    if (!$res) {
        echo json_encode(['success'=>false,'message'=>$conn->error]);
        exit;
    }
    $totals = $res->fetch_assoc();

    // 2) Net bakiyesi negatif (yani borç > ödeme) olan müşteriler
    $custSql = "
        SELECT
            c.id            AS customer_id,
            c.name          AS customer_name,
            (
              SUM(CASE WHEN t.type = 'Ödeme' THEN t.amount ELSE 0 END)
              - SUM(CASE WHEN t.type = 'Borç'  THEN t.amount ELSE 0 END)
            ) AS net_balance
        FROM transactions t
        JOIN customers c ON t.customer_id = c.id
        GROUP BY c.id, c.name
        HAVING net_balance < 0
        ORDER BY net_balance ASC
    ";
    $custRes = $conn->query($custSql);
    $byCustomer = [];
    if ($custRes) {
        while ($row = $custRes->fetch_assoc()) {
            $byCustomer[] = [
                'customer_id'   => (int)   $row['customer_id'],
                'customer_name' =>         $row['customer_name'],
                'net_balance'   => (float) $row['net_balance'],  // negatif bir değer
            ];
        }
    }

    // 3) JSON olarak geri dön
    echo json_encode([
        'success'        => true,
        'total_debt'     => (float)$totals['total_debt'],
        'total_payment'  => (float)$totals['total_payment'],
        'total_balance'  => (float)$totals['total_balance'],
        'by_customer'    => $byCustomer
    ]);
    break;

    // 4. Son 7 Günlük Sipariş Hareketleri (Tutar Bazlı)
    case 'recent_movements':
        $sql = "SELECT DATE(created_at) AS date, SUM(total_amount) AS total_amount
                FROM orders
                WHERE created_at >= CURDATE() - INTERVAL 7 DAY
                GROUP BY DATE(created_at)
                ORDER BY date ASC";
        $result = $conn->query($sql);
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = [
                'date' => $row['date'],
                'total_amount' => (float)$row['total_amount'] // JSON çıktısında float olarak
            ];
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
    s.brand,
    COUNT(oi.id) AS quantity_sold
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN stocks s ON oi.stock_id = s.id
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'Kombi'
GROUP BY s.brand";
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
    $sql1 = "SELECT o.id, o.customer_id, o.total_amount, o.created_by, o.created_at,
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

    // 13. Kombi Marka Satış Özeti (servis_yonlendirildi flag’ine göre)
    case 'kombi_sales_by_brand':
        $data = [];
        $sql = "
            SELECT
                s.brand,
                SUM(oi.quantity) AS total_sold,
                SUM(oi.quantity) AS total_sold,   
                SUM(CASE WHEN oi.order_item_status = 'İş Tamamlandı' THEN oi.quantity ELSE 0 END) AS completed,
                SUM(CASE WHEN oi.order_item_status <> 'İş Tamamlandı' THEN oi.quantity ELSE 0 END) AS pending
            FROM order_items oi
            JOIN stocks s       ON oi.stock_id     = s.id
            JOIN categories c   ON s.category_id   = c.id
            WHERE c.name = 'Kombi'
            GROUP BY s.brand
        ";
        $res = $conn->query($sql);
        while ($row = $res->fetch_assoc()) {
            $row['total_sold'] = (int)$row['total_sold'];
            $row['completed']  = (int)$row['completed'];
            $row['pending']    = (int)$row['pending'];
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    // 14. Tüm Siparişler Listesi
    case 'orders_list':
        $rows = [];
        $sql = "
          SELECT
            inst.id                AS installation_id,
            inst.tuketim_no,
            inst.igdas_adi,
            inst.randevu_tarihi,
            inst.ad_soyad,
            inst.telefon1,
            inst.telefon2,
            inst.sokak_adi,
            inst.bina_no,
            inst.daire_no,
            oi.order_item_status               AS order_status,
            o.order_type,
            oi.serial_number,
            s.brand,
            c.name                 AS customer_name
          FROM installations inst
          JOIN order_items oi ON inst.order_item_id = oi.id
          JOIN orders o       ON oi.order_id        = o.id
          JOIN customers c    ON o.customer_id      = c.id
          JOIN stocks s       ON oi.stock_id        = s.id
          WHERE oi.order_item_status != 'İş Tamamlandı'
            AND DATE(o.updated_at) = CURDATE()
          ORDER BY inst.created_at DESC
        ";
    
        $res = $conn->query($sql);
        if (!$res) {
            echo json_encode(['error' => $conn->error]);
            exit;
        }
    
        while ($r = $res->fetch_assoc()) {
            $rows[] = [
                'installation_id' => (int)$r['installation_id'],
                'tuketim_no'      => $r['tuketim_no'],
                'igdas_adi'       => $r['igdas_adi'],
                'randevu_tarihi'  => $r['randevu_tarihi'],
                'ad_soyad'        => $r['ad_soyad'],
                'telefon1'        => $r['telefon1'],
                'telefon2'        => $r['telefon2'],
                'sokak_adi'       => $r['sokak_adi'],
                'bina_no'         => $r['bina_no'],
                'daire_no'        => $r['daire_no'],
                'order_status'    => $r['order_status'],
                'order_type'      => $r['order_type'],
                'serial_number'   => $r['serial_number'],
                'brand'           => $r['brand'],
                'customer_name'   => $r['customer_name']
            ];
        }
    
        echo json_encode($rows);
        break;    
    

}

// Bağlantıyı kapat
$conn->close();
?>
