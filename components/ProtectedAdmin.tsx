import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Admin from './Admin';

const ProtectedAdmin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 페이지 로드시 세션 확인
  useEffect(() => {
    const checkSession = () => {
      const session = sessionStorage.getItem('admin_authenticated');
      if (session === 'true') {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 간단한 비밀번호 검증 (프로덕션에서는 백엔드 사용 권장)
      // crypto API 대신 직접 비교
      const correctPassword = '1315';

      if (password === correctPassword) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        setPassword('');
      } else {
        // SHA-256 해싱 시도 (fallback)
        try {
          const encoder = new TextEncoder();
          const data = encoder.encode(password);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

          const correctHash = '352fe25599cbc106a6e45d1e60c9e147a3e8b162b55bb66e4c756a00a33f8dc1';

          if (hashHex === correctHash) {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_authenticated', 'true');
            setPassword('');
            return;
          }
        } catch (hashError) {
          console.error('Hash comparison failed:', hashError);
        }

        setError('비밀번호가 올바르지 않습니다');
        // 실패시 진동 효과
        const form = document.getElementById('login-form');
        if (form) {
          form.classList.add('animate-shake');
          setTimeout(() => form.classList.remove('animate-shake'), 500);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('로그인 처리 중 오류가 발생했습니다');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a] p-4">
        <div className="w-full max-w-md">
          <div className="bg-surface border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                  <Lock className="text-primary" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">관리자 인증</h2>
                  <p className="text-sm text-slate-400">비밀번호를 입력하세요</p>
                </div>
              </div>
            </div>

            <form id="login-form" onSubmit={handleLogin} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
              >
                로그인
              </button>

              <div className="text-center text-xs text-slate-500">
                <p>보안 연결</p>
              </div>
            </form>
          </div>

          <div className="mt-4 text-center text-xs text-slate-600">
            <p>관리자만 접근 가능한 페이지입니다</p>
          </div>
        </div>

        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  // 인증됨 - Admin 컴포넌트 렌더링
  return (
    <div className="relative min-h-screen">
      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2 shadow-lg"
      >
        <Lock size={16} />
        로그아웃
      </button>

      <Admin />
    </div>
  );
};

export default ProtectedAdmin;