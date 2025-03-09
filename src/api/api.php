<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


$servername = "localhost"; // Sunucu adı (genellikle localhost)
$username = "root";        // MySQL kullanıcı adı
$password = "";            // MySQL şifresi (XAMPP varsayılan olarak boş bırakır)
$dbname = "takip"; // Veritabanı adı

// Veritabanına bağlantı
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantı kontrolü
if ($conn->connect_error) {
    die("Bağlantı başarısız: " . $conn->connect_error);
} else {
    // Bağlantı başarılı, işlem yapılabilir
    // echo "Bağlantı başarılı!";
}
?>