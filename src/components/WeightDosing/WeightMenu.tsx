import React from 'react';
import { Mascot } from '../Mascot';
import { ViewState } from '../../types';
import { User, Pill, Shield, Calendar, Activity, ArrowLeft, ChevronRight } from 'lucide-react';

interface WeightMenuProps {
  onSelect: (view: ViewState) => void;
  onBackToMain: () => void;
}

export const WeightMenu: React.FC<WeightMenuProps> = ({ onSelect, onBackToMain }) => {
  return (
    <div className="max-w-[560px] mx-auto px-4 py-4 space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c7e0d2] anim-card">
        {/* Title row */}
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-[#146236]">
              ระบบปรับขนาดยาตามน้ำหนัก
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              เลือกเครื่องมือคำนวณขนาดยา
            </p>
          </div>
          <Mascot mode="sit" size="sm" />
        </div>

        {/* 5 sub-tools */}
        <div className="grid gap-2.5">
          {/* Kids general */}
          <button
            type="button"
            onClick={() => onSelect('weight-kids')}
            className="w-full text-left bg-white hover:bg-emerald-50/50 border-2 border-[#c7e0d2] hover:border-[#1c8a4e] rounded-xl p-3.5 transition-all duration-200 flex items-center gap-3 shadow-2xs hover:shadow-md cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#eaf6ef] text-[#1c8a4e] flex items-center justify-center flex-none group-hover:scale-105 transition-transform">
              <User className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="block text-[0.95rem] font-semibold text-[#146236] group-hover:text-[#1c8a4e] leading-tight">
                คำนวณขนาดยาเด็ก
              </b>
              <small className="text-slate-500 text-[0.78rem] block mt-0.5 leading-snug">
                แก้ปวด/ลดไข้ · NSAIDs · แก้แพ้ · แก้คลื่นไส้ · ละลายเสมหะ/ไอ
              </small>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1c8a4e] group-hover:translate-x-0.5 transition-all flex-none" />
          </button>

          {/* Antibiotics */}
          <button
            type="button"
            onClick={() => onSelect('weight-antibiotics')}
            className="w-full text-left bg-white hover:bg-emerald-50/50 border-2 border-[#c7e0d2] hover:border-[#1c8a4e] rounded-xl p-3.5 transition-all duration-200 flex items-center gap-3 shadow-2xs hover:shadow-md cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#eaf6ef] text-[#1c8a4e] flex items-center justify-center flex-none group-hover:scale-105 transition-transform">
              <Pill className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="block text-[0.95rem] font-semibold text-[#146236] group-hover:text-[#1c8a4e] leading-tight">
                ปรับยา Antibiotics (เด็ก)
              </b>
              <small className="text-slate-500 text-[0.78rem] block mt-0.5 leading-snug">
                Amoxicillin, Augmentin, Cephalexin, Azithromycin ฯลฯ
              </small>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1c8a4e] group-hover:translate-x-0.5 transition-all flex-none" />
          </button>

          {/* Antiviral */}
          <button
            type="button"
            onClick={() => onSelect('weight-antiviral')}
            className="w-full text-left bg-white hover:bg-emerald-50/50 border-2 border-[#c7e0d2] hover:border-[#1c8a4e] rounded-xl p-3.5 transition-all duration-200 flex items-center gap-3 shadow-2xs hover:shadow-md cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#eaf6ef] text-[#1c8a4e] flex items-center justify-center flex-none group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="block text-[0.95rem] font-semibold text-[#146236] group-hover:text-[#1c8a4e] leading-tight">
                ปรับยา Antiviral (เด็ก)
              </b>
              <small className="text-slate-500 text-[0.78rem] block mt-0.5 leading-snug">
                Tamiflu (Oseltamivir), Acyclovir
              </small>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1c8a4e] group-hover:translate-x-0.5 transition-all flex-none" />
          </button>

          {/* Warfarin */}
          <button
            type="button"
            onClick={() => onSelect('weight-warfarin')}
            className="w-full text-left bg-white hover:bg-emerald-50/50 border-2 border-[#c7e0d2] hover:border-[#1c8a4e] rounded-xl p-3.5 transition-all duration-200 flex items-center gap-3 shadow-2xs hover:shadow-md cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#eaf6ef] text-[#1c8a4e] flex items-center justify-center flex-none group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="block text-[0.95rem] font-semibold text-[#146236] group-hover:text-[#1c8a4e] leading-tight">
                ปรับยา Warfarin
              </b>
              <small className="text-slate-500 text-[0.78rem] block mt-0.5 leading-snug">
                คำนวณร้อยละการปรับยา (TWD) และจัดรูปแบบเม็ดยา 1, 3, 5 mg
              </small>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1c8a4e] group-hover:translate-x-0.5 transition-all flex-none" />
          </button>

          {/* TB */}
          <button
            type="button"
            onClick={() => onSelect('weight-tb')}
            className="w-full text-left bg-white hover:bg-emerald-50/50 border-2 border-[#c7e0d2] hover:border-[#1c8a4e] rounded-xl p-3.5 transition-all duration-200 flex items-center gap-3 shadow-2xs hover:shadow-md cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#eaf6ef] text-[#1c8a4e] flex items-center justify-center flex-none group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="block text-[0.95rem] font-semibold text-[#146236] group-hover:text-[#1c8a4e] leading-tight">
                ปรับยา TB
              </b>
              <small className="text-slate-500 text-[0.78rem] block mt-0.5 leading-snug">
                ขนาดยาวัณโรคตามน้ำหนักตัว (I, R, Z, E) และ NAT2 genotype
              </small>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1c8a4e] group-hover:translate-x-0.5 transition-all flex-none" />
          </button>
        </div>

        {/* Back button */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBackToMain}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับเมนูหลัก</span>
          </button>
        </div>
      </div>
    </div>
  );
};
