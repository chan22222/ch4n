import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExternalPage from './components/ExternalPage';
import { Lock, Unlock } from 'lucide-react';

const PASSWORDS = ['seul', '1315'];
const HASH_KEYS = ['#seul', '#1315'];

const LoginScreen: React.FC<{ onSuccess: () => void; unlocking?: boolean }> = ({ onSuccess, unlocking }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showLogin, setShowLogin] = useState(!unlocking);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // 처음 마운트 시 페이드인
  useEffect(() => {
    if (unlocking) {
      // 해시로 접속 시 바로 성공 화면
      setShowLogin(false);
      setShowSuccess(true);
      setTimeout(() => setSuccessVisible(true), 50);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => onSuccess(), 500);
      }, 1500);
    } else {
      setTimeout(() => setShowLogin(true), 50);
    }
  }, [unlocking, onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (PASSWORDS.includes(password)) {
      localStorage.setItem('authenticated', 'true');
      // 로그인 창 페이드아웃
      setShowLogin(false);
      setTimeout(() => {
        // 성공 창 표시
        setShowSuccess(true);
        setTimeout(() => setSuccessVisible(true), 30);
        // 성공 창 페이드아웃 후 메인으로
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => onSuccess(), 300);
        }, 1000);
      }, 200);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className={`min-h-screen bg-[#0f172a] flex items-center justify-center p-4 transition-opacity duration-300 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* 로그인 창 */}
      {!showSuccess && (
        <div className={`bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 w-full max-w-sm backdrop-blur-sm transition-all duration-200 ${
          showLogin ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <Lock className="text-white" size={28} />
            </div>
            <h1 className="text-xl font-bold text-white">ch4n DevHub</h1>
            <p className="text-sm text-slate-400 mt-1">접근 권한이 필요합니다</p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="비밀번호 입력"
              className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors ${
                error ? 'border-red-500' : 'border-slate-700'
              }`}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">비밀번호가 틀렸습니다</p>
            )}
            <button
              type="submit"
              className="w-full mt-4 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary/20"
            >
              접속하기
            </button>
          </form>
        </div>
      )}

      {/* 성공 창 */}
      {showSuccess && (
        <div className={`flex flex-col items-center transition-all duration-300 ${
          successVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}>
          {/* 체크마크 애니메이션 */}
          <div className="relative mb-8">
            {/* 배경 원 - 펄스 효과 */}
            <div className="absolute inset-0 w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-secondary animate-ping opacity-20" />
            <div className="absolute inset-0 w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-secondary animate-pulse opacity-30" />

            {/* 메인 원 */}
            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/40">
              {/* 체크마크 SVG 애니메이션 */}
              <svg
                className="w-12 h-12 text-white"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  strokeDasharray: 50,
                  strokeDashoffset: 50,
                  animation: 'checkmark 0.4s ease-out 0.15s forwards'
                }}
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* 장식 파티클 */}
            <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute -bottom-1 -left-3 w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
            <div className="absolute top-1/2 -right-4 w-2 h-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '0.6s' }} />
          </div>

          {/* 텍스트 */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2 animate-fade-in"
                style={{ animation: 'fadeSlideUp 0.3s ease-out 0.2s both' }}>
              인증 완료!
            </h1>
            <p className="text-slate-400"
               style={{ animation: 'fadeSlideUp 0.3s ease-out 0.3s both' }}>
              환영합니다
            </p>
          </div>

          {/* 하단 로딩 인디케이터 */}
          <div className="mt-8 flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>

          <style>{`
            @keyframes checkmark {
              to {
                stroke-dashoffset: 0;
              }
            }
            @keyframes fadeSlideUp {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlockingByHash, setIsUnlockingByHash] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const hash = window.location.hash;

      if (HASH_KEYS.includes(hash)) {
        localStorage.setItem('authenticated', 'true');
        window.location.hash = '';
        setIsUnlockingByHash(true);
        setIsLoading(false);
      } else if (localStorage.getItem('authenticated') === 'true') {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();

    // 해시 변경 감지
    window.addEventListener('hashchange', checkAuth);
    return () => window.removeEventListener('hashchange', checkAuth);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onSuccess={() => setIsAuthenticated(true)} unlocking={isUnlockingByHash} />;
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/currency"
            element={<ExternalPage src="https://ch4n.co.kr/currency" title="환율 계산기" />}
          />
          <Route
            path="/gemini"
            element={<ExternalPage src="https://ch4n.co.kr/gemini" title="Gemini API" />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
