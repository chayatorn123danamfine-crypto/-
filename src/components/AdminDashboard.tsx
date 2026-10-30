import React, { useState, useEffect } from 'react';
import { UserSessionLog } from '../types';
import { getSystemLogs, clearAllLogs } from '../services/systemLogs';
import {
  Users,
  Clock,
  Activity,
  ArrowLeft,
  Search,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<UserSessionLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshLogs = () => {
    setLogs(getSystemLogs());
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  const handleClear = () => {
    if (window.confirm('คุณต้องการล้างประวัติการใช้งานทั้งหมดหรือไม่?')) {
      clearAllLogs();
      refreshLogs();
    }
  };

  // Filter logs by search query
  const filteredLogs = logs.filter(
    (l) =>
      l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.functionsUsed.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Analytics computations
  const totalUsersSet = new Set(logs.map((l) => l.userName.trim().toLowerCase()));
  const totalUniqueUsers = totalUsersSet.size;
  const totalSessions = logs.length;
  const totalMinutes = logs.reduce((sum, l) => sum + (l.durationMinutes || 1), 0);

  // Compute function frequencies
  const functionFreq: Record<string, number> = {};
  logs.forEach((l) => {
    l.functionsUsed.forEach((fn) => {
      functionFreq[fn] = (functionFreq[fn] || 0) + 1;
    });
  });
  const topFunctions = Object.entries(functionFreq).sort((a, b) => b[1] - a[1]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-[720px] mx-auto px-4 py-6 space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 anim-card">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                การจัดการข้อมูลระบบ (System Audit & Usage)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                รายงานสถิติการเข้าใช้งาน ฟังก์ชั่นที่ใช้ และระยะเวลาการใช้งาน
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่แอพ</span>
          </button>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100">
            <div className="flex items-center justify-between text-purple-700 mb-1">
              <span className="text-xs font-semibold">จำนวนผู้เข้าใช้ทั้งหมด</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-purple-900 font-mono">
              {totalUniqueUsers}{' '}
              <span className="text-xs font-normal text-purple-700">คน</span>
            </div>
            <div className="text-[0.72rem] text-purple-600 mt-0.5">
              รวม {totalSessions} เซสชันการใช้งาน
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
            <div className="flex items-center justify-between text-blue-700 mb-1">
              <span className="text-xs font-semibold">เวลาใช้งานรวม</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-blue-900 font-mono">
              {totalMinutes}{' '}
              <span className="text-xs font-normal text-blue-700">นาที</span>
            </div>
            <div className="text-[0.72rem] text-blue-600 mt-0.5">
              เฉลี่ย ~{totalSessions ? Math.round(totalMinutes / totalSessions) : 0} นาที/ครั้ง
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <div className="flex items-center justify-between text-emerald-700 mb-1">
              <span className="text-xs font-semibold">ฟังก์ชันยอดนิยม</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-emerald-900 truncate mt-1">
              {topFunctions[0]?.[0] || '—'}
            </div>
            <div className="text-[0.72rem] text-emerald-600 mt-0.5">
              ใช้งาน {topFunctions[0]?.[1] || 0} ครั้ง
            </div>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
          <div className="relative flex-1 min-w-[220px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้ใช้ หรือ ฟังก์ชั่น..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshLogs}
              title="รีเฟรชข้อมูล"
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1.5 border border-rose-200 bg-rose-50/50 rounded-xl text-xs text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างประวัติ</span>
            </button>
          </div>
        </div>

        {/* Usage Logs Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">ผู้ใช้งาน</th>
                  <th className="py-2.5 px-3">เวลาเข้าใช้</th>
                  <th className="py-2.5 px-3">ฟังก์ชั่นที่ใช้งาน</th>
                  <th className="py-2.5 px-3 text-right">เวลาใช้งาน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      ไม่พบข้อมูลบันทึกการใช้งาน
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {log.userName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDate(log.loginTime)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {log.functionsUsed && log.functionsUsed.length > 0 ? (
                            log.functionsUsed.map((fn, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-purple-50 text-purple-700 border border-purple-200/60 px-1.5 py-0.5 rounded-md text-[0.7rem] font-medium"
                              >
                                {fn}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[0.7rem]">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-slate-800">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {log.durationMinutes} นาที
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Features Breakdown */}
        {topFunctions.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              สถิติการใช้งานแยกตามฟังก์ชั่น
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topFunctions.map(([fn, count]) => (
                <div
                  key={fn}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className="text-slate-700 truncate pr-2">{fn}</span>
                  <span className="font-bold text-purple-700 font-mono bg-purple-100/60 px-2 py-0.5 rounded-full flex-none">
                    {count} ครั้ง
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
