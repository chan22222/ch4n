// API 설정 파일
// Dothome 호스팅 설정

export const API_CONFIG = {
  // ch4n.co.kr 도메인 사용 (SSL 적용됨)
  BASE_URL: 'https://ch4n.co.kr/api',

  // 또는 기본 Dothome 도메인 사용시:
  // BASE_URL: 'https://chan222k.dothome.co.kr/api',

  // 엔드포인트
  ENDPOINTS: {
    SAVE_VISITOR: '/save-visitor.php',
    GET_VISITORS: '/get-visitors.php'
  },

  // 타임아웃 설정 (ms)
  TIMEOUT: 5000,

  // 재시도 횟수
  RETRY_COUNT: 2
};

// API URL 생성 헬퍼
export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};