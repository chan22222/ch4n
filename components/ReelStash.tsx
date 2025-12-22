import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Instagram } from 'lucide-react';

const ReelStash: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // 로딩 진행 애니메이션
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleIframeLoad = () => {
    // iframe이 로드되면 진행률을 100으로 설정
    setLoadingProgress(100);

    // 짧은 지연 후 로딩 상태 해제
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <>
      {/* Enhanced Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 pointer-events-none transition-opacity duration-300">
          {/* 로고 아이콘 */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-tr from-purple-500 to-pink-500 p-4 rounded-2xl shadow-2xl">
              <Instagram className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* 로딩 스피너 */}
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-4" />

          {/* 로딩 텍스트 */}
          <p className="text-slate-400 text-sm mb-4">ReelStash 로딩 중...</p>

          {/* 프로그레스 바 */}
          <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          {/* 로딩 팁 */}
          <p className="text-slate-600 text-xs mt-4">Instagram 릴스를 저장하고 관리하세요</p>
        </div>
      )}

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src="https://ch4n.co.kr/etc/instagram/"
        title="ReelStash"
        className="absolute inset-0 w-full h-full border-0"
        onLoad={handleIframeLoad}
        style={{
          backgroundColor: '#0f172a',
          visibility: isLoading ? 'hidden' : 'visible'
        }}
      />
    </>
  );
};

export default ReelStash;