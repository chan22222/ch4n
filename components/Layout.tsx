import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
          fixed md:relative z-30 w-64 h-full bg-surface border-r border-slate-700/50
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
              C
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">ch4n.co.kr</h1>
              <p className="text-xs text-slate-400">DevHub Suite</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="px-4 py-2 space-y-1 flex-1 overflow-y-auto">
          <NavLink
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${location.pathname === '/'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }
            `}
          >
            <LayoutDashboard size={18} className={location.pathname === '/' ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} />
            <span className="font-medium text-sm">대시보드</span>
            {location.pathname === '/' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
          </NavLink>
        </nav>

        <div className="p-6 shrink-0">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2 font-medium">서비스 상태</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-slate-200">정상 작동 중</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header (Mobile) */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 md:hidden bg-surface/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
              C
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
