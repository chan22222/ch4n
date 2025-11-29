<?php
// CORS 헤더 설정
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// OPTIONS 요청 처리 (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 데이터베이스 설정 - Dothome 정보
// phpMyAdmin: https://chan222k.dothome.co.kr/myadmin
$host = 'localhost';
$dbname = 'chan222k'; // MySQL ID와 동일 (계정아이디와 동일)
$username = 'chan222k'; // MySQL ID
$password = 'tka@141592'; // MySQL 비밀번호

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// 방문자 테이블 생성 (없을 경우)
// connection_type 컬럼은 이제 배터리 잔량을 저장합니다 (예: "85%")
$createTableSQL = "
CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id VARCHAR(255) UNIQUE,
    ip VARCHAR(45),
    city VARCHAR(100),
    country VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    connection_type VARCHAR(50), -- 이제 배터리 잔량 저장 (기존 호환성 유지)
    first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    visit_count INT DEFAULT 1,
    INDEX idx_ip (ip),
    INDEX idx_last_visit (last_visit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";

try {
    $pdo->exec($createTableSQL);
} catch(PDOException $e) {
    // 테이블이 이미 존재하거나 생성 실패 시 무시
}
?>