import React from 'react';
import { Mascot } from './Mascot';
import { Droplet, Scale, ChevronRight } from 'lucide-react';
import { ViewState } from '../types';

interface MainMenuProps {
  onSelect: (view: ViewState) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelect }) => {
  return (
    <div className="max-w-[560px] mx-auto px-4 py-4 space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e6d0da] anim-card">
        {/* Mascot greeting row */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
          <Mascot mode="wave" size="sm" />
          <div className="relative bg-[#fbf0f4] border border-[#e6d0da] text-[#8c2955] rounded-xl px-3.5 py-2.5 text-sm font-medium anim-bubble shadow-2xs">
            {/* Bubble arrow */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#fbf0f4] border-l border-b border-[#e6d0da] -rotate-45" />
            สวัสดีค่ะ เลือกระบบที่ต้องการใช้งานได้เลยค่ะ
          </div>
        </div>

        <h2 className="text-base font-semibold text-[#8c2955] pl-2.5 border-l-4 border-[#b53a6b] mb-4">
          เลือกระบบที่ต้องการใช้งาน
        </h2>

        <div className="grid gap-3">
          {/* Button 1: Renal Dosing */}
          <button
            type="button"
            onClick={() => onSelect('renal-input')}
            className="w-full text-left bg-white hover:bg-rose-50/50 border-2 border-[#e6d0da] hover:border-[#b53a6b] rounded-2xl p-4 transition-all duration-200 flex items-center gap-3.5 shadow-2xs hover:shadow-md cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#fbeff4] text-[#b53a6b] flex items-center justify-center flex-none group-hover:scale-105 transition-transform">
              <Droplet className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="block text-[0.98rem] font-semibold text-[#8c2955] group-hover:text-[#b53a6b] transition-colors leading-tight">
                ระบบปรับขนาดยาตามค่าการทำงานของไต
              </b>
              <small className="text-slate-500 text-[0.82rem] block mt-1 leading-snug">
                คำนวณค่า CrCl (Cockcroft-Gault) และปรับขนาดยาต้านจุลชีพตามการทำงานของไต
              </small>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#b53a6b] group-hover:translate-x-1 transition-all flex-none" />
          </button>

          {/* Button 2: Weight Dosing */}
          <button
            type="button"
            onClick={() => onSelect('weight-menu')}
            className="w-full text-left bg-white hover:bg-emerald-50/50 border-2 border-[#c7e0d2] hover:border-[#1c8a4e] rounded-2xl p-4 transition-all duration-200 flex items-center gap-3.5 shadow-2xs hover:shadow-md cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#eaf6ef] text-[#1c8a4e] flex items-center justify-center flex-none group-hover:scale-105 transition-transform">
              <Scale className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="block text-[0.98rem] font-semibold text-[#146236] group-hover:text-[#1c8a4e] transition-colors leading-tight">
                ระบบปรับขนาดยาตามน้ำหนัก
              </b>
              <small className="text-slate-500 text-[0.82rem] block mt-1 leading-snug">
                ยาเด็ก · Antibiotics · Antiviral · ปรับยา Warfarin · ปรับยา TB
              </small>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1c8a4e] group-hover:translate-x-1 transition-all flex-none" />
          </button>
        </div>
      </div>
    </div>
  );
};
