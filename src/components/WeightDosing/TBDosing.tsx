import React, { useState } from 'react';
import { fmt } from '../../data/weightDosing';
import { ArrowLeft, AlertTriangle, Activity, AlertCircle } from 'lucide-react';

interface TBDosingProps {
  onBack: () => void;
  initialWeight?: number;
}

export const TBDosing: React.FC<TBDosingProps> = ({ onBack, initialWeight = 0 }) => {
  const [weight, setWeight] = useState<string>(initialWeight > 0 ? String(initialWeight) : '');

  const w = parseFloat(weight);
  const ok = w > 0;

  // Active band index for standard 4-drug table
  const bandIdx = !ok ? -1 : w >= 70 ? 2 : w >= 50 ? 1 : w >= 35 ? 0 : -1;
  const STANDARD_TABLE = [
    { label: '35–49 กก.', i: 300, r: 450, z: 1000, e: 800 },
    { label: '50–69 กก.', i: 300, r: 600, z: 1500, e: 1000 },
    { label: '> 70 กก.', i: 300, r: 600, z: 2000, e: 1200 },
  ];

  // mg/kg/day formulas
  const FORMULA_DRUGS = [
    { name: 'Isoniazid (H/I)', range: '4–6 mg/kg/day', min: 4, max: 6 },
    { name: 'Rifampicin (R)', range: '8–12 mg/kg/day', min: 8, max: 12 },
    { name: 'Pyrazinamide (Z)', range: '20–30 mg/kg/day', min: 20, max: 30 },
    { name: 'Ethambutol (E)', range: '15–20 mg/kg/day', min: 15, max: 20 },
  ];

  // NAT2 slow acetylator index
  const slowIdx = !ok ? -1 : w < 35 ? 0 : w <= 70 ? 1 : 2;
  const SLOW_ACETYLATOR_TABLE = [
    { label: '< 35 กก.', dose: '100 mg/day' },
    { label: '35–70 กก.', dose: '150 mg/day' },
    { label: '> 70 กก.', dose: '200 mg/day' },
  ];

  return (
    <div className="max-w-[560px] mx-auto px-4 py-4 space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c7e0d2] anim-card">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-[#146236] pl-2.5 border-l-4 border-[#1c8a4e]">
            ปรับขนาดยาวัณโรค (TB Dosing)
          </h2>
          <span className="text-xs bg-[#eaf6ef] text-[#146236] border border-[#c7e0d2] px-2.5 py-0.5 rounded-full font-medium">
            สูตรมาตรฐาน I, R, Z, E
          </span>
        </div>

        {/* Weight input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            น้ำหนักผู้ป่วย (กก.) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            placeholder="เช่น 49 หรือ 55"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#c7e0d2] focus:outline-none focus:border-[#1c8a4e] focus:ring-2 focus:ring-emerald-100 text-slate-800 text-sm font-medium"
          />
        </div>

        {/* Warnings */}
        {ok && (w < 35 || w > 70) ? (
          <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-1.5 leading-snug">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-none" />
            <span>น้ำหนัก &lt; 35 หรือ &gt; 70 กก. — แนะนำให้คำนวณตามน้ำหนักตัว (ดูตาราง “คำนวณตามน้ำหนักตัว” ด้านล่าง)</span>
          </div>
        ) : (
          <div className="mb-4 text-xs text-slate-500">
            กรณีน้ำหนัก &lt; 35 หรือ &gt; 70 กก. ให้คำนวณตามน้ำหนักตัว
          </div>
        )}

        {/* 1. Standard TB Dosing Table */}
        <div className="border border-[#c7e0d2] rounded-xl p-3.5 bg-white space-y-2 mb-4">
          <h3 className="font-semibold text-xs text-[#146236] uppercase tracking-wider">
            ขนาดยา TB ก่อนเริ่มรักษา (mg/วัน)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse text-center">
              <thead>
                <tr className="bg-[#eaf6ef] text-[#146236]">
                  <th className="p-2 border border-[#c7e0d2] text-left">น้ำหนัก (กก.)</th>
                  <th className="p-2 border border-[#c7e0d2]">I (300)</th>
                  <th className="p-2 border border-[#c7e0d2]">R</th>
                  <th className="p-2 border border-[#c7e0d2]">Z</th>
                  <th className="p-2 border border-[#c7e0d2]">E</th>
                </tr>
              </thead>
              <tbody>
                {STANDARD_TABLE.map((row, idx) => {
                  const isHit = idx === bandIdx;
                  return (
                    <tr
                      key={idx}
                      className={
                        isHit
                          ? 'bg-[#c9efd7] font-bold text-[#146236]'
                          : 'hover:bg-slate-50 text-slate-700'
                      }
                    >
                      <td className="p-2 border border-[#c7e0d2] text-left">
                        {isHit && '✓ '}
                        {row.label}
                      </td>
                      <td className="p-2 border border-[#c7e0d2]">{row.i}</td>
                      <td className="p-2 border border-[#c7e0d2]">{row.r}</td>
                      <td className="p-2 border border-[#c7e0d2]">{row.z}</td>
                      <td className="p-2 border border-[#c7e0d2]">{row.e}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Weight-based mg/kg/day calculation */}
        <div className="border border-[#c7e0d2] rounded-xl p-3.5 bg-white space-y-2 mb-4">
          <h3 className="font-semibold text-xs text-[#146236] uppercase tracking-wider">
            คำนวณตามน้ำหนักตัว (mg/kg/day)
          </h3>
          <div className="space-y-2">
            {FORMULA_DRUGS.map((d, idx) => {
              const resText = ok ? `${fmt(w * d.min)} ถึง ${fmt(w * d.max)}` : '—';
              return (
                <div key={idx} className="space-y-1">
                  <div className="text-[0.8rem] font-semibold text-[#146236] border-b border-dashed border-[#c7e0d2] pb-0.5">
                    {d.name} <span className="font-normal text-slate-500">({d.range})</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-[#eaf6ef] text-xs">
                    <span className="text-slate-700">ขนาดยาที่คำนวณได้</span>
                    <span className="font-bold text-[#146236]">
                      {resText} <span className="font-normal text-slate-500 text-[0.72rem]">mg/day</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. NAT2 genotype Acetylator gene */}
        <div className="border border-[#c7e0d2] rounded-xl p-3.5 bg-white space-y-2 mb-4">
          <h3 className="font-semibold text-xs text-[#146236] uppercase tracking-wider">
            Isoniazid ปรับตามน้ำหนักตัวและชนิด Acetylator gene (NAT2)
          </h3>
          <div className="text-[0.75rem] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
            • Rapid และ Intermediate acetylator ใช้ขนาดยาปกติ
            <br />
            • <b>Slow acetylator</b> ปรับขนาดยาตามเกณฑ์น้ำหนักตัวดังนี้:
          </div>

          <div className="space-y-1.5">
            {SLOW_ACETYLATOR_TABLE.map((row, idx) => {
              const isHit = idx === slowIdx;
              return (
                <div
                  key={idx}
                  className={`flex justify-between items-center p-2 rounded-lg text-xs transition-colors ${
                    isHit
                      ? 'bg-[#c9efd7] border border-[#1c8a4e] font-bold text-[#146236]'
                      : 'bg-[#eaf6ef] text-slate-700'
                  }`}
                >
                  <span>
                    {isHit && '✓ '}
                    {row.label}
                  </span>
                  <span className="font-semibold text-[#146236]">{row.dose}</span>
                </div>
              );
            })}
          </div>

          {/* Liver warning */}
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-1.5 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-none mt-0.5" />
            <div>
              <b>ข้อควรระวังสำคัญ (Hepatotoxicity):</b> Isoniazid / Rifampicin / Pyrazinamide: ถ้าค่า <b>ALT มากกว่า 150 U/L</b> รายงานแพทย์และปรับขนาดยา
            </div>
          </div>
        </div>

        {/* Back and legend */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับเมนูระบบปรับขนาดยาตามน้ำหนัก</span>
          </button>

          <div className="text-[0.72rem] text-slate-400 text-center mt-3">
            I = Isoniazid · R = Rifampicin · Z = Pyrazinamide · E = Ethambutol
          </div>
        </div>
      </div>
    </div>
  );
};
