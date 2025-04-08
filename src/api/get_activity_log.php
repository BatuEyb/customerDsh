<?php
include 'api.php'; // Veritabanı bağlantısını içe aktar

$logFile = './../logs/activity_log.txt';

if (file_exists($logFile)) {
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $reversedLines = array_reverse($lines); // Yeniden eskiye sırala
    $logContents = implode("\n", $reversedLines);

    echo json_encode(['success' => true, 'log' => $logContents]);
} else {
    echo json_encode(['success' => false, 'message' => 'Log dosyası bulunamadı!']);
}
?>