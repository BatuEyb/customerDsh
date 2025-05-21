<?php
include 'api.php'; // Veritabanı bağlantısı
include 'session.php';

header('Content-Type: application/json');

// 1) URL’den filtreleri oku (GET ile gönderilecek)
$customerName  = $_GET['customer_name']  ?? '';
$brandFilter   = $_GET['brand']          ?? '';
$statusFilter  = $_GET['order_status']   ?? '';
$typeFilter    = $_GET['order_type']      ?? '';
$dateFrom      = $_GET['date_from']      ?? '';
$dateTo        = $_GET['date_to']        ?? '';
$igdasAdi      = $_GET['igdas_adi']      ?? '';
$tuketimNo     = $_GET['tuketim_no']     ?? '';

// 2) Dinamik WHERE parçaları hazırla
$where   = [];
$params  = [];
$types   = '';

if ($customerName !== '') {
    $where[]  = "inst.ad_soyad LIKE ?";
    $params[] = "%{$customerName}%";
    $types   .= 's';
}
if ($igdasAdi !== '') {
    $where[]  = "inst.igdas_adi LIKE ?";
    $params[] = "%{$igdasAdi}%";
    $types   .= 's';
}
if ($tuketimNo !== '') {
    $where[]  = "inst.tuketim_no LIKE ?";
    $params[] = "%{$tuketimNo}%";
    $types   .= 's';
}
if ($brandFilter !== '') {
    $where[]  = "s.brand = ?";
    $params[] = $brandFilter;
    $types   .= 's';
}
if ($statusFilter !== '') {
    $where[]  = "oi.order_item_status = ?";
    $params[] = $statusFilter;
    $types   .= 's';
}
if ($dateFrom !== '') {
    $where[]  = "inst.randevu_tarihi >= ?";
    $params[] = $dateFrom;
    $types   .= 's';
}
if ($dateTo !== '') {
    $where[]  = "inst.randevu_tarihi <= ?";
    $params[] = $dateTo;
    $types   .= 's';
}
if ($typeFilter !== '') {
    $where[]  = "o.order_type = ?";                  // <<< ekledik
    $params[] = $typeFilter;                         // <<< ekledik
    $types   .= 's';                                 // <<< ekledik
}

$whereSQL = count($where) ? 'WHERE ' . implode(' AND ', $where) : '';

// 3) Hazır SQL
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
    oi.order_item_status   AS order_status,
    o.order_type,
    oi.serial_number,
    s.brand,
    c.name                 AS customer_name
  FROM installations inst
  JOIN order_items    oi ON inst.order_item_id = oi.id
  JOIN orders         o  ON oi.order_id        = o.id
  JOIN customers      c  ON o.customer_id      = c.id
  JOIN stocks         s  ON oi.stock_id        = s.id
  $whereSQL
  ORDER BY inst.created_at DESC
";

// 4) Prepare & bind
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => "Prepare error: {$conn->error}"]);
    exit;
}
if ($types !== '') {
    // bind_param expects references
    $bindNames[] = & $types;
    foreach ($params as $i => $p) {
        $bindNames[] = & $params[$i];
    }
    call_user_func_array([$stmt, 'bind_param'], $bindNames);
}

// 5) Execute & fetch
$stmt->execute();
$res = $stmt->get_result();
$rows = [];
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
        'customer_name'   => $r['customer_name'],
    ];
}

echo json_encode(['success' => true, 'data' => $rows]);
