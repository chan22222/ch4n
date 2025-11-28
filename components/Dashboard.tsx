import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Clock,
  Globe,
  Server,
  Monitor,
  Wifi,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layout,
  ExternalLink,
} from 'lucide-react';

const SYSTEM_MODULES = [
  {
    id: 'portfolio',
    name: '포트폴리오',
    desc: '개인 작업물 아카이브',
    status: 'Active',
    path: 'https://ch4n.co.kr/portfolio',
    icon: Server,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    external: true
  },
  {
    id: 'currency',
    name: '환율 계산기',
    desc: '실시간 환율 변환 도구',
    status: 'Active',
    path: '/currency',
    icon: Globe,
    color: 'text-green-400',
    bg: 'bg-green-400/10'
  },
  {
    id: 'gemini',
    name: 'Gemini API',
    desc: 'Google AI 연동',
    status: 'Standby',
    path: '/gemini',
    icon: Cpu,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10'
  },
];

const Dashboard: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [clientInfo, setClientInfo] = useState({
    browser: 'Unknown',
    os: 'Unknown',
    screen: '0x0',
    online: true,
    language: 'ko-KR'
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    const updateClientInfo = () => {
      const ua = navigator.userAgent;
      let browser = "Browser";
      if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Safari")) browser = "Safari";
      else if (ua.includes("Edge")) browser = "Edge";

      let os = "OS";
      if (ua.includes("Win")) os = "Windows";
      else if (ua.includes("Mac")) os = "macOS";
      else if (ua.includes("Linux")) os = "Linux";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("iOS")) os = "iOS";

      setClientInfo({
        browser: `${browser}`,
        os: os,
        screen: `${window.screen.width} x ${window.screen.height}`,
        online: navigator.onLine,
        language: navigator.language
      });
    };

    updateClientInfo();
    window.addEventListener('resize', updateClientInfo);
    window.addEventListener('online', updateClientInfo);
    window.addEventListener('offline', updateClientInfo);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', updateClientInfo);
      window.removeEventListener('online', updateClientInfo);
      window.removeEventListener('offline', updateClientInfo);
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
                  <span>관리자 접속 승인됨</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                  반갑습니다, <span className="text-primary">ch4n</span>님.
                </h1>
                <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                  DevHub 통합 제어 센터에 오신 것을 환영합니다.
                  이곳에서 포트폴리오, 환율 계산기, 마케팅 도구 등 모든 서브 시스템을 모니터링하고 제어할 수 있습니다.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <a href="https://ch4n.co.kr/portfolio" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
                  <Layout size={18} />
                  포트폴리오
                </a>
                <a href="https://ch4n.co.kr/portfolio/#contact" target="_blank" rel="noopener noreferrer" className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-xl font-semibold transition-colors border border-slate-600">
                  문의하기
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
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
                <span className="text-slate-500">Browser</span>
                <span className="text-slate-200 font-medium">{clientInfo.browser} on {clientInfo.os}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Resolution</span>
                <span className="text-slate-200 font-medium">{clientInfo.screen}</span>
              </div>
            </div>
          </div>

          {/* Network Status */}
          <div className="bg-surface border border-slate-700/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Wifi size={18} />
              <span className="text-sm font-medium">네트워크 상태</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${clientInfo.online ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`}></div>
              <span className="text-xl font-bold text-white">
                {clientInfo.online ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Language: {clientInfo.language}
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={20} />
            시스템 모듈
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SYSTEM_MODULES.map((mod) => {
              const isExternal = 'external' in mod && mod.external;
              const CardContent = (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${mod.bg} ${mod.color}`}>
                      <mod.icon size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      {isExternal && (
                        <div className="bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                          <ExternalLink size={12} className="text-slate-400" />
                        </div>
                      )}
                      <div className="bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">
                          {mod.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                    {mod.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 h-10">
                    {mod.desc}
                  </p>

                  <div className="flex items-center text-xs font-semibold text-slate-500 group-hover:text-white transition-colors gap-1">
                    {isExternal ? '새 창에서 열기' : '접속하기'}
                    {isExternal ? <ExternalLink size={12} /> : <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />}
                  </div>
                </>
              );

              if (isExternal) {
                return (
                  <a
                    key={mod.id}
                    href={mod.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-surface border border-slate-700/50 hover:border-slate-500 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
                  >
                    {CardContent}
                  </a>
                );
              }

              return (
                <Link
                  key={mod.id}
                  to={mod.path}
                  className="group bg-surface border border-slate-700/50 hover:border-slate-500 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
                >
                  {CardContent}
                </Link>
              );
            })}
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
