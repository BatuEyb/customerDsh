<?php
include('api.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Boş bir sonuç nesnesi oluştur
$response = [
    "total_customers" => 0,
    "device_counts" => [],
    "completed_jobs_count" => 0,
    "upcoming_appointments" => [],
    "last_updated" => [],
    "daily_orders" => [],
    "device_percentages" => [],
    "sales_representative_top_brands" => []
];

// 1️⃣ **Toplam müşteri sayısını al**
$sql = "SELECT COUNT(*) as total FROM customer_form";
$result = $conn->query($sql);
if ($row = $result->fetch_assoc()) {
    $response["total_customers"] = $row["total"];
}

// 2️⃣ **Markalara göre cihaz sayısını, tamamlanmış iş sayısını ve hatalı iş sayısını al**
$sql = "SELECT cihaz_markasi, COUNT(*) as total, 
        SUM(CASE WHEN is_durumu = 'İş Tamamlandı' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN hata_durumu = '1' THEN 1 ELSE 0 END) as faulty
        FROM customer_form 
        GROUP BY cihaz_markasi
        ORDER BY total DESC";

$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    $response["device_counts"][] = [
        "brand" => $row["cihaz_markasi"],
        "total" => $row["total"],
        "completed" => $row["completed"],
        "faulty" => $row["faulty"] // Include the count of faulty jobs
    ];
}

// 3️⃣ **Tamamlanmış işlerin toplam sayısını al**
$sql = "SELECT COUNT(*) as completed FROM customer_form WHERE is_durumu = 'İş Tamamlandı'";
$result = $conn->query($sql);
if ($row = $result->fetch_assoc()) {
    $response["completed_jobs_count"] = $row["completed"];
}

// 3️⃣ **Hatalı işlerin toplam sayısını al**
$sql = "SELECT COUNT(*) as hasErrorWorks FROM customer_form WHERE hata_durumu = '1'";
$result = $conn->query($sql);
if ($row = $result->fetch_assoc()) {
    $response["hasErrorWorks"] = $row["hasErrorWorks"];
}

// 4️⃣ **Önümüzdeki 7 gün içinde randevusu olan müşterileri al**
$sql = "SELECT * FROM customer_form WHERE randevu_tarihi BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)";
$result = $conn->query($sql);
while ($row = $result->fetch_assoc()) {
    $response["upcoming_appointments"][] = $row;
}

// 4️⃣ **En son güncellenen müşterileri al**
$sql = "SELECT * FROM customer_form WHERE guncelleme_tarihi BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 DAY)";
$result = $conn->query($sql);
while ($row = $result->fetch_assoc()) {
    $response["last_updated"][] = $row;
}

// 6️⃣ **Günlük sipariş sayısını al**
$sql = "SELECT DATE(siparis_tarihi) AS tarih, COUNT(*) AS siparis_sayisi 
        FROM customer_form 
        WHERE siparis_tarihi IS NOT NULL
        GROUP BY DATE(siparis_tarihi)
        ORDER BY tarih ASC";

$result = $conn->query($sql);
while ($row = $result->fetch_assoc()) {
    $response["daily_orders"][] = [
        "tarih" => $row["tarih"],
        "siparis_sayisi" => (int) $row["siparis_sayisi"]
    ];
}


// Toplam müşteri sayısını al
$totalQuery = "SELECT COUNT(*) as total FROM customer_form";
$totalResult = $conn->query($totalQuery);
$totalCustomers = $totalResult->fetch_assoc()["total"];

if ($totalCustomers > 0) {
    // Markalara göre cihaz sayısını al
    $sql = "SELECT cihaz_markasi, COUNT(*) as count FROM customer_form GROUP BY cihaz_markasi";
    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $percentage = round(($row["count"] / $totalCustomers) * 100, 2);
        $response["device_percentages"][] = [
            "brand" => $row["cihaz_markasi"],
            "count" => $row["count"],
            "percentage" => $percentage
        ];
    }
}


// 7️⃣ **Müşteri temsilcilerinin yaptığı satışları al**
$sql = "SELECT musteri_temsilcisi, cihaz_markasi, COUNT(*) AS total_sales
        FROM customer_form
        WHERE siparis_tarihi
        GROUP BY musteri_temsilcisi, cihaz_markasi
        ORDER BY musteri_temsilcisi, total_sales DESC";

$result = $conn->query($sql);

$representative_data = [];

while ($row = $result->fetch_assoc()) {
    $representative = $row["musteri_temsilcisi"];
    $brand = $row["cihaz_markasi"];
    $sales = $row["total_sales"];

    // Eğer temsilci dizide yoksa, yeni bir giriş ekle
    if (!isset($representative_data[$representative])) {
        $representative_data[$representative] = [
            "representative" => $representative,
            "top_brand" => $brand, // En çok satılan marka (ilk satır zaten en fazla olan)
            "total_sales" => 0, // Toplam satış adedi
            "brand_sales" => [] // Her markadan kaç adet satıldığını tutacak
        ];
    }

    // Toplam satış adedini artır
    $representative_data[$representative]["total_sales"] += $sales;

    // Her markadan kaç adet satıldığını sakla
    $representative_data[$representative]["brand_sales"][$brand] = $sales;
}

// 🔹 **Sıralama**: Toplam satış adedine göre büyükten küçüğe sırala
uasort($representative_data, function ($a, $b) {
    return $b["total_sales"] - $a["total_sales"];
});

// 🔹 **JSON formatında çıktı oluştur**
$response["sales_representative_top_brands"] = array_values($representative_data);




// Sonuçları JSON olarak döndür
echo json_encode($response);

// Bağlantıyı kapat
$conn->close();
?>
