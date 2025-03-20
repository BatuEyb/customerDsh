<?php
include('api.php');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
// Sorgu parametrelerini al
$search = isset($_GET['search']) ? $_GET['search'] : '';
$tuketimNo = isset($_GET['tuketimNo']) ? $_GET['tuketimNo'] : '';
$sokak = isset($_GET['sokak']) ? $_GET['sokak'] : '';
$binaNo = isset($_GET['binaNo']) ? $_GET['binaNo'] : '';
$isTipi = isset($_GET['isTipi']) ? $_GET['isTipi'] : '';
$cihazMarkasi = isset($_GET['cihazMarkasi']) ? $_GET['cihazMarkasi'] : '';
$isDurumu = isset($_GET['isDurumu']) ? $_GET['isDurumu'] : '';
$musteriTemsilcisi = isset($_GET['musteriTemsilcisi']) ? $_GET['musteriTemsilcisi'] : '';
$hataSebebi = isset($_GET['hataSebebi']) ? $_GET['hataSebebi'] : '';
$startDate = isset($_GET['startDate']) ? $_GET['startDate'] : '';
$endDate = isset($_GET['endDate']) ? $_GET['endDate'] : '';

// SQL sorgusu oluştur
$sql = "SELECT * FROM customer_form WHERE 1=1";

if ($search) {
    $sql .= " AND (ad_soyad LIKE '%$search%' OR telefon1 LIKE '%$search%' OR telefon2 LIKE '%$search%' OR igdas_sozlesme LIKE '%$search%')";
}
if ($tuketimNo) {
    $sql .= " AND tuketim_no LIKE '%$tuketimNo%'";
}
if ($sokak) {
    $sql .= " AND sokak_adi LIKE '%$sokak%'";
}
if ($binaNo) {
    $sql .= " AND bina_no LIKE '%$binaNo%'";
}
if ($isTipi) {
    $sql .= " AND is_tipi LIKE '%$isTipi%'";
}
if ($cihazMarkasi) {
    $sql .= " AND cihaz_markasi LIKE '%$cihazMarkasi%'";
}
if ($isDurumu) {
    $sql .= " AND is_durumu LIKE '%$isDurumu%'";
}
if ($musteriTemsilcisi) {
    $sql .= " AND musteri_temsilcisi LIKE '%$musteriTemsilcisi%'";
}
if ($hataSebebi) {
    $sql .= " AND hata_sebebi LIKE '%$hataSebebi%'";
}

// Sipariş tarihi aralığını kontrol et
if (!empty($startDate) && !empty($endDate)) {
    $sql .= " AND siparis_tarihi BETWEEN '$startDate' AND '$endDate'";
} elseif (!empty($startDate)) {
    $sql .= " AND siparis_tarihi >= '$startDate'";
} elseif (!empty($endDate)) {
    $sql .= " AND siparis_tarihi <= '$endDate'";
}

$sql .= " ORDER BY siparis_tarihi DESC";
// Sorguyu çalıştır ve sonuçları al
$result = $conn->query($sql);

$customers = [];
while ($row = $result->fetch_assoc()) {
    $customers[] = $row;
}

echo json_encode($customers);

// Bağlantıyı kapat
$conn->close();
?>
