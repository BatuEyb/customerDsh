<?php
include 'api.php'; // Veritabanı bağlantısı
include 'session.php' ;

// Müşterileri updated_at alanına göre yeniden eskiye sırala
$sql = "SELECT * FROM customers ORDER BY updated_at DESC";
$result = $conn->query($sql);

// Müşterileri bir diziye al
$customers = [];
while($row = $result->fetch_assoc()) {
    $customers[] = $row;
}

// JSON formatında döndür
echo json_encode($customers);

// Bağlantıyı kapat
$conn->close();
?>
