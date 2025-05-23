<?php
header("Access-Control-Allow-Origin: http://localhost:5173");  // React uygulamanızın adresi
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json; charset=utf-8');

// OPTIONS isteğine 200 OK döndür (Tarayıcı preflight request atarsa engellenmez)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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