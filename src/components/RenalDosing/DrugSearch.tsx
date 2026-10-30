import React, { useState, useMemo } from 'react';
import { RENAL_DRUGS } from '../../data/drugs';
import { Search, ArrowLeft, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DrugSearchProps {
  crcl: number;
  onBackToResult: () => void;
  onNewPatient: () => void;
}

const G = 1e9;

export const DrugSearch: React.FC<DrugSearchProps> = ({
  crcl,
  onBackToResult,
  onNewPatient,
}) => {
  const [query, setQuery] = useState('');
  const roundedCrCl = Math.round(crcl * 10) / 10;

  const filteredDrugs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return RENAL_DRUGS;
    }
    return RENAL_DRUGS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.thaiName.toLowerCase().includes(q) ||
        d.drugClass.toLowerCase().includes(q)
    );
  }, [query]);

  // Quick suggestions for convenient clinical lookups
  const popularDrugs = ['Meropenem', 'Piperacillin', 'Cefepime', 'Vancomycin', 'Levofloxacin', 'Colistin', 'Allopurinol'];

  return (
    <div className="max-w-[560px] mx-auto px-4 py-4 space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e6d0da] anim-card">
        {/* Header row with CrCl / eGFR badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-[#8c2955] pl-2.5 border-l-4 border-[#b53a6b]">
            ปรับขนาดยาตามการทำงานของไต
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#fbf0f4] text-[#8c2955] border border-[#e6d0da]">
            CrCl / eGFR = {roundedCrCl.toFixed(1)} mL/min
          </span>
        </div>

        {/* Search input */}
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="พิมพ์ชื่อยา เช่น meropenem, vancomycin, allopurinol..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#e6d0da] focus:outline-none focus:border-[#b53a6b] focus:ring-2 focus:ring-rose-100 text-slate-800 text-sm font-medium shadow-2xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick chip buttons */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[0.72rem] text-slate-400 flex items-center mr-1">
            ยายอดนิยม:
          </span>
          {popularDrugs.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setQuery(d)}
              className="text-[0.72rem] bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-[#b53a6b] px-2 py-0.5 rounded-md transition-colors"
            >
              {d}
            </button>
          ))}
        </div>

        {/* Drug cards list */}
        <div className="space-y-4">
          {filteredDrugs.length === 0 ? (
            <div className="border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
              ไม่พบยาที่ตรงกับ "{query}" — ลองพิมพ์ชื่อสามัญทางยา (Generic name) หรือชื่อภาษาไทย
            </div>
          ) : (
            filteredDrugs.map((drug, dIdx) => {
              const groups = drug.groups || [{ label: '', rules: drug.rules || [] }];

              return (
                <div
                  key={`${drug.name}-${dIdx}`}
                  className="border-2 border-[#e6d0da] rounded-xl p-3.5 bg-white shadow-2xs hover:border-[#b53a6b]/50 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-1 mb-1">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-[0.98rem] leading-tight">
                        {drug.name}
                      </h3>
                      <div className="text-[0.78rem] text-slate-500 mt-0.5">
                        {drug.thaiName} · <span className="italic">{drug.drugClass}</span>
                      </div>
                    </div>
                    {drug.method && (
                      <span className="text-[0.68rem] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full font-mono font-medium">
                        Method: {drug.method}
                      </span>
                    )}
                  </div>

                  {drug.normalDose && (
                    <div className="mt-1.5 mb-2 p-2 rounded-lg bg-slate-50 text-[0.78rem] text-slate-700 border border-slate-100">
                      <span className="font-semibold text-slate-800">ขนาดยาปกติ (Normal dose):</span> {drug.normalDose}
                    </div>
                  )}

                  {/* Groups and dosage bands */}
                  <div className="space-y-2 mt-2">
                    {groups.map((group, gIdx) => {
                      return (
                        <div key={gIdx} className="space-y-1.5">
                          {group.label && (
                            <div className="text-[0.82rem] font-semibold text-[#8c2955] border-b border-dashed border-[#e6d0da] pb-1 mt-2">
                              {group.label}
                            </div>
                          )}

                          {group.rules.map((rule, rIdx) => {
                            const lo = rule[0];
                            const hi = rule[1];
                            const label =
                              rule.length === 4
                                ? rule[2]
                                : hi >= G
                                ? `CrCl ≥ ${lo}`
                                : lo === 0
                                ? `CrCl < ${hi}`
                                : `CrCl ${lo} ถึงน้อยกว่า ${hi}`;
                            const doseText = rule[rule.length - 1];

                            // Matching logic with patient's CrCl
                            const isMatch = roundedCrCl >= lo && roundedCrCl < hi;

                            return (
                              <div
                                key={rIdx}
                                className={`p-2.5 rounded-lg text-[0.86rem] transition-all ${
                                  isMatch
                                    ? 'bg-[#e9f8f1] border-2 border-[#1f9d6b] shadow-xs'
                                    : 'bg-[#faf4f7]/70 border border-transparent text-slate-700'
                                }`}
                              >
                                <div
                                  className={`text-[0.75rem] font-semibold flex items-center gap-1 ${
                                    isMatch ? 'text-[#1f9d6b]' : 'text-slate-500'
                                  }`}
                                >
                                  {isMatch && <CheckCircle2 className="w-3.5 h-3.5 text-[#1f9d6b]" />}
                                  <span>
                                    {isMatch ? '✓ ตรงกับผู้ป่วยรายนี้ — ' : ''}
                                    {label} mL/min
                                  </span>
                                </div>
                                <div className={`mt-0.5 leading-snug ${isMatch ? 'font-medium text-slate-900' : 'text-slate-700'}`}>
                                  {doseText}
                                </div>
                              </div>
                            );
                          })}

                          {/* Dialysis (Hemodialysis / Peritoneal Dialysis) recommendations */}
                          {(group.hd || drug.hd) && (
                            <div className="p-2.5 rounded-lg text-[0.84rem] bg-[#f1ecfb] border border-purple-200">
                              <div className="text-[0.74rem] font-semibold text-purple-900 mb-0.5">
                                ผู้ป่วยฟอกเลือด (Hemodialysis)
                              </div>
                              <div className="text-slate-800 leading-snug">
                                {group.hd || drug.hd}
                              </div>
                            </div>
                          )}

                          {(group.pd || drug.pd) && (
                            <div className="p-2.5 rounded-lg text-[0.84rem] bg-indigo-50/70 border border-indigo-200">
                              <div className="text-[0.74rem] font-semibold text-indigo-900 mb-0.5">
                                ผู้ป่วยล้างไตทางช่องท้อง (Peritoneal Dialysis / CAPD)
                              </div>
                              <div className="text-slate-800 leading-snug">
                                {group.pd || drug.pd}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Clinical note */}
                  {drug.note && (
                    <div className="mt-2.5 p-2 bg-amber-50/70 border border-amber-200 rounded-lg text-[0.78rem] text-amber-900 flex items-start gap-1.5 leading-relaxed">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-none mt-0.5" />
                      <div>
                        <b>ข้อสังเกตทางคลินิก:</b> {drug.note}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackToResult}
            className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับไปดูผล CrCl / eGFR</span>
          </button>
          <button
            type="button"
            onClick={onNewPatient}
            className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ผู้ป่วยรายใหม่</span>
          </button>
        </div>

        <div className="text-[0.72rem] text-slate-400 text-center mt-4 leading-relaxed">
          ข้อมูลใช้เพื่อประกอบการพิจารณาของบุคลากรทางการแพทย์เท่านั้น
          <br />
          ควรตรวจสอบกับเอกสารกำกับยาและพิจารณาอาการทางคลินิกของผู้ป่วยร่วมด้วยเสมอ
        </div>
      </div>
    </div>
  );
};
