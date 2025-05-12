<?php
// 1. Oturumu başlatıyoruz (sadece bir kez)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 2. İnaktivite limiti (saniye cinsinden)
$inactiveLimit = 20 * 60; // 20 dakika = 1.200 saniye

// 3. Daha önce kaydedilmiş 'last_activity' var mı, kontrol et
if (isset($_SESSION['last_activity'])) {
    $elapsed = time() - $_SESSION['last_activity'];
    if ($elapsed > $inactiveLimit) {
        // 4.a Oturumu tamamen sonlandır
        session_unset();
        session_destroy();
        // 4.b Ana sayfaya yönlendir
        header("Location: /");
        exit();
    }
}

// 5. Her istekte 'last_activity' zaman damgasını güncelle
$_SESSION['last_activity'] = time();

// Oturumda kullanıcı bilgileri varsa, mevcut oturumdaki kullanıcı bilgilerine erişim sağlıyoruz
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $username = $_SESSION['username'];
} else {
    $user_id = null;
    $username = null;
}

// Kullanıcı oturumunu kontrol et
if ($user_id === null || $username === null) {
    echo json_encode(['success' => false, 'message' => 'Kullanıcı oturumu bulunamadı']);
    exit();
}

// Loglama fonksiyonu
function log_activity($message) {
    // Kullanıcı bilgilerini almak için session'ı kontrol et
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'Bilinmiyor';
    $username = isset($_SESSION['username']) ? $_SESSION['username'] : 'Bilinmiyor';

    // Log mesajını oluştur
    $logFile = __DIR__ . '/../logs/activity_log.txt'; // Log dosyasının yolu
    $date = date('Y-m-d H:i:s');
    $logMessage = "[$date] - Kullanıcı: $username (ID: $user_id) - $message\n";

    // Dosyaya log yazma işlemi
    if (is_writable($logFile)) {
        if (file_put_contents($logFile, $logMessage, FILE_APPEND) === false) {
            // Eğer yazma işlemi başarısız olursa hata mesajı
            error_log("Log yazma işlemi başarısız: $logMessage");
        }
    } else {
        // Log dosyasına yazılamıyorsa hata mesajı
        error_log("Log dosyasına yazılamıyor: $logFile");
    }
}
?>
