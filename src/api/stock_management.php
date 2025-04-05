<?php


include 'api.php'; // Veritabanı bağlantısı

// Ürünleri listeleme
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM stocks";
    $result = $conn->query($sql);
    $stocks = [];
    
    while ($row = $result->fetch_assoc()) {
        $stocks[] = $row;
    }
    
    echo json_encode($stocks);
    exit;
}

// Silme işlemi
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    $delete_id = $data->id;
    
    $delete_sql = "DELETE FROM stocks WHERE id = ?";
    $stmt = $conn->prepare($delete_sql);
    $stmt->bind_param("s", $delete_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Ürün başarıyla silindi!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Silme işlemi başarısız!']);
    }
    exit;
}

// Düzenleme işlemi
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $stock_code = $data->stock_code;
    $product_name = $data->product_name;
    $brand = $data->brand;
    $quantity = $data->quantity;
    $price = $data->price;
    $category_id = $data->category_id;

    $update_sql = "UPDATE stocks SET stock_code = ?, product_name = ?, brand = ?, quantity = ?, price = ?, category_id = ? WHERE id = ?";
    $stmt = $conn->prepare($update_sql);
    $stmt->bind_param("sssdiss", $stock_code, $product_name, $brand, $quantity, $price,  $category_id ,$id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Ürün başarıyla güncellendi!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Güncelleme işlemi başarısız!']);
    }
    exit;
}

?>
