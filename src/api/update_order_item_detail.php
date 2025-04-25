<?php
// update_order_item_detail.php

// CORS ve DB bağlantısı, session yönetimi için ortak dosyaları ekle
include 'api.php';  // Veritabanı bağlantısı
include 'session.php';  // Kullanıcı oturum kontrolü, gerekirse

// JSON çıktısı olarak döndür
header('Content-Type: application/json');

// Ham girdi verisini oku ve decode et
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Geçersiz JSON verisi.']);
    exit;
}

// Parametreleri al
$order_id     = isset($input['order_id'])     ? (int)$input['order_id']     : 0;
$item_index   = isset($input['item_index'])   ? (int)$input['item_index']   : -1;
$detail_index = isset($input['detail_index']) ? (int)$input['detail_index'] : -1;
$detail       = isset($input['detail'])       ? $input['detail']            : [];

// Temel validasyon
if ($order_id <= 0 || $item_index < 0 || $detail_index < 0 || !is_array($detail)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Eksik veya hatalı parametre.']);
    exit;
}

// İlgili satırı order_items tablosundan sıraya göre al
$sql = "SELECT id, serial_number, address, service_name, phone_number, job_status
        FROM order_items
        WHERE order_id = ?
        ORDER BY id ASC
        LIMIT 1 OFFSET ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ii', $order_id, $item_index);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Sorgu yürütme hatası: ' . $stmt->error]);
    exit;
}
$result = $stmt->get_result();
$itemRow = $result->fetch_assoc();
$stmt->close();

if (!$itemRow) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Detay bulunamadı.']);
    exit;
}

$rowId = (int)$itemRow['id'];

// Alanlar dizi veya CSV formatında
$fields = ['serial_number', 'address', 'service_name', 'phone_number', 'job_status'];
$updated = [];
foreach ($fields as $field) {
    $raw = $itemRow[$field];
    $arr = null;
    // JSON dizi mi? Yoksa virgülle ayrılmış metin mi?
    $decoded = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        $arr = $decoded;
        $isJson = true;
    } else {
        // CSV olarak ayır
        $arr = strlen($raw) > 0 ? explode(',', $raw) : [];
        $isJson = false;
    }
    // Dizi uzunluğunu yeterli hale getir
    while (count($arr) <= $detail_index) {
        $arr[] = '';
    }
    // Gelen değeri güncelle
    if (isset($detail[$field])) {
        $arr[$detail_index] = $detail[$field];
    }
    // Yeniden encode et
    if ($isJson) {
        $newRaw = json_encode($arr, JSON_UNESCAPED_UNICODE);
    } else {
        // Tekrar virgülle birleştir
        $newRaw = implode(',', $arr);
    }
    $updated[$field] = $conn->real_escape_string($newRaw);
}

// UPDATE sorgusu
$updateSql = "UPDATE order_items SET
                 serial_number = ?,
                 address       = ?,
                 service_name  = ?,
                 phone_number  = ?,
                 job_status    = ?,
                 updated_at    = CURRENT_TIMESTAMP()
               WHERE id = ?";
$updStmt = $conn->prepare($updateSql);
$updStmt->bind_param(
    'sssssi',
    $updated['serial_number'],
    $updated['address'],
    $updated['service_name'],
    $updated['phone_number'],
    $updated['job_status'],
    $rowId
);
if (!$updStmt->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Güncelleme sırasında hata: ' . $updStmt->error]);
    exit;
}

// Loglama
log_activity("order_items id=$rowId güncellendi: detail_index=$detail_index");

// Başarı yanıtı
echo json_encode(['success' => true, 'message' => 'Detay başarıyla güncellendi.']);
$updStmt->close();
$conn->close();
