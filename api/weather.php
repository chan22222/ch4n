<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// 기상청 API 키
$serviceKey = '7ec664dfdd1b762b3c11cdaf5c44555b0cda01d8544b360cce6811e86daf4e18';

// 현재 날짜와 시간 가져오기
$now = new DateTime('now', new DateTimeZone('Asia/Seoul'));
$baseDate = $now->format('Ymd');
$hour = intval($now->format('H'));

// 기상청 API는 3시간 단위로 제공 (02, 05, 08, 11, 14, 17, 20, 23시)
// 가장 최근 발표 시간 계산
if ($hour >= 23) {
    $baseTime = '2300';
} elseif ($hour >= 20) {
    $baseTime = '2000';
} elseif ($hour >= 17) {
    $baseTime = '1700';
} elseif ($hour >= 14) {
    $baseTime = '1400';
} elseif ($hour >= 11) {
    $baseTime = '1100';
} elseif ($hour >= 8) {
    $baseTime = '0800';
} elseif ($hour >= 5) {
    $baseTime = '0500';
} elseif ($hour >= 2) {
    $baseTime = '0200';
} else {
    // 새벽 0-2시는 전날 23시 데이터 사용
    $yesterday = clone $now;
    $yesterday->modify('-1 day');
    $baseDate = $yesterday->format('Ymd');
    $baseTime = '2300';
}

// 서울 격자 좌표
$nx = isset($_GET['nx']) ? $_GET['nx'] : 60;  // 서울 기본값
$ny = isset($_GET['ny']) ? $_GET['ny'] : 127; // 서울 기본값

// API 엔드포인트 선택 (단기예보 또는 초단기예보)
$endpoint = isset($_GET['type']) && $_GET['type'] === 'ultra' ?
    'getUltraSrtFcst' : 'getVilageFcst';

// 기상청 API URL
$url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/{$endpoint}";

// 쿼리 파라미터
$queryParams = http_build_query([
    'serviceKey' => $serviceKey,
    'pageNo' => 1,
    'numOfRows' => 1000,
    'dataType' => 'JSON',
    'base_date' => $baseDate,
    'base_time' => $baseTime,
    'nx' => $nx,
    'ny' => $ny
]);

// API 호출
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url . '?' . $queryParams);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    // CURL 에러 처리
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Failed to fetch weather data',
        'details' => $error
    ]);
    exit;
}

if ($httpCode !== 200) {
    // HTTP 에러 처리
    http_response_code($httpCode);
    echo json_encode([
        'error' => true,
        'message' => 'Weather API returned error',
        'httpCode' => $httpCode
    ]);
    exit;
}

// JSON 파싱
$data = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    // JSON 파싱 에러
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Failed to parse weather data',
        'details' => json_last_error_msg()
    ]);
    exit;
}

// 응답 확인
if (!isset($data['response']['header']['resultCode']) ||
    $data['response']['header']['resultCode'] !== '00') {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Weather API error',
        'details' => $data['response']['header']['resultMsg'] ?? 'Unknown error'
    ]);
    exit;
}

// 데이터 처리
$items = $data['response']['body']['items']['item'] ?? [];
$weatherData = processWeatherData($items);

// 결과 반환
echo json_encode([
    'success' => true,
    'baseDate' => $baseDate,
    'baseTime' => $baseTime,
    'location' => [
        'nx' => $nx,
        'ny' => $ny,
        'name' => 'Seoul'
    ],
    'weather' => $weatherData,
    'raw' => $items // 디버깅용 원본 데이터
]);

// 날씨 데이터 처리 함수
function processWeatherData($items) {
    $result = [];
    $days = [];

    // 날짜별로 데이터 그룹화
    foreach ($items as $item) {
        $date = $item['fcstDate'];
        $time = $item['fcstTime'];
        $category = $item['category'];
        $value = $item['fcstValue'];

        if (!isset($days[$date])) {
            $days[$date] = [];
        }

        if (!isset($days[$date][$time])) {
            $days[$date][$time] = [];
        }

        $days[$date][$time][$category] = $value;
    }

    // 오늘부터 5일간의 데이터 추출
    $dateKeys = array_keys($days);
    sort($dateKeys);

    $dayNames = ['today', 'tomorrow', 'dayAfter', 'day4', 'day5'];

    for ($i = 0; $i < min(5, count($dateKeys)); $i++) {
        $date = $dateKeys[$i];
        $dayData = $days[$date];

        // 최고/최저 기온 찾기
        $temps = [];
        $humidity = null;
        $sky = null;
        $pty = null;

        foreach ($dayData as $time => $data) {
            // 기온 (TMP)
            if (isset($data['TMP'])) {
                $temps[] = intval($data['TMP']);
            }

            // 습도 (REH)
            if (isset($data['REH']) && $humidity === null) {
                $humidity = intval($data['REH']);
            }

            // 하늘상태 (SKY) - 1: 맑음, 3: 구름많음, 4: 흐림
            if (isset($data['SKY']) && $sky === null) {
                $sky = intval($data['SKY']);
            }

            // 강수형태 (PTY) - 0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기
            if (isset($data['PTY']) && $pty === null) {
                $pty = intval($data['PTY']);
            }
        }

        // 날씨 상태 결정
        $condition = 'sunny';
        if ($pty > 0) {
            if ($pty == 1 || $pty == 4) {
                $condition = 'rainy';
            } elseif ($pty == 3) {
                $condition = 'snowy';
            } elseif ($pty == 2) {
                $condition = 'rainy'; // 비/눈은 비로 표시
            }
        } elseif ($sky !== null) {
            if ($sky == 1) {
                $condition = 'sunny';
            } elseif ($sky == 3) {
                $condition = 'partly_cloudy';
            } elseif ($sky == 4) {
                $condition = 'cloudy';
            }
        }

        // 평균, 최고, 최저 기온 계산
        if (count($temps) > 0) {
            $avgTemp = round(array_sum($temps) / count($temps));
            $maxTemp = max($temps);
            $minTemp = min($temps);
        } else {
            // 기본값
            $avgTemp = 20;
            $maxTemp = 25;
            $minTemp = 15;
        }

        $result[$dayNames[$i]] = [
            'temp' => $avgTemp,
            'max' => $maxTemp,
            'min' => $minTemp,
            'condition' => $condition,
            'humidity' => $humidity ?? 60,
            'date' => $date
        ];
    }

    // 5일치 데이터가 없으면 더미 데이터로 채우기
    for ($i = count($result); $i < 5; $i++) {
        $result[$dayNames[$i]] = [
            'temp' => 20,
            'max' => 25,
            'min' => 15,
            'condition' => 'sunny',
            'humidity' => 60,
            'date' => date('Ymd', strtotime("+{$i} days"))
        ];
    }

    return $result;
}
?>