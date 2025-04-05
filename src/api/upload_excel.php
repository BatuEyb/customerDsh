<?php
session_start(); // Session başlatıyoruz
include 'api.php'; // Veritabanı bağlantısı

// Eğer OPTIONS isteği yapılırsa hemen cevap dönebiliriz
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Kullanıcı oturumu bulunamadı']);
    exit;
}

$created_by = $_SESSION['user_id'];

// Dosya kontrolü
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Dosya yükleme hatası']);
    exit();
}

$filePath = $_FILES['file']['tmp_name'];
require __DIR__ . '/../../vendor/autoload.php'; // Proje kök dizininden
use PhpOffice\PhpSpreadsheet\IOFactory;

$spreadsheet = IOFactory::load($filePath);
$sheetData = $spreadsheet->getActiveSheet()->toArray(null, true, true, true);

$insertedProducts = [];
$existingCategories = [];

// Kategorileri kontrol et ve ekle
foreach ($sheetData as $index => $row) {
    if ($index === 1) continue; // Başlık satırını atla

    $stock_code = trim($row['A']);
    $product_name = trim($row['B']);
    $brand = trim($row['C']);
    $quantity = (int) $row['D'];
    $price = (float) $row['E'];
    $category_name = trim($row['F']);

    // Kategori ID'yi al veya oluştur
    if (!isset($existingCategories[$category_name])) {
        $stmt = $conn->prepare("SELECT id FROM categories WHERE name = ?");
        $stmt->bind_param("s", $category_name);
        $stmt->execute();
        $stmt->bind_result($category_id);
        $stmt->fetch();
        $stmt->close();

        if (!$category_id) {
            // Kategori ekle
            $category_id = uniqid("cat_");
            $stmt = $conn->prepare("INSERT INTO categories (id, name, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())");
            $stmt->bind_param("ssss", $category_id, $category_name, $created_by, $created_by);
            $stmt->execute();
            $stmt->close();
        }

        $existingCategories[$category_name] = $category_id;
    }

    // Ürünü ekle
    $stmt = $conn->prepare("INSERT INTO stocks (stock_code, product_name, brand, quantity, price, created_by, updated_by, created_at, updated_at, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)");
    $stmt->bind_param("sssdisss", $stock_code, $product_name, $brand, $quantity, $price, $created_by, $created_by, $existingCategories[$category_name]);
    
    if ($stmt->execute()) {
        $insertedProducts[] = $product_name;
    }

    $stmt->close();
}

echo json_encode(['success' => true, 'message' => 'Ürünler başarıyla eklendi', 'added_products' => $insertedProducts]);
?>
