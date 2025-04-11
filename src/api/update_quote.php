<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
include 'api.php'; // Veritabanı bağlantısı (muhtemelen $conn içeriyor)
include 'session.php';

// Oturumdaki kullanıcı ID ve adı
$created_by = $_SESSION['user_id'];
$username = $_SESSION['username'];

// JSON verisini al
$data = json_decode(file_get_contents("php://input"));

// ID'nin geçerli olup olmadığını kontrol et
if (!isset($data->id) || !is_numeric($data->id)) {
    echo json_encode(["success" => false, "message" => "Geçersiz teklif ID."]);
    exit();
}

$id = $data->id;

// Teklif bilgileri
$customer_id = $data->customer_id ?? null;
$status = $data->status ?? 'Bekliyor';
$total_amount = $data->total_amount ?? 0;
$items = $data->items ?? [];

try {
    // Teklif bilgilerini güncelle
    $update_query = "UPDATE quotes SET customer_id = ?, status = ?, total_amount = ?, updated_by = ? WHERE id = ?";
    $stmt = $conn->prepare($update_query);
    $stmt->bind_param("isdsi", $customer_id, $status, $total_amount, $created_by, $id);
    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Teklif güncellenemedi.']);
        exit;
    }

    // Ürünleri güncelle
    foreach ($items as $item) {
        // Her ürün için gerekli verilerin eksik olup olmadığını kontrol et
        $stock_id = $item->stock_id ?? null;
        $quantity = $item->quantity ?? 0;
        $unit_price = $item->unit_price ?? 0;
        $discounted_unit_price = $item->discounted_unit_price ?? 0;
        $discount = $item->discount ?? 0;
        $total_price = $item->total_price ?? 0;

        // Eğer Stock ID eksikse, hata mesajı döndür
        if ($stock_id === null) {
            echo json_encode(['success' => false, 'message' => 'Stock ID eksik!']);
            exit;
        }

        // Ürünü güncelle
        $update_item_query = "UPDATE quote_items 
                              SET quantity = ?, unit_price = ?, discounted_unit_price = ?, discount = ?, total_price = ? 
                              WHERE quote_id = ? AND stock_id = ?";
        $stmt_item = $conn->prepare($update_item_query);
        $stmt_item->bind_param("iddddii", $quantity, $unit_price, $discounted_unit_price, $discount, $total_price, $id, $stock_id);
        if (!$stmt_item->execute()) {
            echo json_encode(['success' => false, 'message' => 'Ürün güncellenemedi.']);
            exit;
        }
    }

    // Güncellenmiş verileri al
    $get_updated_quote_query = "SELECT * FROM quotes WHERE id = ?";
    $stmt_get_quote = $conn->prepare($get_updated_quote_query);
    $stmt_get_quote->bind_param("i", $id);
    $stmt_get_quote->execute();
    $result_quote = $stmt_get_quote->get_result();
    
    if ($result_quote->num_rows > 0) {
        $updated_quote = $result_quote->fetch_assoc();

        // Teklifin müşteri bilgilerini de almak için JOIN
        $get_customer_query = "SELECT * FROM customers WHERE id = ?";
        $stmt_get_customer = $conn->prepare($get_customer_query);
        $stmt_get_customer->bind_param("i", $updated_quote['customer_id']);
        $stmt_get_customer->execute();
        $result_customer = $stmt_get_customer->get_result();
        
        $customer = null;
        if ($result_customer->num_rows > 0) {
            $customer = $result_customer->fetch_assoc();
        }

        // Teklifin ürünlerini ve ürün adlarını al (stock_name'yi de dahil et)
        $get_items_query = "
            SELECT qi.*, s.product_name 
            FROM quote_items qi
            JOIN stocks s ON qi.stock_id = s.id
            WHERE qi.quote_id = ?";
        $stmt_get_items = $conn->prepare($get_items_query);
        $stmt_get_items->bind_param("i", $id);
        $stmt_get_items->execute();
        $result_items = $stmt_get_items->get_result();
        
        $items = [];
        while ($item_row = $result_items->fetch_assoc()) {
            // Her item'a stock_name ekliyoruz
            $items[] = $item_row;
        }

        // Güncellenmiş verileri JSON formatında döndür
        $response = array_merge($updated_quote, ['items' => $items]);
        if ($customer) {
            $response['customer'] = $customer; // Müşteri bilgilerini ekliyoruz
        }

        echo json_encode([
            'success' => true,
            'message' => 'Teklif başarıyla güncellendi.',
            'quote' => $response  // Teklif ve ürünler verisini birleştiriyoruz
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Teklif bulunamadı.']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Hata: ' . $e->getMessage()]);
}
?>
