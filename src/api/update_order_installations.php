<?php
// update_order_installations.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=UTF-8');

include 'api.php';      // Veritabanı bağlantısı
include 'session.php';  // Oturum kontrolü vs.

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
    'inserted'      => 0,
    'updated'       => 0,
    'deleted'       => 0,
    'skipped'       => 0,
    'serials'       => 0,
    'flags_updated' => 0
];

$conn->begin_transaction();

try {
    foreach ($items as $item) {
        $order_item_id = intval($item['order_item_id']);

        // order_items tablosuna seri, delivery ve servis flag güncelle (her item için)
        $sn   = $item['serial_number']      ?? null;
        $delv = intval($item['delivery']           ?? 0);
        $oistatus = $item['order_item_status'] ?? 'Sipariş Alındı';

        $updOI = $conn->prepare("UPDATE order_items SET
                serial_number        = ?,
                delivery             = ?,
                order_item_status = ?
            WHERE id = ?
        ");
        $updOI->bind_param("sisi", $sn, $delv, $oistatus, $order_item_id);
        $updOI->execute();
        $updOI->close();

        // sayaçları güncelle (opsiyonel)
        if ($sn !== null) { $response['serials']++; }
        $response['flags_updated']++;

        // Kurulum verilerinin dolu olup olmadığını kontrol et
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

        // installations kaydı var mı bak
        $chk = $conn->prepare("SELECT id FROM installations WHERE order_item_id = ?");
        $chk->bind_param("i", $order_item_id);
        $chk->execute();
        $exists = $chk->get_result()->num_rows > 0;
        $chk->close();

        // Veri yoksa veya hata durumu yoksa sil veya atla
        if (!$hasData && $hataDurumu === 0) {
            if ($exists) {
                $del = $conn->prepare("DELETE FROM installations WHERE order_item_id = ?");
                $del->bind_param("i", $order_item_id);
                $del->execute();
                $del->close();
                $response['deleted']++;
            } else {
                $response['skipped']++;
            }
        } else {
            // randevu tarihini normalize et
            $randevu = isset($item['randevu_tarihi']) ? trim($item['randevu_tarihi']) : '';
            if ($randevu === '') {
                $randevu = null;
            }

            // Installation tablosu için alan dizisi
            $instFields = [
                $item['tuketim_no']   ?? '',
                $item['igdas_adi']    ?? '',
                $randevu,
                $hataDurumu,
                $item['hata_sebebi']  ?? '',
                $item['not_text']     ?? '',
                $item['ad_soyad']     ?? '',
                $item['telefon1']     ?? '',
                $item['telefon2']     ?? '',
                $item['il']           ?? '',
                $item['ilce']         ?? '',
                $item['mahalle']      ?? '',
                $item['sokak_adi']    ?? '',
                $item['bina_no']      ?? '',
                $item['daire_no']     ?? ''
            ];

            if ($exists) {
                // Güncelle
                $upd = $conn->prepare("UPDATE installations SET
                      tuketim_no     = ?, igdas_adi      = ?, randevu_tarihi = ?,
                      hata_durumu    = ?, hata_sebebi    = ?, not_text       = ?,
                      ad_soyad       = ?, telefon1       = ?, telefon2       = ?,
                      il             = ?, ilce           = ?, mahalle        = ?,
                      sokak_adi      = ?, bina_no        = ?, daire_no       = ?,
                      updated_at     = NOW()
                  WHERE order_item_id = ?");
                $upd->bind_param(
                    "sssisssssssssssi",
                    $instFields[0], $instFields[1], $instFields[2], $instFields[3],
                    $instFields[4], $instFields[5], $instFields[6], $instFields[7],
                    $instFields[8], $instFields[9], $instFields[10], $instFields[11],
                    $instFields[12], $instFields[13], $instFields[14],
                    $order_item_id
                );
                $upd->execute();
                $upd->close();
                $response['updated']++;
            } else {
                // Yeni kayıt
                $ins = $conn->prepare("INSERT INTO installations (
                        order_item_id, tuketim_no, igdas_adi, randevu_tarihi,
                        hata_durumu, hata_sebebi, not_text, ad_soyad,
                        telefon1, telefon2, il, ilce, mahalle,
                        sokak_adi, bina_no, daire_no
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                $ins->bind_param(
                    "isssisssssssssss",
                    $order_item_id,
                    $instFields[0], $instFields[1], $instFields[2], $instFields[3],
                    $instFields[4], $instFields[5], $instFields[6], $instFields[7],
                    $instFields[8], $instFields[9], $instFields[10], $instFields[11],
                    $instFields[12], $instFields[13], $instFields[14]
                );
                $ins->execute();
                $ins->close();
                $response['inserted']++;
            }
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
