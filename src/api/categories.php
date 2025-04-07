<?php

include 'api.php'; // Veritabanı bağlantısı
include 'session.php' ;

$created_by = $_SESSION['user_id']; // Oturumdaki kullanıcı ID'si
$username = $_SESSION['username']; // Oturumdaki kullanıcı adı

// Kategorileri listeleme
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM categories";
    $result = $conn->query($sql);
    $categories = [];
    
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
    
    echo json_encode($categories);
    exit;
}

// Kategori ekleme veya güncelleme
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->id) || empty($data->id)) {
        // Yeni kategori ekleme
        $category_id = uniqid("cat_");
        $name = $data->name;
        $insert_sql = "INSERT INTO categories (id, name, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())";
        $stmt = $conn->prepare($insert_sql);
        $stmt->bind_param("ssss", $category_id ,$name, $created_by, $created_by);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Kategori başarıyla eklendi!']);
            log_activity("Kategori Eklendi: $name");
        } else {
            echo json_encode(['success' => false, 'message' => 'Ekleme işlemi başarısız!']);
        }
    } else {
        // Kategori güncelleme
        $id = $data->id;
        $name = $data->name;

        $update_sql = "UPDATE categories SET name = ? WHERE id = ?";
        $stmt = $conn->prepare($update_sql);
        $stmt->bind_param("si", $name, $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Kategori başarıyla güncellendi!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Güncelleme işlemi başarısız!']);
        }
    }
    exit;
}

// Kategori silme
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    $delete_id = $data->id;
    
    $delete_sql = "DELETE FROM categories WHERE id = ?";
    $stmt = $conn->prepare($delete_sql);
    $stmt->bind_param("i", $delete_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Kategori başarıyla silindi!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Silme işlemi başarısız!']);
    }
    exit;
}

?>
