import React, { useState, useEffect } from 'react';
import { Shield, Users, Globe, Activity, RefreshCw } from 'lucide-react';
import { getApiUrl } from '../config/api';

interface Visitor {
  id: string;
  ip: string;
  city: string;
  country: string;
  browser: string;
  os: string;
  timestamp: string;
  connectionType?: string; // 기존 데이터 호환성
  batteryLevel?: string; // 배터리 잔량 (예: "85%")
}

const Admin: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [stats, setStats] = useState({ total: 0, active: 0, today: 0 });


  // 방문자 목록 새로고침
  const refreshVisitors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${getApiUrl('GET_VISITORS')}?limit=100`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setVisitors(data.visitors);
          setStats(data.stats);
        }
      } else {
        // API 실패시 로컬 스토리지 폴백
        const stored = localStorage.getItem('admin_visitors');
        if (stored) {
          setVisitors(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Failed to refresh visitors:', error);
      // API 실패시 로컬 스토리지 폴백
      const stored = localStorage.getItem('admin_visitors');
      if (stored) {
        setVisitors(JSON.parse(stored));
      }
    } finally {
      setIsLoading(false);
      setLastUpdate(new Date());
    }
  };

  useEffect(() => {
    // Admin 페이지는 자기 자신을 기록하지 않음
    // PHP API에서 방문자 데이터 가져오기
    const loadVisitors = async () => {
      try {
        const response = await fetch(`${getApiUrl('GET_VISITORS')}?limit=100`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setVisitors(data.visitors);
            setStats(data.stats);
          }
        } else {
          // API 실패시 로컬 스토리지 폴백
          const stored = localStorage.getItem('admin_visitors');
          if (stored) {
            setVisitors(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.error('Failed to fetch visitors:', error);
        // API 실패시 로컬 스토리지 폴백
        const stored = localStorage.getItem('admin_visitors');
        if (stored) {
          setVisitors(JSON.parse(stored));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadVisitors();

    // 주기적으로 API 데이터 갱신
    const interval = setInterval(() => {
      loadVisitors();
      setLastUpdate(new Date());
    }, 10000); // 10초마다 API 데이터 갱신

    return () => clearInterval(interval);
  }, []);

  const getTimeDiff = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };

  const activeVisitors = visitors.filter(v => {
    const diff = Date.now() - new Date(v.timestamp).getTime();
    return diff < 600000; // 10분 이내
  });

  return (
    <div className="min-h-screen overflow-y-auto p-4 md:p-8 bg-[#0f172a] text-slate-200">
      <div className="max-w-7xl mx-auto space-y-6 pb-20">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-primary" size={32} />
            <h1 className="text-3xl font-bold text-white">관리자 대시보드</h1>
          </div>
          <p className="text-slate-400">실시간 접속자 정보 및 방문 기록</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-slate-700/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Users size={18} />
              <span className="text-sm font-medium">현재 접속자</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.active || activeVisitors.length}</div>
            <div className="text-xs text-slate-500 mt-1">최근 10분 이내</div>
          </div>

          <div className="bg-surface border border-slate-700/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Globe size={18} />
              <span className="text-sm font-medium">총 방문자</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.total || visitors.length}</div>
            <div className="text-xs text-slate-500 mt-1">전체 기록</div>
          </div>

          <div className="bg-surface border border-slate-700/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Activity size={18} />
              <span className="text-sm font-medium">마지막 업데이트</span>
            </div>
            <div className="text-lg font-bold text-white">
              {lastUpdate.toLocaleTimeString('ko-KR')}
            </div>
            <button
              onClick={refreshVisitors}
              className="text-xs text-primary hover:text-primary/80 mt-1 flex items-center gap-1"
            >
              <RefreshCw size={12} />
              새로고침
            </button>
          </div>
        </div>

        {/* Visitors Table */}
        <div className="bg-surface border border-slate-700/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-700/50">
            <h2 className="text-lg md:text-xl font-bold text-white">접속자 목록</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              로딩 중...
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full min-w-[600px]">
                <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase sticky top-0">
                  <tr>
                    <th className="px-3 md:px-6 py-3 text-left whitespace-nowrap">상태</th>
                    <th className="px-3 md:px-6 py-3 text-left whitespace-nowrap">IP 주소</th>
                    <th className="px-3 md:px-6 py-3 text-left whitespace-nowrap">위치</th>
                    <th className="px-3 md:px-6 py-3 text-left whitespace-nowrap">브라우저</th>
                    <th className="px-3 md:px-6 py-3 text-left whitespace-nowrap">OS</th>
                    <th className="px-3 md:px-6 py-3 text-left whitespace-nowrap">배터리</th>
                    <th className="px-3 md:px-6 py-3 text-left whitespace-nowrap">접속 시간</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {visitors.map((visitor) => {
                    const isActive = Date.now() - new Date(visitor.timestamp).getTime() < 600000;
                    return (
                      <tr key={visitor.id} className="hover:bg-slate-800/30">
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <span className={`inline-flex h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 font-mono text-xs md:text-sm whitespace-nowrap">{visitor.ip}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm">
                          <div className="whitespace-nowrap">{visitor.city}</div>
                          <div className="text-xs text-slate-500 whitespace-nowrap">{visitor.country}</div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm whitespace-nowrap">{visitor.browser}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm whitespace-nowrap">{visitor.os}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm whitespace-nowrap">{visitor.batteryLevel || visitor.connectionType || '-'}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-400 whitespace-nowrap">
                          {getTimeDiff(visitor.timestamp)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {visitors.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  아직 방문 기록이 없습니다
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 py-4">
          * 방문자 정보는 브라우저 로컬 스토리지에 저장되며, 최대 100명까지 기록됩니다
        </div>
      </div>
    </div>
  );
};

export default Admin;