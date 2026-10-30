import React, { useState } from 'react';
import { WeightBlock, fmt } from '../../data/weightDosing';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';

interface PediatricCalculatorProps {
  title: string;
  blocks: WeightBlock[];
  weight: number;
  onWeightChange: (w: number) => void;
  onBack: () => void;
  placeholder?: string;
  showSearch?: boolean;
}

export const PediatricCalculator: React.FC<PediatricCalculatorProps> = ({
  title,
  blocks,
  weight,
  onWeightChange,
  onBack,
  placeholder = 'ค้นหายา เช่น paracetamol, amoxicillin...',
  showSearch = true,
}) => {
  const [search, setSearch] = useState('');

  const q = search.trim().toLowerCase();
  const hasWeight = weight > 0;

  return (
    <div className="max-w-[560px] mx-auto px-4 py-4 space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c7e0d2] anim-card">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-[#146236] pl-2.5 border-l-4 border-[#1c8a4e]">
            {title}
          </h2>
          {hasWeight && (
            <span className="text-xs bg-[#eaf6ef] text-[#146236] border border-[#c7e0d2] px-2.5 py-0.5 rounded-full font-medium">
              น้ำหนัก {weight} กก.
            </span>
          )}
        </div>

        {/* Weight input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            น้ำหนักเด็ก (กก.) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            placeholder="เช่น 10.5"
            value={isNaN(weight) || weight <= 0 ? '' : weight}
            onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#c7e0d2] focus:outline-none focus:border-[#1c8a4e] focus:ring-2 focus:ring-emerald-100 text-slate-800 text-sm font-medium"
          />
        </div>

        {/* Warning messages */}
        {!hasWeight ? (
          <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-none" />
            <span>กรุณากรอกน้ำหนักเด็กด้านบนเพื่อคำนวณขนาดยาโดยอัตโนมัติ</span>
          </div>
        ) : weight > 40 ? (
          <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-none" />
            <span>น้ำหนักมากกว่า 40 กก. — กรุณาตรวจสอบว่าขนาดยาที่คำนวณได้ไม่เกินขนาดสูงสุดของผู้ใหญ่</span>
          </div>
        ) : null}

        {/* Search input (if enabled) */}
        {showSearch && (
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#c7e0d2] focus:outline-none focus:border-[#1c8a4e] focus:ring-2 focus:ring-emerald-100 text-slate-800 text-sm font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Blocks rendering */}
        <div className="space-y-4">
          {blocks.map((b, bIdx) => {
            // Category header block
            if (b.cat) {
              if (q) return null; // hide category headers when searching
              return (
                <div
                  key={`cat-${bIdx}`}
                  className="bg-[#1c8a4e] text-white font-medium text-[0.88rem] px-3.5 py-1.5 rounded-lg shadow-2xs mt-4"
                >
                  {b.cat}
                </div>
              );
            }

            // Title filter
            if (q && b.t && !b.t.toLowerCase().includes(q)) {
              return null;
            }

            return (
              <div
                key={`blk-${bIdx}`}
                className="border-2 border-[#c7e0d2] rounded-xl p-3.5 bg-white shadow-2xs space-y-2"
              >
                {b.t && (
                  <h3 className="font-semibold text-[#126236] text-[0.92rem] leading-snug border-b border-emerald-100 pb-1.5">
                    {b.t}
                  </h3>
                )}

                {b.rows?.map((r, rIdx) => {
                  // Subheading row
                  if (r.sub) {
                    return (
                      <div
                        key={rIdx}
                        className="text-[0.8rem] font-semibold text-[#146236] border-b border-dashed border-[#c7e0d2] pb-1 pt-1 leading-snug"
                      >
                        {r.sub}
                      </div>
                    );
                  }

                  // Fixed Info row
                  if (r.k && r.v) {
                    return (
                      <div
                        key={rIdx}
                        className="flex justify-between items-baseline gap-2 p-2 rounded-lg bg-[#eaf6ef] text-[0.85rem]"
                      >
                        <div className="text-slate-800 text-xs font-medium">{r.k}</div>
                        <div className="text-[#146236] font-medium text-xs text-right">{r.v}</div>
                      </div>
                    );
                  }

                  // Calculated dose row
                  let resText = '—';
                  let hasCalculated = false;
                  if ((r.fixed || hasWeight) && r.fn) {
                    const res = r.fn(weight);
                    if (Array.isArray(res)) {
                      resText = `${fmt(res[0])} ถึง ${fmt(res[1])}`;
                    } else {
                      resText = fmt(res);
                    }
                    hasCalculated = true;
                  }

                  return (
                    <div
                      key={rIdx}
                      className={`flex justify-between items-baseline gap-2 p-2 rounded-lg text-[0.85rem] transition-colors ${
                        hasCalculated && hasWeight
                          ? 'bg-[#eaf6ef] border border-emerald-200/60'
                          : 'bg-slate-50 border border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {r.form && (
                          <span className="bg-white border border-emerald-200 text-[#146236] font-medium text-[0.7rem] px-2 py-0.5 rounded-full flex-none">
                            {r.form}
                          </span>
                        )}
                        <span className="text-slate-800 text-xs truncate">
                          {r.str}
                        </span>
                      </div>
                      <div className="text-right flex-none font-bold text-[#146236] text-xs">
                        {resText} <span className="font-normal text-slate-500 text-[0.72rem]">{r.unit}</span>
                      </div>
                    </div>
                  );
                })}

                {b.note && (
                  <div className="text-[0.74rem] text-amber-700 bg-amber-50/60 border border-amber-100 p-2 rounded-lg mt-1.5 leading-relaxed">
                    {b.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Back and disclaimer */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับเมนูระบบปรับขนาดยาตามน้ำหนัก</span>
          </button>

          <div className="text-[0.72rem] text-slate-400 text-center mt-3 leading-relaxed">
            ผลการคำนวณเป็นค่าประมาณ ควรปัดขนาดยาให้เหมาะกับรูปแบบยา และตรวจสอบขนาดสูงสุดต่อครั้ง/ต่อวันก่อนใช้จริง
          </div>
        </div>
      </div>
    </div>
  );
};
