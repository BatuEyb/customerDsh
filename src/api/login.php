<?php
session_start();
include 'api.php'; // Veritabanı bağlantısı

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $data->username;
    $password = $data->password;

    // Veritabanında kullanıcıyı ara
    $stmt = $conn->prepare("SELECT id, username, password, first_name, last_name, role FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // Şifreyi doğrula (Bu durumda şifre hashlenmeden doğrulanıyor)
        if ($password === $user['password']) {
            // Başarılı giriş
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];

            echo json_encode([
                'success' => true,
                'message' => 'Başarıyla giriş yapıldı.',
                'role' => $user['role'],
                'token' => 'sample-jwt-token', // JWT veya başka bir token kullanabilirsiniz
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name']
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Hatalı şifre!']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Kullanıcı bulunamadı!']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Geçersiz istek!']);
}
?>
