import React, { useState, useEffect } from 'react';
import {
  Clock,
  Monitor,
  Wifi,
  ShieldCheck,
  Battery,
  MapPin,
  Maximize,
  Globe,
} from 'lucide-react';
import { getApiUrl } from '../config/api';

const Dashboard: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [clientInfo, setClientInfo] = useState({
    browser: 'Unknown',
    os: 'Unknown',
    screen: '0x0',
    online: true,
    language: 'ko-KR',
    connectionType: 'Unknown',
    effectiveType: 'Unknown',
    downlink: 0,
    ipAddress: ''
  });

  // 시스템 정보 상태
  const [systemInfo, setSystemInfo] = useState({
    battery: {
      level: 0,
      charging: false,
      supported: false,
      chargingTime: 0,
      dischargingTime: 0
    },
    viewport: {
      width: 0,
      height: 0,
      pixelRatio: 1,
      colorDepth: 0,
      screenWidth: 0,
      screenHeight: 0,
      orientation: 'landscape',
      colorGamut: 'sRGB',
      hdrSupport: false
    },
    location: {
      timezone: '',
      timezoneOffset: 0,
      locale: '',
      country: '',
      language: '',
      city: '',
      regionName: '',
      countryCode: ''
    }
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    const updateClientInfo = () => {
      const ua = navigator.userAgent;
      let browser = "Browser";
      let os = "OS";

      // iOS 기기 판별
      if (/iPad|iPhone|iPod/.test(ua)) {
        os = "iOS";
        if (/CriOS/.test(ua)) {
          browser = "Chrome";
        } else if (/KAKAOTALK/.test(ua)) {
          browser = "KakaoTalk";
        } else if (/NAVER/.test(ua)) {
          browser = "Naver";
        } else if (/FxiOS/.test(ua)) {
          browser = "Firefox";
        } else if (/Safari/.test(ua) && !/CriOS/.test(ua)) {
          browser = "Safari";
        }
      }
      // Android 기기 판별
      else if (/Android/i.test(ua)) {
        os = "Android";
        if (/KAKAOTALK/.test(ua)) {
          browser = "KakaoTalk";
        } else if (/NAVER/.test(ua)) {
          browser = "Naver";
        } else if (/SamsungBrowser/.test(ua)) {
          browser = "Samsung";
        } else if (/Firefox/.test(ua)) {
          browser = "Firefox";
        } else if (/Chrome/.test(ua)) {
          browser = "Chrome";
        }
      }
      // Desktop 판별
      else {
        if (/Win/.test(ua)) os = "Windows";
        else if (/Mac/.test(ua)) os = "macOS";
        else if (/Linux/.test(ua)) os = "Linux";

        if (/Edg/.test(ua)) browser = "Edge";
        else if (/Chrome/.test(ua)) browser = "Chrome";
        else if (/Firefox/.test(ua)) browser = "Firefox";
        else if (/Safari/.test(ua)) browser = "Safari";
        else if (/OPR|Opera/.test(ua)) browser = "Opera";
      }

      // 네트워크 연결 정보
      let connectionType = 'Unknown';
      let effectiveType = 'Unknown';
      let downlink = 0;
      let isOnline = navigator.onLine;

      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        if (conn) {
          connectionType = conn.type || 'Unknown';
          effectiveType = conn.effectiveType || 'Unknown';
          downlink = conn.downlink || 0;

          // connection이 있고 type이 none이 아니면 온라인으로 간주
          if (connectionType !== 'none' && connectionType !== 'Unknown') {
            isOnline = true;
          }
          // effectiveType이 있으면 온라인으로 간주
          if (effectiveType !== 'Unknown' && effectiveType !== 'none') {
            isOnline = true;
          }
        }
      }

      setClientInfo(prev => ({
        browser: `${browser}`,
        os: os,
        screen: `${window.screen.width} x ${window.screen.height}`,
        online: isOnline,
        language: navigator.language,
        connectionType: connectionType,
        effectiveType: effectiveType,
        downlink: downlink,
        ipAddress: prev.ipAddress // IP 주소 유지
      }));
    };

    updateClientInfo();
    window.addEventListener('resize', updateClientInfo);
    window.addEventListener('online', updateClientInfo);
    window.addEventListener('offline', updateClientInfo);

    // IP 주소 가져오기
    const fetchIPAddress = async () => {
      try {
        const response = await fetch('https://api.ip.pe.kr/json');
        const data = await response.json();
        if (data && data.ip) {
          setClientInfo(prev => ({
            ...prev,
            ipAddress: data.ip
          }));
        }
      } catch (error) {
        console.error('Failed to fetch IP:', error);
      }
    };

    // 위치 정보 가져오기 (HTTPS 서비스만 사용)
    const fetchLocationData = async () => {
      // ipinfo.io 시도 (토큰 없이)
      try {
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        console.log('Location data from ipinfo.io:', data);

        if (data && !data.error && !data.bogon) {
          setSystemInfo(prev => ({
            ...prev,
            location: {
              ...prev.location,
              city: data.city || '-',
              regionName: data.region || '-',
              country: data.country === 'KR' ? 'South Korea' :
                      data.country === 'US' ? 'United States' :
                      data.country === 'JP' ? 'Japan' :
                      data.country === 'CN' ? 'China' :
                      data.country || '-',
              countryCode: data.country || '-',
              timezone: data.timezone || '-'
            }
          }));
          return;
        }
      } catch (error) {
        console.error('ipinfo.io failed:', error);
      }

      // 백업: ipapi.co 사용
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        console.log('Location data from ipapi.co:', data);

        if (data && !data.error) {
          setSystemInfo(prev => ({
            ...prev,
            location: {
              ...prev.location,
              city: data.city || '-',
              regionName: data.region || '-',
              country: data.country_name || '-',
              countryCode: data.country_code || '-',
              timezone: data.timezone || '-'
            }
          }));
          return;
        }
      } catch (error) {
        console.error('ipapi.co failed:', error);
      }

      // 백업: ip.pe.kr 사용하여 국가만이라도 추정
      try {
        const ipResponse = await fetch('https://api.ip.pe.kr/json');
        const ipData = await ipResponse.json();

        if (ipData && ipData.ip) {
          // IP 주소로 대략적인 위치 추정
          const ipParts = ipData.ip.split('.');
          const firstOctet = parseInt(ipParts[0]);

          // 한국 IP 대역 추정 (대략적)
          let estimatedCountry = '-';
          let estimatedCity = '-';

          if ((firstOctet >= 1 && firstOctet <= 3) ||
              (firstOctet >= 27 && firstOctet <= 27) ||
              (firstOctet >= 39 && firstOctet <= 39) ||
              (firstOctet >= 42 && firstOctet <= 42) ||
              (firstOctet >= 49 && firstOctet <= 49) ||
              (firstOctet >= 58 && firstOctet <= 61) ||
              (firstOctet >= 106 && firstOctet <= 106) ||
              (firstOctet >= 110 && firstOctet <= 112) ||
              (firstOctet >= 114 && firstOctet <= 125) ||
              (firstOctet >= 175 && firstOctet <= 175) ||
              (firstOctet >= 203 && firstOctet <= 203) ||
              (firstOctet >= 210 && firstOctet <= 223)) {
            estimatedCountry = 'South Korea';
            estimatedCity = 'Korea';
          }

          setSystemInfo(prev => ({
            ...prev,
            location: {
              ...prev.location,
              city: estimatedCity,
              regionName: '-',
              country: estimatedCountry,
              countryCode: estimatedCountry === 'South Korea' ? 'KR' : '-',
              timezone: estimatedCountry === 'South Korea' ? 'Asia/Seoul' : '-'
            }
          }));
          return;
        }
      } catch (error) {
        console.error('IP detection failed:', error);
      }

      // 모두 실패시 기본값 설정
      console.log('All location services failed, using defaults');
      setSystemInfo(prev => ({
        ...prev,
        location: {
          ...prev.location,
          city: '-',
          regionName: '-',
          country: '-',
          countryCode: '-',
          timezone: '-'
        }
      }));
    };

    fetchIPAddress();
    fetchLocationData();

    // 방문 기록 저장 (Admin 페이지가 아닐 때만)
    const recordVisit = async () => {
      if (window.location.hash === '#/admin') return; // Admin 페이지면 기록 안함

      try {
        const ipResponse = await fetch('https://api.ip.pe.kr/json');
        const ipData = await ipResponse.json();

        if (ipData && ipData.ip) {
          const ua = navigator.userAgent;
          let browser = "Unknown";
          let os = "Unknown";

          // OS 감지
          if (/iPad|iPhone|iPod/.test(ua)) os = "iOS";
          else if (/Android/i.test(ua)) os = "Android";
          else if (/Win/.test(ua)) os = "Windows";
          else if (/Mac/.test(ua)) os = "macOS";
          else if (/Linux/.test(ua)) os = "Linux";

          // 브라우저 감지
          if (/KAKAOTALK/.test(ua)) browser = "KakaoTalk";
          else if (/NAVER/.test(ua)) browser = "Naver";
          else if (/SamsungBrowser/.test(ua)) browser = "Samsung";
          else if (/CriOS/.test(ua)) browser = "Chrome (iOS)";
          else if (/FxiOS/.test(ua)) browser = "Firefox (iOS)";
          else if (/Edg/.test(ua)) browser = "Edge";
          else if (/Chrome/.test(ua)) browser = "Chrome";
          else if (/Firefox/.test(ua)) browser = "Firefox";
          else if (/Safari/.test(ua)) browser = "Safari";

          // 배터리 정보 수집
          let batteryLevel = '-';
          if ('getBattery' in navigator) {
            try {
              const battery: any = await (navigator as any).getBattery();
              batteryLevel = `${Math.round(battery.level * 100)}%`;
            } catch (e) {
              console.log('Battery API not available');
            }
          }

          const visitor = {
            id: `${ipData.ip}_${Date.now()}`,
            ip: ipData.ip,
            city: '-',
            country: '-',
            browser,
            os,
            timestamp: new Date().toISOString(),
            batteryLevel // 배터리 잔량 추가
          };

          // 위치 정보 수집 시도
          try {
            const locResponse = await fetch('https://ipinfo.io/json');
            const locData = await locResponse.json();
            if (locData && !locData.error) {
              visitor.city = locData.city || '-';
              visitor.country = locData.country === 'KR' ? 'South Korea' :
                             locData.country === 'US' ? 'United States' :
                             locData.country === 'JP' ? 'Japan' :
                             locData.country || '-';
            }
          } catch (e) {
            console.log('Location fetch failed, using defaults');
          }

          // PHP API로 방문자 저장
          try {
            await fetch(getApiUrl('SAVE_VISITOR'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(visitor)
            });
          } catch (apiError) {
            console.error('Failed to save visitor to API:', apiError);
            // API 실패시 로컬 스토리지에 백업 저장
            const stored = localStorage.getItem('admin_visitors');
            const visitors = stored ? JSON.parse(stored) : [];
            const existingIndex = visitors.findIndex((v: any) => v.ip === ipData.ip);

            if (existingIndex === -1) {
              const updated = [visitor, ...visitors].slice(0, 100);
              localStorage.setItem('admin_visitors', JSON.stringify(updated));
            } else {
              visitors[existingIndex] = {
                ...visitors[existingIndex],
                timestamp: new Date().toISOString(),
                browser,
                os,
                batteryLevel
              };
              localStorage.setItem('admin_visitors', JSON.stringify(visitors));
            }
          }
        }
      } catch (error) {
        console.error('Failed to record visit:', error);
      }
    };

    recordVisit();

    // 네트워크 상태 변경 감지 개선
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn) {
        conn.addEventListener('change', () => {
          updateClientInfo();
          fetchIPAddress(); // IP도 다시 가져오기
          fetchLocationData(); // 위치 정보도 다시 가져오기
        });
      }
    }

    // 주기적으로 네트워크 상태 확인 (모바일 대응)
    const networkCheckInterval = setInterval(() => {
      updateClientInfo();
    }, 5000);

    // IP 주소 주기적 업데이트 (네트워크 변경 감지)
    const ipCheckInterval = setInterval(() => {
      fetchIPAddress();
    }, 30000); // 30초마다

    // 시스템 정보 수집
    const updateSystemInfo = async () => {
      // Battery API
      if ('getBattery' in navigator) {
        try {
          const battery: any = await (navigator as any).getBattery();

          const updateBattery = () => {
            setSystemInfo(prev => ({
              ...prev,
              battery: {
                level: Math.round(battery.level * 100),
                charging: battery.charging,
                supported: true,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime
              }
            }));
          };

          updateBattery();

          battery.addEventListener('levelchange', updateBattery);
          battery.addEventListener('chargingchange', updateBattery);
          battery.addEventListener('chargingtimechange', updateBattery);
          battery.addEventListener('dischargingtimechange', updateBattery);
        } catch (error) {
          console.log('Battery API not available');
        }
      }

      // Viewport & Display
      const updateViewport = () => {
        const dpr = window.devicePixelRatio || 1;

        // Color Gamut Detection
        let colorGamut = 'sRGB';
        if (window.matchMedia('(color-gamut: p3)').matches) {
          colorGamut = 'Display P3';
        } else if (window.matchMedia('(color-gamut: rec2020)').matches) {
          colorGamut = 'Rec. 2020';
        }

        // HDR Support
        const hdrSupport = window.matchMedia('(dynamic-range: high)').matches;

        // Orientation
        const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

        setSystemInfo(prev => ({
          ...prev,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: dpr,
            colorDepth: window.screen.colorDepth,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            orientation,
            colorGamut,
            hdrSupport
          }
        }));
      };

      updateViewport();
      window.addEventListener('resize', updateViewport);

      // Location & Timezone info
      const updateLocation = () => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneOffset = new Date().getTimezoneOffset();
        const locale = navigator.language || 'ko-KR';

        // 언어 코드에서 국가 추정
        let country = 'Unknown';
        if (locale.includes('-')) {
          const parts = locale.split('-');
          country = parts[parts.length - 1].toUpperCase();
        }

        // 언어 이름 가져오기
        let language = 'Korean';
        try {
          const langCode = locale.split('-')[0];
          const langNames: any = {
            'ko': 'Korean',
            'en': 'English',
            'ja': 'Japanese',
            'zh': 'Chinese',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'ru': 'Russian'
          };
          language = langNames[langCode] || langCode.toUpperCase();
        } catch {}

        setSystemInfo(prev => ({
          ...prev,
          location: {
            timezone,
            timezoneOffset,
            locale,
            country,
            language
          }
        }));
      };

      updateLocation();
    };

    updateSystemInfo();

    return () => {
      clearInterval(timer);
      clearInterval(networkCheckInterval);
      clearInterval(ipCheckInterval);
      window.removeEventListener('resize', updateClientInfo);
      window.removeEventListener('online', updateClientInfo);
      window.removeEventListener('offline', updateClientInfo);

      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        if (conn) {
          conn.removeEventListener('change', updateClientInfo);
        }
      }
    };
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-[#0f172a] text-slate-200">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
                  <ShieldCheck size={14} />
                  <span>접속 승인됨</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                  환영합니다!
                </h1>
                <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                  다양한 유틸리티를 모아놓은 공간입니다.
                  필요한 서비스를 선택하여 자유롭게 이용하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Time Widget */}
          <div className="bg-surface border border-slate-700/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Clock size={18} />
              <span className="text-sm font-medium">현재 시각</span>
            </div>
            <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="text-sm text-slate-500 mt-1 font-medium">
              {formatDate(time)}
            </div>
          </div>

          {/* Client Environment */}
          <div className="bg-surface border border-slate-700/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Monitor size={18} />
              <span className="text-sm font-medium">접속 환경</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Device</span>
                <span className="text-slate-200 font-medium">{clientInfo.os}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Browser</span>
                <span className="text-slate-200 font-medium">{clientInfo.browser}</span>
              </div>
            </div>
          </div>

          {/* Network Status */}
          <div className="bg-surface border border-slate-700/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Wifi size={18} />
              <span className="text-sm font-medium">네트워크 상태</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${clientInfo.online ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`}></div>
                <span className="text-xl font-bold text-white">
                  {clientInfo.online ? 'Online' : 'Offline'}
                </span>
              </div>
              {clientInfo.online && (
                <div className="text-xs text-slate-400">
                  <div>
                    {clientInfo.ipAddress && (
                      <span>IP: {clientInfo.ipAddress}</span>
                    )}
                    {clientInfo.ipAddress && ' · '}
                    {(() => {
                      // connectionType이 있으면 우선 사용
                      if (clientInfo.connectionType !== 'Unknown' && clientInfo.connectionType !== 'none') {
                        if (clientInfo.connectionType === 'wifi') return 'WiFi';
                        if (clientInfo.connectionType === 'ethernet') return 'Ethernet';
                        if (clientInfo.connectionType === 'cellular') {
                          // cellular인 경우 effectiveType으로 세부 판단
                          if (clientInfo.effectiveType === '4g') return 'LTE/4G';
                          if (clientInfo.effectiveType === '3g') return '3G';
                          if (clientInfo.effectiveType === '2g') return '2G';
                          if (clientInfo.effectiveType === 'slow-2g') return '매우 느림';
                          return 'Mobile';
                        }
                      }
                      // effectiveType만 있는 경우
                      if (clientInfo.effectiveType !== 'Unknown') {
                        if (clientInfo.effectiveType === '4g') return 'High Speed';
                        if (clientInfo.effectiveType === '3g') return 'Medium Speed';
                        if (clientInfo.effectiveType === '2g') return 'Low Speed';
                        if (clientInfo.effectiveType === 'slow-2g') return '매우 느림';
                      }
                      return '확인 중';
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Info Widgets - Simple */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Battery Widget - Enhanced */}
          <div className="bg-surface border border-slate-700/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Battery size={18} />
              <span className="text-sm font-medium">배터리 상태</span>
            </div>
            {systemInfo.battery.supported ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-white">{systemInfo.battery.level}%</span>
                    {systemInfo.battery.charging ? (
                      <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                        ⚡ 충전 중
                      </span>
                    ) : (
                      <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
                        배터리 사용
                      </span>
                    )}
                  </div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        systemInfo.battery.charging ? 'bg-gradient-to-r from-green-500 to-green-400' :
                        systemInfo.battery.level > 50 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                        systemInfo.battery.level > 20 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      style={{ width: `${systemInfo.battery.level}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {systemInfo.battery.charging && systemInfo.battery.chargingTime !== Infinity && systemInfo.battery.chargingTime > 60 && systemInfo.battery.chargingTime < 86400 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">완충까지</span>
                      <span className="text-slate-300">
                        {Math.floor(systemInfo.battery.chargingTime / 3600)}시간 {Math.floor((systemInfo.battery.chargingTime % 3600) / 60)}분
                      </span>
                    </div>
                  )}
                  {!systemInfo.battery.charging && systemInfo.battery.dischargingTime !== Infinity && systemInfo.battery.dischargingTime > 60 && systemInfo.battery.dischargingTime < 86400 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">남은 시간</span>
                      <span className="text-slate-300">
                        {Math.floor(systemInfo.battery.dischargingTime / 3600)}시간 {Math.floor((systemInfo.battery.dischargingTime % 3600) / 60)}분
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">상태</span>
                    <span className={
                      systemInfo.battery.charging ? 'text-green-400' :
                      systemInfo.battery.level > 80 ? 'text-blue-400' :
                      systemInfo.battery.level > 20 ? 'text-yellow-400' :
                      'text-red-400'
                    }>
                      {systemInfo.battery.charging ? '충전기 연결됨' :
                       systemInfo.battery.level > 80 ? '충분함' :
                       systemInfo.battery.level > 50 ? '사용 가능' :
                       systemInfo.battery.level > 20 ? '충전 권장' :
                       '충전 필요'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                <Monitor size={48} className="text-slate-600 mb-3" />
                <span className="text-lg font-semibold text-slate-400">데스크톱 PC</span>
                <span className="text-xs text-slate-500 mt-1">전원 연결됨</span>
              </div>
            )}
          </div>

          {/* Viewport Widget - Simple */}
          <div className="bg-surface border border-slate-700/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Maximize size={18} />
              <span className="text-sm font-medium">뷰포트</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-white">
                  {systemInfo.viewport.width} × {systemInfo.viewport.height}
                </div>
                <div className="text-xs text-slate-500">현재 화면 크기</div>
              </div>
              <div className="text-xs text-slate-400">
                <div>화면: {systemInfo.viewport.screenWidth} × {systemInfo.viewport.screenHeight}</div>
                <div className="mt-1">픽셀비율: {systemInfo.viewport.pixelRatio}x</div>
              </div>
            </div>
          </div>

          {/* Location & Timezone Widget */}
          <div className="bg-surface border border-slate-700/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <MapPin size={18} />
              <span className="text-sm font-medium">위치 & 시간대</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xl font-bold text-white">
                  {systemInfo.location.city && systemInfo.location.city !== 'Unknown'
                    ? systemInfo.location.city
                    : (systemInfo.location.timezone ? systemInfo.location.timezone.split('/').pop()?.replace(/_/g, ' ') : 'Loading...')}
                </div>
                <div className="text-xs text-slate-500">
                  {systemInfo.location.regionName && systemInfo.location.country
                    ? `${systemInfo.location.regionName}, ${systemInfo.location.country}`
                    : systemInfo.location.country || 'Detecting location...'}
                </div>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1">
                  <Globe size={12} />
                  <span>
                    {systemInfo.location.countryCode || '-'} ·
                    UTC{systemInfo.location.timezoneOffset > 0 ? '-' : '+'}{Math.abs(systemInfo.location.timezoneOffset / 60)}
                  </span>
                </div>
                <div>시간대: {systemInfo.location.timezone || '-'}</div>
              </div>
            </div>
          </div>
        </div>


        {/* Footer Info */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2024 ch4n DevHub. All systems operational.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Server Status: Stable
            </span>
            <span className="font-mono">v3.1.0-stable</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
