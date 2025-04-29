<?php
ini_set('display_errors', 0);
error_reporting(0);
header('Content-Type: application/json; charset=UTF-8');

include 'api.php';    // veritabanı bağlantısı
include 'session.php'; 

$data = json_decode(file_get_contents('php://input'), true);
if (
    !isset($data['order_id']) ||
    !isset($data['items'])   || 
    !is_array($data['items'])
) {
    echo json_encode(['success' => false, 'message' => 'Geçersiz veri.']);
    exit;
}

$order_id = (int)$data['order_id'];
$items    = $data['items'];

$response = [
    'inserted' => 0,
    'updated'  => 0,
    'deleted'  => 0,
    'skipped'  => 0
];

$conn->begin_transaction();

try {
    foreach ($items as $item) {
        $order_item_id = intval($item['order_item_id']);

        // Kayıtta “veri var mı?” kontrolü
        $hasData = false;
        foreach ([
            'tuketim_no','igdas_adi','ad_soyad','telefon1','telefon2',
            'il','ilce','mahalle','sokak_adi','bina_no','daire_no',
            'randevu_tarihi','hata_sebebi','not_text'
        ] as $k) {
            if (!empty($item[$k])) {
                $hasData = true;
                break;
            }
        }
        $hataDurumu = isset($item['hata_durumu']) ? intval($item['hata_durumu']) : 0;

        // Önce bu order_item_id için bir kayıt var mı?
        $chk = $conn->prepare("SELECT id FROM installations WHERE order_item_id = ?");
        $chk->bind_param("i", $order_item_id);
        $chk->execute();
        $exists = $chk->get_result()->num_rows > 0;
        $chk->close();

        // Eğer hiçbir alan dolu değilse ve hata_durumu=0 ise
        if (!$hasData && $hataDurumu === 0) {
            if ($exists) {
                // daha önce eklenmişse sil
                $del = $conn->prepare("DELETE FROM installations WHERE order_item_id = ?");
                $del->bind_param("i", $order_item_id);
                $del->execute();
                $del->close();
                $response['deleted']++;
            } else {
                // silinecek de yok, atla
                $response['skipped']++;
            }
            continue;
        }

        // Buraya gelinirse kayıt ekleme/güncelleme yapılacak
        // Hazırla
        $fields = [
            $item['tuketim_no']      ?? '',
            $item['igdas_adi']       ?? '',
            $item['randevu_tarihi']  ?? null,
            $hataDurumu,
            $item['hata_sebebi']     ?? '',
            $item['not_text']        ?? '',
            $item['ad_soyad']        ?? '',
            $item['telefon1']        ?? '',
            $item['telefon2']        ?? '',
            $item['il']              ?? '',
            $item['ilce']            ?? '',
            $item['mahalle']         ?? '',
            $item['sokak_adi']       ?? '',
            $item['bina_no']         ?? '',
            $item['daire_no']        ?? ''
        ];

        if ($exists) {
            // Güncelle
            $upd = $conn->prepare("
                UPDATE installations SET
                  tuketim_no     = ?, igdas_adi      = ?, randevu_tarihi = ?,
                  hata_durumu    = ?, hata_sebebi    = ?, not_text       = ?,
                  ad_soyad       = ?, telefon1       = ?, telefon2       = ?,
                  il             = ?, ilce           = ?, mahalle        = ?,
                  sokak_adi      = ?, bina_no        = ?, daire_no       = ?,
                  updated_at     = NOW()
                WHERE order_item_id = ?
            ");
            $upd->bind_param(
                "sssissssssssssis",
                $fields[0], $fields[1], $fields[2], $fields[3], $fields[4],
                $fields[5], $fields[6], $fields[7], $fields[8], $fields[9],
                $fields[10], $fields[11], $fields[12], $fields[13], $fields[14],
                $order_item_id
            );
            $upd->execute();
            $upd->close();
            $response['updated']++;

        } else {
            // Yeni kayıt
            $ins = $conn->prepare("
                INSERT INTO installations (
                  order_item_id, tuketim_no, igdas_adi, randevu_tarihi,
                  hata_durumu, hata_sebebi, not_text, ad_soyad,
                  telefon1, telefon2, il, ilce, mahalle,
                  sokak_adi, bina_no, daire_no
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            ");
            $ins->bind_param(
                "ississsssssssss",
                $order_item_id,
                $fields[0], $fields[1], $fields[2], $fields[3], $fields[4],
                $fields[5], $fields[6], $fields[7], $fields[8], $fields[9],
                $fields[10], $fields[11], $fields[12], $fields[13]
            );
            $ins->execute();
            $ins->close();
            $response['inserted']++;
        }
    }

    $conn->commit();
    echo json_encode([
        'success' => true,
        'message' => 'İşlem tamamlandı.',
        'summary' => $response
    ]);
    exit;

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        'success' => false,
        'message' => 'İşlem sırasında hata: ' . $e->getMessage()
    ]);
    exit;
}
?>
