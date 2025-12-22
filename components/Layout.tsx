import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Bot,
  Shield,
  Globe,
  Calculator,
  FileText,
  Settings,
  Instagram,
  Briefcase,
  Package,
  Camera,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Auto collapse/expand based on route
  React.useEffect(() => {
    if (location.pathname === '/currency' || location.pathname === '/gemini' || location.pathname === '/reelstash' || location.pathname === '/portfolio' || location.pathname === '/iptracker' || location.pathname === '/shipdago' || location.pathname === '/photo') {
      setIsDesktopCollapsed(true);
    } else if (location.pathname === '/') {
      setIsDesktopCollapsed(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-background overflow-hidden text-slate-100 font-sans">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-30 h-full bg-surface border-r border-slate-700/50
          transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64
          ${isDesktopCollapsed ? 'md:w-20' : 'md:w-64'}
          md:translate-x-0
        `}
      >
        {/* Desktop Collapse Handle - Thin vertical tab */}
        <div
          className="hidden md:flex absolute -right-0.5 top-0 bottom-0 w-0.5 items-center justify-center group cursor-pointer z-10"
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
        >
          <div className="absolute inset-0 bg-transparent group-hover:bg-slate-600 transition-colors duration-200"></div>
          <div className="relative bg-surface group-hover:bg-slate-700 rounded-md py-6 px-0.5 transition-all duration-200 shadow-sm">
            {isDesktopCollapsed ? (
              <ChevronRight size={8} className="text-slate-400 group-hover:text-slate-200" />
            ) : (
              <ChevronLeft size={8} className="text-slate-400 group-hover:text-slate-200" />
            )}
          </div>
        </div>

        <div className={`p-6 ${isDesktopCollapsed ? 'md:p-4' : 'md:p-6'} flex items-center justify-between shrink-0`}>
          <div className={`flex items-center gap-3 ${isDesktopCollapsed ? 'md:justify-center md:w-full md:gap-0' : ''}`}>
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <img src="/ch4n_logo.png" alt="ch4n logo" className="w-full h-full object-contain" />
            </div>
            <div className={`transition-all duration-300 ${isDesktopCollapsed ? 'md:w-0 md:opacity-0 md:invisible md:overflow-hidden' : 'md:w-auto md:opacity-100 md:visible'} hidden md:block`}>
              <h1 className="font-bold text-lg tracking-tight whitespace-nowrap">ch4n.co.kr</h1>
              <p className="text-xs text-slate-400 whitespace-nowrap">DevHub Suite</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="px-4 py-2 space-y-1 flex-1 overflow-y-auto">
          <NavLink
            to="/"
            className={`
              flex items-center gap-3 ${isDesktopCollapsed ? 'md:justify-center md:gap-0' : ''} px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${location.pathname === '/'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }
            `}
            title={isDesktopCollapsed ? '대시보드' : ''}
          >
            <LayoutDashboard size={18} className={`${location.pathname === '/' ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} shrink-0`} />
            <span className={`font-medium text-sm transition-all duration-300 ${isDesktopCollapsed ? 'md:w-0 md:opacity-0 md:invisible md:overflow-hidden' : ''} whitespace-nowrap`}>대시보드</span>
            {location.pathname === '/' && !isDesktopCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
            {location.pathname === '/' && isDesktopCollapsed && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
          </NavLink>

          <NavLink
            to="/portfolio"
            className={`
              flex items-center gap-3 ${isDesktopCollapsed ? 'md:justify-center md:gap-0' : ''} px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${location.pathname === '/portfolio'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }
            `}
            title={isDesktopCollapsed ? '개발자 포트폴리오' : ''}
          >
            <Briefcase size={18} className={`${location.pathname === '/portfolio' ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} shrink-0`} />
            <span className={`font-medium text-sm transition-all duration-300 ${isDesktopCollapsed ? 'md:w-0 md:opacity-0 md:invisible md:overflow-hidden' : ''} whitespace-nowrap`}>개발자 포트폴리오</span>
            {location.pathname === '/portfolio' && !isDesktopCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
            {location.pathname === '/portfolio' && isDesktopCollapsed && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
          </NavLink>

          {/* 구분선 */}
          <div className="my-2 mx-4 border-t border-slate-700/50"></div>

          <NavLink
            to="/gemini"
            className={`
              flex items-center gap-3 ${isDesktopCollapsed ? 'md:justify-center md:gap-0' : ''} px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${location.pathname === '/gemini'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }
            `}
            title={isDesktopCollapsed ? 'Gemini AI' : ''}
          >
            <Bot size={18} className={`${location.pathname === '/gemini' ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} shrink-0`} />
            <span className={`font-medium text-sm transition-all duration-300 ${isDesktopCollapsed ? 'md:w-0 md:opacity-0 md:invisible md:overflow-hidden' : ''} whitespace-nowrap`}>Gemini AI</span>
            {location.pathname === '/gemini' && !isDesktopCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
            {location.pathname === '/gemini' && isDesktopCollapsed && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
          </NavLink>

          <NavLink
            to="/shipdago"
            className={`
              flex items-center gap-3 ${isDesktopCollapsed ? 'md:justify-center md:gap-0' : ''} px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${location.pathname === '/shipdago'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }
            `}
            title={isDesktopCollapsed ? 'Shipdago.com' : ''}
          >
            <Package size={18} className={`${location.pathname === '/shipdago' ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} shrink-0`} />
            <span className={`font-medium text-sm transition-all duration-300 ${isDesktopCollapsed ? 'md:w-0 md:opacity-0 md:invisible md:overflow-hidden' : ''} whitespace-nowrap`}>Shipdago.com</span>
            {location.pathname === '/shipdago' && !isDesktopCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
            {location.pathname === '/shipdago' && isDesktopCollapsed && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
          </NavLink>

          <NavLink
            to="/photo"
            className={`
              flex items-center gap-3 ${isDesktopCollapsed ? 'md:justify-center md:gap-0' : ''} px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${location.pathname === '/photo'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }
            `}
            title={isDesktopCollapsed ? '사진값 변환 & 모자이크' : ''}
          >
            <Camera size={18} className={`${location.pathname === '/photo' ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} shrink-0`} />
            <span className={`font-medium text-sm transition-all duration-300 ${isDesktopCollapsed ? 'md:w-0 md:opacity-0 md:invisible md:overflow-hidden' : ''} whitespace-nowrap`}>사진값 변환 & 모자이크</span>
            {location.pathname === '/photo' && !isDesktopCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
            {location.pathname === '/photo' && isDesktopCollapsed && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
          </NavLink>

          <NavLink
            to="/currency"
            className={`
              flex items-center gap-3 ${isDesktopCollapsed ? 'md:justify-center md:gap-0' : ''} px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${location.pathname === '/currency'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }
            `}
            title={isDesktopCollapsed ? '환율 계산기' : ''}
          >
            <DollarSign size={18} className={`${location.pathname === '/currency' ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} shrink-0`} />
            <span className={`font-medium text-sm transition-all duration-300 ${isDesktopCollapsed ? 'md:w-0 md:opacity-0 md:invisible md:overflow-hidden' : ''} whitespace-nowrap`}>환율 계산기</span>
            {location.pathname === '/currency' && !isDesktopCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
            {location.pathname === '/currency' && isDesktopCollapsed && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
          </NavLink>

          <NavLink
            to="/reelstash"
            className={`
              flex items-center gap-3 ${isDesktopCollapsed ? 'md:justify-center md:gap-0' : ''} px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${location.pathname === '/reelstash'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }
            `}
            title={isDesktopCollapsed ? '릴스 저장소(ReelStash)' : ''}
          >
            <Instagram size={18} className={`${location.pathname === '/reelstash' ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} shrink-0`} />
            <span className={`font-medium text-sm transition-all duration-300 ${isDesktopCollapsed ? 'md:w-0 md:opacity-0 md:invisible md:overflow-hidden' : ''} whitespace-nowrap`}>릴스 저장소(ReelStash)</span>
            {location.pathname === '/reelstash' && !isDesktopCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
            {location.pathname === '/reelstash' && isDesktopCollapsed && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
          </NavLink>

          <NavLink
            to="/iptracker"
            className={`
              flex items-center gap-3 ${isDesktopCollapsed ? 'md:justify-center md:gap-0' : ''} px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${location.pathname === '/iptracker'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }
            `}
            title={isDesktopCollapsed ? 'IP 정보 추적기' : ''}
          >
            <Shield size={18} className={`${location.pathname === '/iptracker' ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} shrink-0`} />
            <span className={`font-medium text-sm transition-all duration-300 ${isDesktopCollapsed ? 'md:w-0 md:opacity-0 md:invisible md:overflow-hidden' : ''} whitespace-nowrap`}>IP 정보 추적기</span>
            {location.pathname === '/iptracker' && !isDesktopCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
            {location.pathname === '/iptracker' && isDesktopCollapsed && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary md:block hidden" />}
          </NavLink>
        </nav>

        <div className={`p-6 ${isDesktopCollapsed ? 'md:p-3' : ''} shrink-0`}>
          <div
            onClick={() => navigate('/admin')}
            className={`p-4 ${isDesktopCollapsed ? 'md:p-2' : ''} rounded-xl bg-slate-900/50 border border-slate-700/50 cursor-pointer transition-all duration-200 hover:bg-slate-800/50 hover:border-slate-600/50 group`}
            title="관리자 페이지"
          >
            <p className={`text-xs text-slate-400 mb-2 font-medium transition-all duration-300 ${isDesktopCollapsed ? 'md:h-0 md:opacity-0 md:invisible md:overflow-hidden md:mb-0' : ''} group-hover:text-slate-300 whitespace-nowrap`}>서비스 상태</p>
            <div className={`flex items-center gap-2 ${isDesktopCollapsed ? 'md:justify-center md:gap-0' : ''}`}>
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className={`text-sm font-semibold text-slate-200 transition-all duration-300 ${isDesktopCollapsed ? 'md:w-0 md:opacity-0 md:invisible md:overflow-hidden' : ''} group-hover:text-slate-100 whitespace-nowrap`}>정상 작동 중</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header (Mobile) */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 md:hidden bg-surface/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src="/ch4n_logo.png" alt="ch4n logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">ch4n.co.kr</h1>
              <p className="text-xs text-slate-400">DevHub Suite</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="p-2 -mr-2 text-slate-300">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-auto relative w-full h-full bg-background">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
