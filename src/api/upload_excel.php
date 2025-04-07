<?php
include 'session.php'; // Veritabanı bağlantısı
include 'api.php'; // Veritabanı bağlantısını içe aktar

$created_by = $_SESSION['user_id']; // Oturumdaki kullanıcı ID'si
$username = $_SESSION['username']; // Oturumdaki kullanıcı adı


// Dosya kontrolü
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Dosya yükleme hatası']);
    exit();
}

$filePath = $_FILES['file']['tmp_name'];
require __DIR__ . '/../../vendor/autoload.php'; // PhpSpreadsheet autoload
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

    // Ürün var mı kontrol et
    $stmt = $conn->prepare("SELECT id FROM stocks WHERE stock_code = ?");
    $stmt->bind_param("s", $stock_code);
    $stmt->execute();
    $stmt->bind_result($existing_product_id);
    $stmt->fetch();
    $stmt->close();

    if ($existing_product_id) {
        // Ürün mevcut, güncelle
        $stmt = $conn->prepare("UPDATE stocks SET product_name = ?, brand = ?, quantity = ?, price = ?, updated_by = ?, updated_at = NOW(), category_id = ? WHERE stock_code = ?");
        $stmt->bind_param("ssdisss", $product_name, $brand, $quantity, $price, $created_by, $existingCategories[$category_name], $stock_code);
        
        if ($stmt->execute()) {
            log_activity("Ürün güncellendi: $product_name, Stock Code: $stock_code");
            $insertedProducts[] = $product_name;
        }
    } else {
        // Ürün yok, yeni ürün ekle
        $stmt = $conn->prepare("INSERT INTO stocks (stock_code, product_name, brand, quantity, price, created_by, updated_by, created_at, updated_at, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)");
        $stmt->bind_param("sssdisss", $stock_code, $product_name, $brand, $quantity, $price, $created_by, $created_by, $existingCategories[$category_name]);
        
        if ($stmt->execute()) {
            log_activity("Ürün eklendi: $product_name, Stock Code: $stock_code");
            $insertedProducts[] = $product_name;
        }
    }

    $stmt->close();
}

echo json_encode(['success' => true, 'message' => 'Ürünler başarıyla eklendi', 'added_products' => $insertedProducts]);
?>
