import React, { useEffect, useState } from 'react';
import { CrClResultData } from '../../types';
import { Mascot } from '../Mascot';
import { ArrowRight, Edit3, RotateCcw } from 'lucide-react';

interface CrClResultProps {
  data: CrClResultData;
  onGoToDrugs: () => void;
  onEditPatient: () => void;
  onNewPatient: () => void;
}

export const CrClResult: React.FC<CrClResultProps> = ({
  data,
  onGoToDrugs,
  onEditPatient,
  onNewPatient,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  const isCG = data.formula === 'cg';

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 700; // ms
    const target = data.crcl;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(target * easeOutCubic);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };

    requestAnimationFrame(step);
  }, [data.crcl]);

  return (
    <div className="max-w-[560px] mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e6d0da] text-center anim-card">
        {/* Header with sitting mascot */}
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-slate-100 text-left">
          <div>
            <h2 className="text-lg font-semibold text-[#8c2955] pl-2.5 border-l-4 border-[#b53a6b]">
              ผลการประเมินการทำงานของไต
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              ผู้ป่วย {data.gender === 'M' ? 'ชาย' : 'หญิง'} · อายุ {data.age} ปี
              {data.weight ? ` · น้ำหนัก ${data.weight} กก.` : ''} · SCr {data.scr} mg/dL
            </div>
          </div>
          <Mascot mode="sit" size="sm" />
        </div>

        <div className="py-2">
          <div className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">
            {isCG ? 'Creatinine Clearance (Cockcroft-Gault)' : 'Estimated GFR (CKD-EPI 2009)'}
          </div>

          <div className="text-5xl font-bold tracking-tight text-[#8c2955] font-mono my-2">
            {displayValue.toFixed(1)}
          </div>

          <div className="text-sm font-medium text-slate-500 mb-3">
            {data.unit}
          </div>

          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-xs anim-pop"
            style={{ backgroundColor: data.stageColor }}
          >
            {data.stageName}
          </div>

          <div className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            {data.stageDescription}
          </div>
        </div>

        {/* Formula breakdown box */}
        <div className="mt-5 p-3.5 bg-[#fbf0f4] border border-[#e6d0da] rounded-xl text-left text-xs text-slate-600 leading-relaxed font-mono">
          <div className="font-semibold text-[#8c2955] mb-1">รายละเอียดสูตรคำนวณ:</div>
          <div className="whitespace-pre-line font-sans text-slate-700">
            {data.formulaText}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={onGoToDrugs}
            className="w-full bg-[#b53a6b] hover:bg-[#8c2955] text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>ไปหน้าค้นหายาเพื่อปรับขนาดยา →</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onEditPatient}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>แก้ไขข้อมูล</span>
            </button>
            <button
              type="button"
              onClick={onNewPatient}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ผู้ป่วยรายใหม่</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
