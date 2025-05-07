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
$order_type = isset($data['order_type']) && $data['order_type'] !== ''
            ? $data['order_type']
            : 'Tekli Satış';
// Veritabanı işlemleri için başlat
$conn->begin_transaction();

try {
    // 1. Siparişi orders tablosuna ekle
    $stmt = $conn->prepare("INSERT INTO orders (customer_id, total_amount, created_by, updated_by, created_at, updated_at, order_type) 
                        VALUES (?, ?, ?, ?, NOW(), NOW(), ?)");
    $stmt->bind_param("idsss", $customer_id, $total_amount, $created_by, $updated_by, $order_type);
    $stmt->execute();

    // Yeni eklenen siparişin id'sini al
    $order_id = $conn->insert_id;

    // Her bir item için verileri ekle
    // 2. Sipariş ürünlerini order_items tablosuna ekle
    $itemStmt = $conn->prepare("INSERT INTO order_items (
        order_id, stock_id, unit_price, discounted_unit_price, 
        total_amount, serial_number, discount, 
        created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");

    $detailStmt = $conn->prepare("
    INSERT INTO installations (
        order_item_id, tuketim_no, igdas_adi, ad_soyad, 
        telefon1, telefon2, il, ilce, mahalle, sokak_adi, bina_no, daire_no,
        created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");
    
    $total_order_amount = 0.0; // toplam sipariş tutarı

    foreach ($order_items as $item) {
        $stock_id = $item['stock_id'];
        $unit_price = $item['unit_price'];
        $discounted_unit_price = isset($item['discounted_unit_price']) ? $item['discounted_unit_price'] : null;
        $item_total_amount = $item['total_amount']; // buraya lokal isim veriyoruz
    
        $serial_number = isset($item['serial_number']) 
            ? (is_array($item['serial_number']) ? implode(', ', $item['serial_number']) : $item['serial_number']) 
            : '';
    
        $discount = isset($item['discount']) ? $item['discount'] : 0.0;
    
        // Doğru bind_param sıralaması
        $itemStmt->bind_param("iidddsd", 
            $order_id, 
            $stock_id, 
            $unit_price, 
            $discounted_unit_price, 
            $item_total_amount,  
            $serial_number,  
            $discount, 
        );
    
        $itemStmt->execute();

        // just inserted order_item_id
        $orderItemId = $conn->insert_id;

        // Montaj kaydı gerekiyor diyelim
        if (isset($item['is_installation_required']) && $item['is_installation_required']) {
            // Ham değerler
            $rawT1 = $item['telefon1'] ?? '';
            $rawT2 = $item['telefon2'] ?? '';

            // 1) Rakam olmayan her şeyi sil
            $t1 = preg_replace('/\D+/', '', $rawT1);
            $t2 = preg_replace('/\D+/', '', $rawT2);

            // 2) Eğer 10 haneden uzunsa son 10 haneyi al (ülke kodunu at)
            if (strlen($t1) > 10) {
                $t1 = substr($t1, -10);
            }
            if (strlen($t2) > 10) {
                $t2 = substr($t2, -10);
            }

            // Diğer alanlar
            $tuketimNo     = $item['tuketimNo']     ?? '';
            $igdasSozlesme = $item['igdasSozlesme'] ?? '';
            $adSoyad       = $item['adSoyad']       ?? '';
            $il            = $item['il']            ?? '';
            $ilce          = $item['ilce']          ?? '';
            $mahalle       = $item['mahalle']       ?? '';
            $sokakAdi      = $item['sokakAdi']      ?? '';
            $binaNo        = $item['binaNo']        ?? '';
            $daireNo       = $item['daireNo']       ?? '';

            // --- installations tablosuna ekle ---
            $detailStmt->bind_param(
                "isssssssssss",
                $orderItemId,
                $tuketimNo,
                $igdasSozlesme,
                $adSoyad,
                $t1,          // temizlenmiş telefon1
                $t2,          // temizlenmiş telefon2
                $il,
                $ilce,
                $mahalle,
                $sokakAdi,
                $binaNo,
                $daireNo
            );
            $detailStmt->execute();
        }

        $total_order_amount += $item_total_amount;
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
        $total_order_amount,  // <-- düzeltilmiş toplam değer
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
