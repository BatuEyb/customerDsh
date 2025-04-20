<?php
include 'api.php'; // Veritabanı bağlantısı
include 'session.php'; // Oturum işlemleri

// Oturumdaki kullanıcı ID'sini al
$created_by = $_SESSION['user_id']; // Oturumdaki kullanıcı ID'si
$updated_by = $_SESSION['user_id']; // Sipariş güncellenmesini aynı kullanıcı yapacak

// Gelen veriyi al
$data = json_decode(file_get_contents("php://input"), true);

// Verileri al
$customer_id = $data['customer_id'];
$total_amount = $data['total_amount'];
$order_items = $data['order_items']; // order_items bir dizi olacak

// Veritabanı işlemleri için başlat
$conn->begin_transaction();

try {
    // 1. Siparişi orders tablosuna ekle
    $stmt = $conn->prepare("INSERT INTO orders (customer_id, total_amount, created_by, updated_by, created_at, updated_at) 
                            VALUES (?, ?, ?, ?, NOW(), NOW())");
    $stmt->bind_param("idss", $customer_id, $total_amount, $created_by, $updated_by);
    $stmt->execute();

    // Yeni eklenen siparişin id'sini al
    $order_id = $conn->insert_id;

    // Her bir item için verileri ekle
    // 2. Sipariş ürünlerini order_items tablosuna ekle
    $itemStmt = $conn->prepare("INSERT INTO order_items (
        order_id, stock_id, quantity, unit_price, discounted_unit_price, 
        total_amount, serial_number, address, discount, 
        service_name, phone_number, job_status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
    
    foreach ($order_items as $item) {
        $stock_id = $item['stock_id'];
        $quantity = $item['quantity'];
        $unit_price = $item['unit_price'];
        $discounted_unit_price = isset($item['discounted_unit_price']) ? $item['discounted_unit_price'] : null;
        $total_amount = $item['total_amount'];
    
        $serial_number = isset($item['serial_number']) 
            ? (is_array($item['serial_number']) ? implode(', ', $item['serial_number']) : $item['serial_number']) 
            : '';
    
        $address = isset($item['address']) 
            ? (is_array($item['address']) ? implode(', ', $item['address']) : $item['address']) 
            : '';
    
        $discount = isset($item['discount']) ? $item['discount'] : 0.0;
    
        $service_name = isset($item['service_name']) 
            ? (is_array($item['service_name']) ? implode(', ', $item['service_name']) : $item['service_name']) 
            : '';
    
        $phone_number = isset($item['phone_number']) 
            ? (is_array($item['phone_number']) ? implode(', ', $item['phone_number']) : $item['phone_number']) 
            : '';
    
        // job_status dizisini al ve tüm iş durumlarını virgülle ayırarak al
        $job_status = isset($item['job_status'])
        ? (is_array($item['job_status']) ? implode(', ', $item['job_status']) : $item['job_status']) 
            : '';

        // Doğru bind_param sıralaması
        $itemStmt->bind_param("iiidddssdsss", 
            $order_id, 
            $stock_id, 
            $quantity, 
            $unit_price, 
            $discounted_unit_price, 
            $total_amount, 
            $serial_number, 
            $address, 
            $discount, 
            $service_name, 
            $phone_number, 
            $job_status
        );
    
        $itemStmt->execute();
    }
    
    // 3. Sipariş sonrası otomatik borç kaydı transactions tablosuna ekleniyor
    $description = "Sipariş #{$order_id} için borç eklendi";
    $transSql = "
        INSERT INTO transactions (
            customer_id,
            order_id,
            type,
            amount,
            description,
            created_by,
            updated_by,
            created_at,
            updated_at
        ) VALUES (
            ?, ?, 'Borç', ?, ?, ?, ?, NOW(), NOW()
        )
    ";
    $transStmt = $conn->prepare($transSql);
    if ( ! $transStmt ) {
        throw new Exception("transactions hazırlama hatası: " . $conn->error);
    }

    // Tip dizisi: i (customer_id), i (order_id), d (amount), s (description), s (created_by), s (updated_by)
    $transStmt->bind_param(
        "iidsss",
        $customer_id,
        $order_id,
        $total_amount,
        $description,
        $created_by,
        $updated_by
    );

    if ( ! $transStmt->execute() ) {
        throw new Exception("transactions ekleme hatası: " . $transStmt->error);
    }
    
    // İşlemi commit et
    $conn->commit();

    // Aktivite logunu kaydet
    log_activity("Sipariş Oluşturuldu : $order_id");

    // Başarı mesajı döndür
    echo json_encode(["success" => true, "order_id" => $order_id]);

} catch (Exception $e) {
    // Hata durumunda işlemi geri al
    $conn->rollback();

    // Hata mesajı döndür
    echo json_encode(["success" => false, "message" => "Sipariş oluşturulamadı", "error" => $e->getMessage()]);
}
?>
