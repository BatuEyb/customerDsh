<?php
include 'api.php'; // Veritabanı bağlantısı
include 'session.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $action = $_GET['action'] ?? '';
    $data = json_decode(file_get_contents("php://input"), true);

    if ($action === 'add') {
        addUser($data);
    } elseif ($action === 'update') {
        $userId = $_GET['id'] ?? null;
        if ($userId) {
            updateUser($userId, $data);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID parametresi eksik']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Geçersiz işlem']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Sadece POST metodu destekleniyor']);
}

// --- Kullanıcı Ekleme ---
function addUser($data) {
    global $conn;

    $name = trim($data['name']);
    $email = trim($data['email']);
    $username = trim($data['username']);
    $password = $data['password'];
    $role = $data['role'];

    if (!$name || !$email || !$username || !$password || !$role) {
        http_response_code(400);
        echo json_encode(['error' => 'Tüm alanlar gereklidir']);
        return;
    }

    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (id, name, email, username, password_hash, role) VALUES (UUID(), ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $email, $username, $password_hash, $role);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Kullanıcı eklendi']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Ekleme başarısız', 'details' => $stmt->error]);
    }

    $stmt->close();
}

// --- Kullanıcı Güncelleme ---
function updateUser($id, $data) {
    global $conn;

    $name = trim($data['name']);
    $email = trim($data['email']);
    $username = trim($data['username']);
    $role = $data['role'];
    $password = $data['password'] ?? '';

    if (!$name || !$email || !$username || !$role) {
        http_response_code(400);
        echo json_encode(['error' => 'Tüm alanlar gereklidir']);
        return;
    }

    if ($password) {
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET name=?, email=?, username=?, password_hash=?, role=? WHERE id=?");
        $stmt->bind_param("ssssss", $name, $email, $username, $password_hash, $role, $id);
    } else {
        $stmt = $conn->prepare("UPDATE users SET name=?, email=?, username=?, role=? WHERE id=?");
        $stmt->bind_param("sssss", $name, $email, $username, $role, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Kullanıcı güncellendi']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Güncelleme başarısız', 'details' => $stmt->error]);
    }

    $stmt->close();
}
