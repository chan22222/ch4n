<?php
require_once 'config.php';

// POST 데이터 받기
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit();
}

// 필수 필드 확인
$visitor_id = $input['id'] ?? '';
$ip = $input['ip'] ?? '';
$city = $input['city'] ?? '-';
$country = $input['country'] ?? '-';
$browser = $input['browser'] ?? 'Unknown';
$os = $input['os'] ?? 'Unknown';
$battery_level = $input['batteryLevel'] ?? '-'; // 배터리 잔량 (이전 connectionType 대체)

if (empty($visitor_id) || empty($ip)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

try {
    // 기존 방문자인지 확인
    $checkSQL = "SELECT id, visit_count FROM visitors WHERE ip = :ip";
    $checkStmt = $pdo->prepare($checkSQL);
    $checkStmt->execute(['ip' => $ip]);
    $existing = $checkStmt->fetch();

    if ($existing) {
        // 기존 방문자 업데이트 - visit_count 증가, last_visit 자동 업데이트
        $updateSQL = "
            UPDATE visitors
            SET browser = :browser,
                os = :os,
                connection_type = :battery_level,
                visit_count = visit_count + 1,
                last_visit = CURRENT_TIMESTAMP
            WHERE ip = :ip
        ";

        $updateStmt = $pdo->prepare($updateSQL);
        $result = $updateStmt->execute([
            'browser' => $browser,
            'os' => $os,
            'battery_level' => $battery_level,
            'ip' => $ip
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Visitor updated',
            'visit_count' => $existing['visit_count'] + 1
        ]);

    } else {
        // 새 방문자 추가
        $insertSQL = "
            INSERT INTO visitors (visitor_id, ip, city, country, browser, os, connection_type)
            VALUES (:visitor_id, :ip, :city, :country, :browser, :os, :battery_level)
            ON DUPLICATE KEY UPDATE
                browser = VALUES(browser),
                os = VALUES(os),
                connection_type = VALUES(connection_type),
                visit_count = visit_count + 1
        ";

        $insertStmt = $pdo->prepare($insertSQL);
        $result = $insertStmt->execute([
            'visitor_id' => $visitor_id,
            'ip' => $ip,
            'city' => $city,
            'country' => $country,
            'browser' => $browser,
            'os' => $os,
            'battery_level' => $battery_level
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'New visitor saved',
            'visitor_id' => $visitor_id
        ]);
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save visitor']);
    error_log('Save visitor error: ' . $e->getMessage());
}
?>