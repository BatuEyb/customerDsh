<?php
session_start(); // Session başlatıyoruz
session_regenerate_id(true);
include 'api.php'; // Veritabanı bağlantısı

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'message' => 'Geçersiz istek yöntemi!']);
    exit;
}

$username = $data->username ?? null;
$password = $data->password ?? null;

if (!$username || !$password) {
    echo json_encode(['success' => false, 'message' => 'Eksik giriş bilgileri!']);
    exit;
}

// Kullanıcıyı veritabanından getir
$stmt = $conn->prepare("SELECT id, name, email, username, password_hash, role FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();


if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // ✅ Şifre doğrulama: Veritabanındaki hash ile eşleşiyor mu?
    if (password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        echo json_encode([
            'success' => true,
            'message' => 'Başarıyla giriş yapıldı.',
            'role' => $user['role'],
            'name' => $user['name'],  // Kullanıcının adı da gönderiliyor
            'user_id' =>$user['id'],
            'token' => 'sample-jwt-token', // Gerçek bir JWT ekleyebilirsin
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Hatalı şifre!']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Kullanıcı bulunamadı!']);
}

$stmt->close();
$conn->close();
