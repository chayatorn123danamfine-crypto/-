import React, { useState } from 'react';
import { SUKHOTHAI_HOSPITAL_LOGO } from '../assets/logo';
import { Mascot } from './Mascot';
import { User, ArrowRight, ShieldCheck, KeyRound, X } from 'lucide-react';

interface LoginScreenProps {
  onSuccess: (userName: string) => void;
  onOpenAdmin: () => void;
}

const ADMIN_PASSWORD = 'ihabatdan67';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess, onOpenAdmin }) => {
  const [userName, setUserName] = useState('');
  const [userError, setUserError] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = userName.trim();
    if (!finalName) {
      setUserError('กรุณากรอกชื่อผู้ใช้งานก่อนเริ่มต้นใช้งาน');
      return;
    }
    setUserError('');
    onSuccess(finalName);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword.trim() === ADMIN_PASSWORD) {
      setAdminError('');
      setShowAdminModal(false);
      setAdminPassword('');
      onOpenAdmin();
    } else {
      setAdminError('รหัสผ่านจัดการระบบไม่ถูกต้อง');
    }
  };

  return (
    <div className="relative mt-16 max-w-[500px] mx-auto px-4">
      {/* Peeking Mascot behind card - Left Eye is interactive */}
      <div className="absolute -top-[64px] right-8 z-10 w-[84px] h-[68px] overflow-hidden anim-peek">
        <Mascot
          mode="peek"
          size="md"
          onLeftEyeClick={() => {
            setAdminError('');
            setAdminPassword('');
            setShowAdminModal(true);
          }}
        />
      </div>

      <div className="relative bg-white rounded-2xl p-7 shadow-xl border border-[#e6d0da] text-center anim-card">
        {/* Hospital Logo */}
        <div className="inline-flex items-center justify-center p-2.5 bg-white rounded-2xl mb-3 shadow-xs border border-slate-100 transition-transform hover:scale-105 duration-300">
          <img
            src={SUKHOTHAI_HOSPITAL_LOGO}
            alt="ตราสัญลักษณ์โรงพยาบาลสุโขทัย"
            className="w-32 h-32 object-contain mx-auto"
          />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#8c2955] mb-1">
          ระบบปรับขนาดยา
        </h1>
        <p className="text-slate-500 text-xs mb-5">
          โรงพยาบาลสุโขทัย · สำหรับบุคลากรทางการแพทย์
        </p>

        {/* Username form */}
        <form onSubmit={handleStart} className="space-y-3.5 max-w-xs mx-auto">
          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              ชื่อผู้ใช้งาน (User Name) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (userError) setUserError('');
                }}
                placeholder="เช่น ภญ. สมหญิง, นพ. ประจำเวร"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e6d0da] text-slate-800 text-sm font-medium focus:outline-none focus:border-[#b53a6b] focus:ring-2 focus:ring-rose-100 transition-all shadow-2xs"
              />
            </div>
            {userError && (
              <div className="text-rose-600 text-[0.78rem] mt-1.5 font-medium">
                {userError}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#b53a6b] hover:bg-[#8c2955] active:scale-[0.99] text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>เริ่มต้นใช้งาน</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>ระบบสารสนเทศทางคลินิก กลุ่มงานเภสัชกรรม</span>
        </div>
      </div>

      {/* Admin Password Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 anim-card">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>

            <h2 className="text-base font-bold text-slate-900 text-center mb-1">
              การจัดการข้อมูลระบบ
            </h2>
            <p className="text-xs text-slate-500 text-center mb-4">
              กรุณาใส่รหัสผ่านผู้ดูแลระบบเพื่อดูรายงานการใช้งาน
            </p>

            <form onSubmit={handleAdminSubmit} className="space-y-3">
              <input
                type="password"
                placeholder="รหัสผ่านผู้ดูแลระบบ"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  if (adminError) setAdminError('');
                }}
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-center font-mono tracking-wider text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              />

              {adminError && (
                <div className="text-rose-600 text-xs bg-rose-50 border border-rose-200 rounded-lg p-2 text-center">
                  {adminError}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs"
                >
                  เข้าสู่ระบบจัดการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
