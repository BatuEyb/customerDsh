<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('api.php'); // Veritabanı bağlantısı

$inputJSON = file_get_contents("php://input");
$formData = json_decode($inputJSON, true);

if (!$formData) {
    echo json_encode(["success" => false, "message" => "Geçersiz JSON formatı"]);
    exit();
}

// JSON verisini parçala
    $tuketim_no = mysqli_real_escape_string($conn, $formData['tuketim_no']);
    $ad_soyad = mysqli_real_escape_string($conn, $formData['ad_soyad']);
    $igdas_sozlesme = mysqli_real_escape_string($conn, $formData['igdas_sozlesme']);
    $telefon1 = mysqli_real_escape_string($conn, $formData['telefon1']);
    $telefon2 = mysqli_real_escape_string($conn, $formData['telefon2']);
    $il = mysqli_real_escape_string($conn, $formData['il']);
    $ilce = mysqli_real_escape_string($conn, $formData['ilce']);
    $mahalle = mysqli_real_escape_string($conn, $formData['mahalle']);
    $sokak_adi = mysqli_real_escape_string($conn, $formData['sokak_adi']);
    $bina_no = mysqli_real_escape_string($conn, $formData['bina_no']);
    $daire_no = mysqli_real_escape_string($conn, $formData['daire_no']);
    $cihaz_turu = mysqli_real_escape_string($conn, $formData['cihaz_turu']);
    $cihaz_markasi = mysqli_real_escape_string($conn, $formData['cihaz_markasi']);
    $cihaz_modeli = mysqli_real_escape_string($conn, $formData['cihaz_modeli']);
    $cihaz_seri_numarasi = mysqli_real_escape_string($conn, $formData['cihaz_seri_numarasi']);
    $siparis_tarihi = mysqli_real_escape_string($conn, $formData['siparis_tarihi']);
    $montaj_tarihi = mysqli_real_escape_string($conn, $formData['montaj_tarihi']);
    $musteri_temsilcisi = mysqli_real_escape_string($conn, $formData['musteri_temsilcisi']);
    $is_tipi = mysqli_real_escape_string($conn, $formData['is_tipi']);
    $is_durumu = mysqli_real_escape_string($conn, $formData['is_durumu']);

    // SQL sorgusu ile veritabanına veri ekleme
    $sql = "INSERT INTO customer_form (tuketim_no, ad_soyad, igdas_sozlesme, telefon1, telefon2, il, ilce, mahalle, sokak_adi, bina_no, daire_no, cihaz_turu, cihaz_markasi, cihaz_modeli, cihaz_seri_numarasi, siparis_tarihi, montaj_tarihi, musteri_temsilcisi, is_tipi, is_durumu) VALUES ('$tuketim_no', '$ad_soyad', '$igdas_sozlesme' , '$telefon1', '$telefon2', '$il', '$ilce', '$mahalle', '$sokak_adi', '$bina_no', '$daire_no', '$cihaz_turu', '$cihaz_markasi', '$cihaz_modeli', '$cihaz_seri_numarasi', '$siparis_tarihi', '$montaj_tarihi', '$musteri_temsilcisi', '$is_tipi','$is_durumu')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Veri başarıyla eklendi."]);
    } else {
        echo json_encode(["success" => false, "message" => "Hata: " . $conn->error]);
    }

    $conn->close();

?>
