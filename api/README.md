# API 설정 가이드

## 1. Dothome phpMyAdmin 설정

1. **config.php 수정**
   - `$host`: 보통 'localhost' 그대로 사용
   - `$dbname`: Dothome 데이터베이스 이름 입력
   - `$username`: Dothome 사용자명 입력
   - `$password`: Dothome 비밀번호 입력

2. **파일 업로드**
   - FTP 또는 Dothome 파일매니저 사용
   - 호스팅 루트에 `api` 폴더 생성
   - 3개 PHP 파일 업로드:
     - config.php
     - save-visitor.php
     - get-visitors.php

## 2. 데이터베이스 테이블

자동으로 생성되지만, 수동 생성 필요시:

```sql
CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id VARCHAR(255) UNIQUE,
    ip VARCHAR(45),
    city VARCHAR(100),
    country VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    connection_type VARCHAR(50),
    first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    visit_count INT DEFAULT 1,
    INDEX idx_ip (ip),
    INDEX idx_last_visit (last_visit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 3. API 엔드포인트

- **방문자 저장**: `https://your-domain.com/api/save-visitor.php`
- **방문자 조회**: `https://your-domain.com/api/get-visitors.php`
  - 파라미터:
    - `?limit=100` - 가져올 방문자 수
    - `?active=true` - 활성 방문자만

## 4. 보안 주의사항

- config.php의 데이터베이스 정보는 절대 공개하지 마세요
- HTTPS 사용 권장
- 필요시 API 키 인증 추가 가능