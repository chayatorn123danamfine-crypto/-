import React from 'react';
import { RenalFormula } from '../../types';
import { Calculator, Activity, ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Mascot } from '../Mascot';

interface FormulaSelectProps {
  onSelectFormula: (formula: RenalFormula) => void;
  onBack: () => void;
}

export const FormulaSelect: React.FC<FormulaSelectProps> = ({ onSelectFormula, onBack }) => {
  return (
    <div className="max-w-[560px] mx-auto px-4 py-4 space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e6d0da] anim-card">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-[#8c2955] pl-2.5 border-l-4 border-[#b53a6b]">
              เลือกสูตรคำนวณการทำงานของไต
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              โปรดเลือกสมการที่ต้องการใช้ประเมินการทำงานของไต
            </p>
          </div>
          <Mascot mode="sit" size="sm" />
        </div>

        <div className="grid gap-3.5">
          {/* Option 1: Cockcroft-Gault */}
          <button
            type="button"
            onClick={() => onSelectFormula('cg')}
            className="w-full text-left bg-white hover:bg-rose-50/40 border-2 border-[#e6d0da] hover:border-[#b53a6b] rounded-2xl p-4 transition-all duration-200 flex items-center gap-3.5 shadow-2xs hover:shadow-md cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#fbf0f4] text-[#b53a6b] flex items-center justify-center flex-none group-hover:scale-105 transition-transform">
              <Calculator className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <b className="text-[0.98rem] font-semibold text-[#8c2955] group-hover:text-[#b53a6b] transition-colors leading-tight">
                  Cockcroft-Gault (C-G equation)
                </b>
                <span className="text-[0.68rem] font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                  CrCl
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-1 leading-snug">
                คำนวณ Creatinine Clearance (CrCl) ในหน่วย <b>mL/min</b> ใช้ประเมินขนาดยาส่วนใหญ่ในเอกสารกำกับยา
              </p>
              <div className="mt-1.5 text-[0.72rem] text-slate-400 font-mono">
                ข้อมูลที่ใช้: เพศ, อายุ, น้ำหนักตัว (BW), Serum Creatinine
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#b53a6b] group-hover:translate-x-1 transition-all flex-none" />
          </button>

          {/* Option 2: CKD-EPI */}
          <button
            type="button"
            onClick={() => onSelectFormula('ckdepi')}
            className="w-full text-left bg-white hover:bg-indigo-50/40 border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-4 transition-all duration-200 flex items-center gap-3.5 shadow-2xs hover:shadow-md cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-none group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <b className="text-[0.98rem] font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight">
                  CKD-EPI (Chronic Kidney Disease Epidemiology Collaboration)
                </b>
                <span className="text-[0.68rem] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  eGFR
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-1 leading-snug">
                คำนวณ Estimated GFR (eGFR) ในหน่วย <b>mL/min/1.73 m²</b> ค่ามาตรฐานสากลในการจำแนกระยะโรคไตเรื้อรัง (KDIGO)
              </p>
              <div className="mt-1.5 text-[0.72rem] text-slate-400 font-mono">
                ข้อมูลที่ใช้: เพศ, อายุ, Serum Creatinine (ไม่ต้องใช้น้ำหนัก)
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-none" />
          </button>
        </div>

        {/* Info card */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
          <BookOpen className="w-4 h-4 text-slate-500 flex-none mt-0.5" />
          <div>
            <b>แนวทางการเลือก:</b> ยาต้านจุลชีพและเอกสารกำกับยาส่วนใหญ่แนะนำให้ใช้ค่า <b>CrCl (Cockcroft-Gault)</b> ในการปรับขนาดยา ในขณะที่ <b>CKD-EPI (eGFR)</b> ใช้ในการวินิจฉัยและจำแนกระยะโรคไตเรื้อรัง (CKD Staging)
          </div>
        </div>

        {/* Back button */}
        <div className="pt-3 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
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
