<?php
include 'api.php'; // Veritabanı bağlantısı
include 'session.php' ;

$created_by = $_SESSION['user_id']; // Oturumdaki kullanıcı ID'si
$username = $_SESSION['username']; // Oturumdaki kullanıcı adı


// Ürünleri listeleme
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM stocks";
    $result = $conn->query($sql);
    $stocks = [];
    
    while ($row = $result->fetch_assoc()) {
        $stocks[] = $row;
    }
    
    echo json_encode($stocks);
    exit;
}

// Silme işlemi
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    $delete_id = $data->id;
    $delete_item = $data->product_name;
    
    $delete_sql = "DELETE FROM stocks WHERE id = ?";
    $stmt = $conn->prepare($delete_sql);
    $stmt->bind_param("s", $delete_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Ürün başarıyla silindi!']);
        log_activity("Ürün Silindi: $delete_item");
    } else {
        echo json_encode(['success' => false, 'message' => 'Silme işlemi başarısız!']);
    }
    exit;
}

// Ürün Ekleme ve Güncelleme
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    // Verinin içinde 'id' olup olmadığını kontrol et
    if (isset($data->id)) {
        $id = $data->id;
        $stock_code = $data->stock_code;
        $product_name = $data->product_name;
        $brand = $data->brand;
        $quantity = $data->quantity;
        $price = $data->price;
        $category_id = $data->category_id;

        // 1. Eski veriyi çek
        $old_sql = "SELECT * FROM stocks WHERE id = ?";
        $stmt_old = $conn->prepare($old_sql);
        $stmt_old->bind_param("i", $id);
        $stmt_old->execute();
        $old_result = $stmt_old->get_result();
        $old_data = $old_result->fetch_assoc();

        if (!$old_data) {
            echo json_encode(['success' => false, 'message' => 'Eski veri bulunamadı!']);
            exit;
        }

        // 2. Güncelleme işlemi
        $update_sql = "UPDATE stocks SET stock_code = ?, product_name = ?, brand = ?, quantity = ?, price = ?, updated_by = ?, updated_at = NOW(), category_id = ? WHERE id = ?";
        $stmt = $conn->prepare($update_sql);
        $stmt->bind_param("sssdisss", $stock_code, $product_name, $brand, $quantity, $price, $created_by, $category_id, $id);

        if ($stmt->execute()) {
            // 3. Log formatı (değişenleri yazmak için)
            $log_message = "Ürün Güncellendi: $product_name ->-> ";

            if ($old_data['stock_code'] !== $stock_code) {
                $log_message .= "Stok Kodu: {$old_data['stock_code']} → {$stock_code}\n";
            }
            if ($old_data['product_name'] !== $product_name) {
                $log_message .= "Ürün Adı: {$old_data['product_name']} → {$product_name}\n";
            }
            if ($old_data['brand'] !== $brand) {
                $log_message .= "Marka: {$old_data['brand']} → {$brand}\n";
            }
            if ($old_data['quantity'] != $quantity) {
                $log_message .= "Stok Miktarı: {$old_data['quantity']} → {$quantity}\n";
            }
            if ($old_data['price'] != $price) {
                $log_message .= "Fiyat: {$old_data['price']} → {$price}\n";
            }
            if ($old_data['category_id'] != $category_id) {
                $log_message .= "Kategori ID: {$old_data['category_id']} → {$category_id}\n";
            }

            log_activity($log_message); // ⬅️ Güncellenmiş log kaydı

            echo json_encode(['success' => true, 'message' => 'Ürün başarıyla güncellendi!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Güncelleme işlemi başarısız!']);
        }
    } else {
        // Ekleme işlemi (id yok)
        $stock_code = $data->stock_code;
        $product_name = $data->product_name;
        $brand = $data->brand;
        $quantity = $data->quantity;
        $price = $data->price;
        $category_id = $data->category_id;

        $insert_sql = "INSERT INTO stocks (stock_code, product_name, brand, quantity, price, created_by, updated_by, category_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        $stmt = $conn->prepare($insert_sql);
        $stmt->bind_param("sssdisss", $stock_code, $product_name, $brand, $quantity, $price, $created_by, $created_by, $category_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Ürün başarıyla eklendi!']);
            log_activity("Ürün eklendi: $product_name, Stock Code: $stock_code");
        } else {
            echo json_encode(['success' => false, 'message' => 'Ekleme işlemi başarısız!']);
        }
    }

    exit;
}

?>