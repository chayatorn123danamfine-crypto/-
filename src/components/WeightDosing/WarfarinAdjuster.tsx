import React, { useState, useMemo } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface WarfarinAdjusterProps {
  onBack: () => void;
}

interface TabletDef {
  key: 'p' | 'b' | 'w';
  name: string;
  mg: number;
  colorClass: string;
  bgBadge: string;
}

const TABLETS: TabletDef[] = [
  { key: 'p', name: 'สีชมพู', mg: 5, colorClass: 'bg-[#f59bbd] border-pink-400', bgBadge: 'bg-pink-100 text-pink-800 border-pink-200' },
  { key: 'b', name: 'สีฟ้า', mg: 3, colorClass: 'bg-[#6bb7f2] border-blue-400', bgBadge: 'bg-blue-100 text-blue-800 border-blue-200' },
  { key: 'w', name: 'สีขาว', mg: 1, colorClass: 'bg-white border-slate-400', bgBadge: 'bg-slate-100 text-slate-800 border-slate-300' },
];

const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
const DAYS_SHORT = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];
const COUNT_OPTIONS = [0.5, 1, 1.5, 2, 3, 4];

interface DayPills {
  p: number;
  b: number;
  w: number;
}

const fracTxt = (x: number) => {
  const whole = Math.floor(x);
  const half = x % 1 !== 0;
  if (whole && half) return `${whole}½`;
  if (half) return '½';
  return String(whole);
};

const tabTxt = (x: number) => {
  if (x === 0.5) return 'ครึ่งเม็ด';
  if (x % 1 !== 0) return `${Math.floor(x)} เม็ดครึ่ง`;
  return `${x} เม็ด`;
};

const mgFmt = (x: number) => String(Math.round(x * 10) / 10);

function tabCombos(v: number, half: boolean): DayPills[] {
  const out: DayPills[] = [];
  const H = half ? 1 : 0;
  for (let nP = 0; nP * 10 <= v; nP++) {
    for (let hP = 0; hP <= H; hP++) {
      const r1 = v - nP * 10 - hP * 5;
      if (r1 < 0) continue;
      for (let nB = 0; nB * 6 <= r1; nB++) {
        for (let hB = 0; hB <= H; hB++) {
          const r2 = r1 - nB * 6 - hB * 3;
          if (r2 < 0) continue;
          let nW = 0;
          let hW = 0;
          if (r2 % 2 === 0) {
            nW = r2 / 2;
          } else {
            if (!half) continue;
            nW = (r2 - 1) / 2;
            hW = 1;
          }
          out.push({
            p: nP + hP / 2,
            b: nB + hB / 2,
            w: nW + hW / 2,
          });
        }
      }
    }
  }
  return out;
}

const pieces = (c: DayPills) => Math.ceil(c.p) + Math.ceil(c.b) + Math.ceil(c.w);
const splits = (c: DayPills) => (c.p % 1 ? 1 : 0) + (c.b % 1 ? 1 : 0) + (c.w % 1 ? 1 : 0);

function planRegimen(T: number, curColors: Set<string> | null) {
  const isHalf = Math.abs(T - Math.round(T)) > 1e-9;
  const step = isHalf ? 1 : 2;
  const D = Math.round(T * 2) / step;
  const q = Math.floor(D / 7);
  const r = D % 7;
  const lowU = q * step;
  const highU = (q + 1) * step;

  const lows = tabCombos(lowU, isHalf);
  const highs = r > 0 ? tabCombos(highU, isHalf) : [null];

  let best: { lo: DayPills; hi: DayPills | null } | null = null;
  let bestKey: number[] | null = null;

  for (const lo of lows) {
    for (const hi of highs) {
      const nl = 7 - r;
      const nh = r;
      const wk = {
        p: lo.p * nl + (hi ? hi.p * nh : 0),
        b: lo.b * nl + (hi ? hi.b * nh : 0),
        w: lo.w * nl + (hi ? hi.w * nh : 0),
      };
      const used = TABLETS.filter((t) => wk[t.key] > 0);
      const key = [
        nl * splits(lo) + (hi ? nh * splits(hi) : 0),
        nl * pieces(lo) + (hi ? nh * pieces(hi) : 0),
        used.length,
        curColors ? used.filter((t) => !curColors.has(t.key)).length : 0,
        wk.w,
        wk.b,
      ];

      let better = !best;
      if (best && bestKey) {
        for (let i = 0; i < key.length; i++) {
          if (key[i] !== bestKey[i]) {
            better = key[i] < bestKey[i];
            break;
          }
        }
      }

      if (better) {
        best = { lo, hi };
        bestKey = key;
      }
    }
  }

  // Distribute high dose days evenly
  const highDays = new Set<number>();
  for (let i = 0; i < r; i++) {
    highDays.add(Math.floor((i * 7) / r));
  }

  const sched: DayPills[] = [];
  for (let d = 0; d < 7; d++) {
    sched.push(highDays.has(d) && best?.hi ? best.hi : best ? best.lo : { p: 0, b: 0, w: 0 });
  }

  return { sched, isHalf };
}

const comboMg = (c: DayPills) => c.p * 5 + c.b * 3 + c.w * 1;
const comboKey = (c: DayPills) => `${c.p}/${c.b}/${c.w}`;

function comboTxt(c: DayPills): string {
  const parts: string[] = [];
  if (c.p > 0) parts.push(`เม็ดสีชมพู (5mg) ${tabTxt(c.p)}`);
  if (c.b > 0) parts.push(`เม็ดสีฟ้า (3mg) ${tabTxt(c.b)}`);
  if (c.w > 0) parts.push(`เม็ดสีขาว (1mg) ${tabTxt(c.w)}`);
  return parts.length ? parts.join(' + ') : 'งดยา';
}

export const WarfarinAdjuster: React.FC<WarfarinAdjusterProps> = ({ onBack }) => {
  // Current regimen state per tablet key
  const [tabConfig, setTabConfig] = useState({
    p: { n: 1, d: Array(7).fill(false) },
    b: { n: 1, d: Array(7).fill(false) },
    w: { n: 1, d: Array(7).fill(false) },
  });

  const [origDoseManual, setOrigDoseManual] = useState<string>('');
  const [newDoseInput, setNewDoseInput] = useState<string>('');
  const [isAutoOrig, setIsAutoOrig] = useState(false);

  // Compute current daily and weekly mg from selected grid
  const getDayDose = (dayIdx: number): DayPills => ({
    p: tabConfig.p.d[dayIdx] ? tabConfig.p.n : 0,
    b: tabConfig.b.d[dayIdx] ? tabConfig.b.n : 0,
    w: tabConfig.w.d[dayIdx] ? tabConfig.w.n : 0,
  });

  const calculatedCurrentWeekMg = useMemo(() => {
    let s = 0;
    for (let i = 0; i < 7; i++) {
      s += comboMg(getDayDose(i));
    }
    return s;
  }, [tabConfig]);

  // Sync with input
  const currentWeeklyDose = isAutoOrig || !origDoseManual
    ? calculatedCurrentWeekMg
    : parseFloat(origDoseManual) || 0;

  const handleDayToggle = (k: 'p' | 'b' | 'w', dayIdx: number) => {
    setTabConfig((prev) => {
      const copy = { ...prev };
      const newDays = [...copy[k].d];
      newDays[dayIdx] = !newDays[dayIdx];
      copy[k] = { ...copy[k], d: newDays };

      // calculate new weekly
      let s = 0;
      for (let i = 0; i < 7; i++) {
        const dp = {
          p: copy.p.d[i] ? copy.p.n : 0,
          b: copy.b.d[i] ? copy.b.n : 0,
          w: copy.w.d[i] ? copy.w.n : 0,
        };
        s += comboMg(dp);
      }
      if (s > 0) {
        setOrigDoseManual(mgFmt(s));
        setIsAutoOrig(true);
      } else {
        setOrigDoseManual('');
        setIsAutoOrig(false);
      }
      return copy;
    });
  };

  const handleAllToggle = (k: 'p' | 'b' | 'w') => {
    setTabConfig((prev) => {
      const copy = { ...prev };
      const allActive = copy[k].d.every(Boolean);
      copy[k] = { ...copy[k], d: Array(7).fill(!allActive) };

      let s = 0;
      for (let i = 0; i < 7; i++) {
        const dp = {
          p: copy.p.d[i] ? copy.p.n : 0,
          b: copy.b.d[i] ? copy.b.n : 0,
          w: copy.w.d[i] ? copy.w.n : 0,
        };
        s += comboMg(dp);
      }
      if (s > 0) {
        setOrigDoseManual(mgFmt(s));
        setIsAutoOrig(true);
      } else {
        setOrigDoseManual('');
        setIsAutoOrig(false);
      }
      return copy;
    });
  };

  const handleCountChange = (k: 'p' | 'b' | 'w', val: number) => {
    setTabConfig((prev) => {
      const copy = { ...prev, [k]: { ...prev[k], n: val } };
      let s = 0;
      for (let i = 0; i < 7; i++) {
        const dp = {
          p: copy.p.d[i] ? copy.p.n : 0,
          b: copy.b.d[i] ? copy.b.n : 0,
          w: copy.w.d[i] ? copy.w.n : 0,
        };
        s += comboMg(dp);
      }
      if (s > 0) {
        setOrigDoseManual(mgFmt(s));
        setIsAutoOrig(true);
      }
      return copy;
    });
  };

  // Percentage difference calculation
  const newDose = parseFloat(newDoseInput);
  const hasValidInputs = currentWeeklyDose > 0 && !isNaN(newDose) && newDose >= 0;

  let percentChange = 0;
  let isIncrease = false;
  let diffMg = 0;
  let percentWarning = false;

  if (hasValidInputs) {
    diffMg = newDose - currentWeeklyDose;
    percentChange = (diffMg / currentWeeklyDose) * 100;
    isIncrease = percentChange > 0;
    percentWarning = Math.abs(percentChange) > 20;
  }

  // Recommended Regimen Schedule
  const planned = useMemo(() => {
    if (isNaN(newDose) || newDose <= 0) return null;
    if (Math.abs(newDose * 2 - Math.round(newDose * 2)) > 1e-9) return null;
    if (newDose > 140) return null;

    const curColors =
      calculatedCurrentWeekMg > 0
        ? new Set(TABLETS.filter((t) => tabConfig[t.key].d.some(Boolean)).map((t) => t.key))
        : null;

    return planRegimen(newDose, curColors);
  }, [newDose, calculatedCurrentWeekMg, tabConfig]);

  // Text instructions grouping days
  const instructionLines = useMemo(() => {
    if (!planned) return [];
    const groups = new Map<string, { c: DayPills; days: number[] }>();
    planned.sched.forEach((c, i) => {
      const k = comboKey(c);
      if (!groups.has(k)) groups.set(k, { c, days: [] });
      groups.get(k)!.days.push(i);
    });

    const arr = Array.from(groups.values()).sort((a, b) => b.days.length - a.days.length);
    if (arr.length === 1) {
      return [`${comboTxt(arr[0].c)} (วันละ ${mgFmt(comboMg(arr[0].c))} mg) ทุกวัน`];
    }

    return arr
      .slice()
      .reverse()
      .map((g, idx, a) => {
        const when =
          idx === a.length - 1
            ? 'วันที่เหลือ'
            : 'วัน' + g.days.map((i) => DAYS[i]).join(', วัน');
        return `${when}: ${comboTxt(g.c)} (วันละ ${mgFmt(comboMg(g.c))} mg)`;
      });
  }, [planned]);

  return (
    <div className="max-w-[560px] mx-auto px-4 py-4 space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c7e0d2] anim-card">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-[#146236] pl-2.5 border-l-4 border-[#1c8a4e]">
            ปรับยา Warfarin (Total Weekly Dose)
          </h2>
        </div>

        {/* Color Legend */}
        <div className="flex flex-wrap gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-4">
          {TABLETS.map((t) => (
            <span key={t.key} className="inline-flex items-center gap-1.5 font-medium">
              <span className={`w-3.5 h-3.5 rounded-full border shadow-2xs ${t.colorClass}`} />
              <span>
                เม็ด{t.name} <b>{t.mg} mg</b>
              </span>
            </span>
          ))}
        </div>

        {/* Section 1: Previous Regimen */}
        <div className="border border-[#c7e0d2] rounded-xl p-3.5 bg-[#fbfcfc] space-y-3">
          <h3 className="font-semibold text-[0.92rem] text-[#146236]">
            1. ขนาดยาเดิมที่ผู้ป่วยรับประทาน
          </h3>
          <p className="text-xs text-slate-500 leading-snug">
            ติ๊กเลือกวันที่รับประทานของเม็ดยาแต่ละสี (ไม่บังคับ) ระบบจะรวมเป็น mg/สัปดาห์ให้อัตโนมัติ หรือกรอกตัวเลขโดยตรง
          </p>

          {/* Tablets grid */}
          <div className="space-y-3">
            {TABLETS.map((t) => {
              const cfg = tabConfig[t.key];
              return (
                <div key={t.key} className="p-2.5 bg-white border border-[#c7e0d2] rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3 h-3 rounded-full border ${t.colorClass}`} />
                      <b className="text-slate-800">เม็ด{t.name} ({t.mg} mg)</b>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <select
                        aria-label={`จำนวนเม็ดต่อวัน ${t.name}`}
                        value={cfg.n}
                        onChange={(e) => handleCountChange(t.key, parseFloat(e.target.value))}
                        className="py-1 px-2 border border-slate-200 rounded-md text-xs bg-slate-50 focus:outline-none focus:border-emerald-500"
                      >
                        {COUNT_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {tabTxt(c)}/วัน
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleAllToggle(t.key)}
                        className="text-[0.72rem] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-2 py-1 rounded-md border border-slate-200 transition-colors"
                      >
                        {cfg.d.every(Boolean) ? 'ล้าง' : 'ทุกวัน'}
                      </button>
                    </div>
                  </div>

                  {/* 7 Days buttons */}
                  <div className="grid grid-cols-7 gap-1 mt-2">
                    {DAYS_SHORT.map((dayLabel, dIdx) => {
                      const isChecked = cfg.d[dIdx];
                      return (
                        <button
                          key={dIdx}
                          type="button"
                          onClick={() => handleDayToggle(t.key, dIdx)}
                          className={`h-9 rounded-lg text-xs font-medium border flex items-center justify-center transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#1c8a4e] border-[#1c8a4e] text-white shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                          }`}
                        >
                          {dayLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {calculatedCurrentWeekMg > 0 && (
            <div className="text-xs font-semibold text-[#146236] bg-emerald-50 p-2 rounded-lg border border-emerald-100">
              รวมจากเม็ดที่เลือก: {mgFmt(calculatedCurrentWeekMg)} mg/สัปดาห์
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Dose เดิม (mg/สัปดาห์) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              placeholder="เช่น 21"
              value={origDoseManual}
              onChange={(e) => {
                setOrigDoseManual(e.target.value);
                setIsAutoOrig(false);
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#c7e0d2] text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#1c8a4e]"
            />
          </div>
        </div>

        {/* Section 2: New Dose */}
        <div className="border border-[#c7e0d2] rounded-xl p-3.5 bg-white space-y-2">
          <h3 className="font-semibold text-[0.92rem] text-[#146236]">
            2. ขนาดยาที่ต้องการปรับใหม่
          </h3>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Dose ปรับใหม่ (mg/สัปดาห์) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            placeholder="เช่น 28 หรือ 24.5"
            value={newDoseInput}
            onChange={(e) => setNewDoseInput(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-[#c7e0d2] text-base font-bold text-[#146236] focus:outline-none focus:border-[#1c8a4e] focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Percentage change card */}
        {hasValidInputs ? (
          <div className="p-4 bg-white rounded-xl border-2 border-[#c7e0d2] text-center shadow-xs space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              เปอร์เซ็นต์การปรับยา (Percentage Change)
            </div>
            <div
              className={`text-4xl font-extrabold tracking-tight font-mono my-1 ${
                percentWarning ? 'text-amber-600' : 'text-[#146236]'
              }`}
            >
              {isIncrease ? '+' : ''}
              {percentChange.toFixed(2)}%
            </div>
            <div className="text-xs text-slate-600">
              {isIncrease ? 'เพิ่มขึ้น ▲' : percentChange < 0 ? 'ลดลง ▼' : 'ไม่เปลี่ยนแปลง'} · {mgFmt(currentWeeklyDose)} → {mgFmt(newDose)} mg/สัปดาห์ ({isIncrease ? '+' : ''}{mgFmt(diffMg)} mg/wk)
            </div>

            {percentWarning ? (
              <div className="mt-2.5 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-center gap-1.5 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-none" />
                <span>เปอร์เซ็นต์การปรับยาเกินประมาณร้อยละ 20 ต่อครั้ง — พิจารณาทบทวนขนาดยา</span>
              </div>
            ) : percentChange !== 0 ? (
              <div className="mt-2 text-xs text-emerald-700 font-medium">
                ✓ อยู่ในช่วงประมาณร้อยละ 20 ต่อครั้งที่แนะนำ
              </div>
            ) : null}
          </div>
        ) : (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-800 text-center">
            กรอก Dose เดิม และ Dose ปรับใหม่ (mg/สัปดาห์) เพื่อคำนวณร้อยละการปรับยา
          </div>
        )}

        {/* Section 3: Recommended Weekly Pill Schedule */}
        {planned && (
          <div className="border-2 border-[#1c8a4e] rounded-xl p-4 bg-white shadow-sm space-y-3 anim-card">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <h3 className="font-bold text-[#146236] text-[0.98rem]">
                รูปแบบการรับประทานที่แนะนำ — {mgFmt(newDose)} mg/สัปดาห์
              </h3>
              <CheckCircle className="w-4 h-4 text-[#1c8a4e]" />
            </div>

            {/* Instruction Lines */}
            <div className="space-y-1.5">
              {instructionLines.map((line, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#eaf6ef] text-xs text-slate-800 font-medium leading-relaxed border border-emerald-200/50"
                >
                  {line}
                </div>
              ))}
            </div>

            {planned.isHalf && (
              <div className="text-[0.74rem] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
                ขนาดยารวมนี้ต้องใช้เม็ดครึ่ง (หักครึ่งเม็ดตามเส้นแบ่งของเม็ดยา)
              </div>
            )}

            {/* Daily Comparison Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs border-collapse text-center">
                <thead>
                  <tr className="bg-[#eaf6ef] text-[#146236]">
                    <th className="p-2 border border-[#c7e0d2] text-left">วัน</th>
                    {calculatedCurrentWeekMg > 0 && (
                      <th className="p-2 border border-[#c7e0d2]">เดิม</th>
                    )}
                    <th className="p-2 border border-[#c7e0d2]">ใหม่</th>
                    <th className="p-2 border border-[#c7e0d2]">mg</th>
                  </tr>
                </thead>
                <tbody>
                  {planned.sched.map((newD, i) => {
                    const curD = getDayDose(i);
                    const isChanged =
                      calculatedCurrentWeekMg > 0 && comboKey(curD) !== comboKey(newD);
                    const totalDayMg = comboMg(newD);

                    const renderPillChips = (dp: DayPills) => {
                      const chips = [];
                      if (dp.p > 0)
                        chips.push(
                          <span key="p" className="inline-flex items-center gap-0.5 mx-0.5 font-medium text-pink-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#f59bbd] border border-pink-400 inline-block" />
                            {fracTxt(dp.p)}
                          </span>
                        );
                      if (dp.b > 0)
                        chips.push(
                          <span key="b" className="inline-flex items-center gap-0.5 mx-0.5 font-medium text-blue-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#6bb7f2] border border-blue-400 inline-block" />
                            {fracTxt(dp.b)}
                          </span>
                        );
                      if (dp.w > 0)
                        chips.push(
                          <span key="w" className="inline-flex items-center gap-0.5 mx-0.5 font-medium text-slate-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400 inline-block" />
                            {fracTxt(dp.w)}
                          </span>
                        );
                      return chips.length ? chips : <span className="text-slate-400">—</span>;
                    };

                    return (
                      <tr
                        key={i}
                        className={isChanged ? 'bg-amber-50/70 font-medium' : 'hover:bg-slate-50'}
                      >
                        <td className="p-2 border border-[#c7e0d2] text-left font-medium text-slate-800">
                          {DAYS[i]}
                        </td>
                        {calculatedCurrentWeekMg > 0 && (
                          <td className="p-2 border border-[#c7e0d2]">
                            {renderPillChips(curD)}
                          </td>
                        )}
                        <td className="p-2 border border-[#c7e0d2]">
                          {renderPillChips(newD)}
                        </td>
                        <td className="p-2 border border-[#c7e0d2] font-semibold text-[#146236]">
                          {mgFmt(totalDayMg)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#eaf6ef] font-bold text-[#146236]">
                    <td className="p-2 border border-[#c7e0d2] text-left">รวม/สัปดาห์</td>
                    {calculatedCurrentWeekMg > 0 && (
                      <td className="p-2 border border-[#c7e0d2]">
                        {mgFmt(calculatedCurrentWeekMg)} mg
                      </td>
                    )}
                    <td className="p-2 border border-[#c7e0d2]">
                      {mgFmt(planned.sched.reduce((sum, d) => sum + comboMg(d), 0))} mg
                    </td>
                    <td className="p-2 border border-[#c7e0d2]"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 pt-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>ผลรวมต่อสัปดาห์ตรงตามเป้าหมาย {mgFmt(newDose)} mg</span>
            </div>
          </div>
        )}

        {/* Hospital Pharmacy Guidelines */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2 mt-4">
          <div className="font-semibold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
            <Info className="w-4 h-4 text-emerald-700" />
            <span>แนวทางปฏิบัติคลินิกวาร์ฟาริน โรงพยาบาลสุโขทัย</span>
          </div>
          <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed text-[0.82rem]">
            <li>
              คำนวณขนาดยา warfarin ทั้งสัปดาห์ (total weekly dose; TWD) ทุกครั้งว่ามีการเปลี่ยนแปลงหรือไม่
              <br />
              <span className="text-emerald-800 font-medium">→ หากมีการปรับขนาดยา เปอร์เซ็นต์ปรับยาแต่ละครั้งประมาณร้อยละ 20</span>
            </li>
            <li>
              ตรวจสอบระดับ INR ว่า in target หรือไม่ (target INR 2–3 กรณี MVR 2.5–3.5) พิจารณาขนาดยาให้เหมาะสม
            </li>
            <li>
              ตรวจสอบขนาดยาให้ตรงกับขนาดยา TWD ที่เภสัชกรประจำคลินิก note ใน HosXP
            </li>
            <li>
              ตรวจสอบรายการใน HosXP หากแพทย์มีการคีย์คำสั่ง “warfarin consult เภสัช” ให้ส่งผู้ป่วยพบเภสัชกรประจำคลินิกก่อนจ่ายยาทุกครั้ง
            </li>
            <li>
              พิจารณายาที่เกิด Major Drug interaction ตามคู่ยาอันตรกิริยาระหว่างยา (Drug interaction) ในโรงพยาบาลสุโขทัย
            </li>
          </ol>
        </div>

        {/* Back button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับเมนูระบบปรับขนาดยาตามน้ำหนัก</span>
          </button>
        </div>
      </div>
    </div>
  );
};
