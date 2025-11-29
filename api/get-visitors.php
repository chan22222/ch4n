<?php
require_once 'config.php';

// 쿼리 파라미터 받기
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
$active_only = isset($_GET['active']) ? filter_var($_GET['active'], FILTER_VALIDATE_BOOLEAN) : false;

try {
    if ($active_only) {
        // 최근 10분 이내 활성 방문자만
        $sql = "
            SELECT
                visitor_id as id,
                ip,
                city,
                country,
                browser,
                os,
                connection_type as batteryLevel,
                last_visit as timestamp,
                visit_count
            FROM visitors
            WHERE last_visit >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
            ORDER BY last_visit DESC
            LIMIT :limit
        ";
    } else {
        // 전체 방문자 (최근 순)
        $sql = "
            SELECT
                visitor_id as id,
                ip,
                city,
                country,
                browser,
                os,
                connection_type as batteryLevel,
                last_visit as timestamp,
                visit_count
            FROM visitors
            ORDER BY last_visit DESC
            LIMIT :limit
        ";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    $visitors = $stmt->fetchAll();

    // 타임스탬프를 ISO 형식으로 변환
    foreach ($visitors as &$visitor) {
        $visitor['timestamp'] = date('c', strtotime($visitor['timestamp']));
        $visitor['visit_count'] = intval($visitor['visit_count']);
    }

    // 통계 정보 추가
    $statsSQL = "
        SELECT
            COUNT(*) as total_visitors,
            COUNT(CASE WHEN last_visit >= DATE_SUB(NOW(), INTERVAL 10 MINUTE) THEN 1 END) as active_visitors,
            COUNT(CASE WHEN DATE(last_visit) = CURDATE() THEN 1 END) as today_visitors
        FROM visitors
    ";
    $statsStmt = $pdo->query($statsSQL);
    $stats = $statsStmt->fetch();

    echo json_encode([
        'success' => true,
        'visitors' => $visitors,
        'stats' => [
            'total' => intval($stats['total_visitors']),
            'active' => intval($stats['active_visitors']),
            'today' => intval($stats['today_visitors'])
        ]
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch visitors']);
    error_log('Fetch visitors error: ' . $e->getMessage());
}
?>