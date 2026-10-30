import React from 'react';
import { SUKHOTHAI_HOSPITAL_LOGO } from '../assets/logo';
import { ViewState } from '../types';
import { Home, LogOut, Shield } from 'lucide-react';

interface HeaderBarProps {
  currentView: ViewState;
  onLogout: () => void;
  onNavigateHome: () => void;
  currentUser?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentView,
  onLogout,
  onNavigateHome,
  currentUser,
}) => {
  if (currentView === 'login') return null;

  const isAdmin = currentView === 'admin';
  const isWeightSystem = currentView.startsWith('weight-');
  
  const title = isAdmin
    ? 'การจัดการข้อมูลระบบ'
    : currentView === 'menu'
    ? 'ระบบปรับขนาดยา'
    : isWeightSystem
    ? 'ระบบปรับขนาดยาตามน้ำหนัก'
    : currentView === 'renal-formula-select'
    ? 'เลือกสูตรคำนวณการทำงานของไต'
    : 'ระบบปรับขนาดยาตามค่าการทำงานของไต';

  const pinkColor = isAdmin ? '#7e22ce' : isWeightSystem ? '#1c8a4e' : '#b53a6b';
  const pinkDark = isAdmin ? '#581c87' : isWeightSystem ? '#126236' : '#8c2955';

  return (
    <header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-xs border-b-3 transition-colors duration-200"
      style={{ borderBottomColor: pinkColor }}
    >
      <div className="max-w-[580px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-3 cursor-pointer group select-none min-w-0"
          onClick={onNavigateHome}
          title="กลับเมนูหลัก"
        >
          <img
            src={SUKHOTHAI_HOSPITAL_LOGO}
            alt="ตราสัญลักษณ์โรงพยาบาลสุโขทัย"
            className="w-11 h-11 object-contain flex-none rounded-full shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0">
            <div
              className="font-semibold text-[0.95rem] leading-tight truncate"
              style={{ color: pinkDark }}
            >
              {title}
            </div>
            <div className="text-[0.72rem] text-slate-500 truncate flex items-center gap-1.5">
              <span>โรงพยาบาลสุโขทัย</span>
              {currentUser && (
                <>
                  <span>•</span>
                  <span className="font-medium text-slate-700">{currentUser}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-none">
          {currentView !== 'menu' && !isAdmin && (
            <button
              type="button"
              onClick={onNavigateHome}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="เมนูหลัก"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1.5 text-[0.78rem] font-medium text-slate-600 rounded-lg hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--bd)',
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
