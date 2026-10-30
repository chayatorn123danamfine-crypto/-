import React, { useState } from 'react';
import { CrClResultData, Gender, RenalFormula } from '../../types';
import { ArrowLeft, Calculator, User } from 'lucide-react';

interface PatientInputProps {
  formula: RenalFormula;
  onCalculate: (result: CrClResultData) => void;
  onBack: () => void;
  initialData?: CrClResultData | null;
}

export const PatientInput: React.FC<PatientInputProps> = ({
  formula,
  onCalculate,
  onBack,
  initialData,
}) => {
  const [gender, setGender] = useState<Gender | null>(initialData?.gender || null);
  const [age, setAge] = useState<string>(initialData?.age ? String(initialData.age) : '');
  const [weight, setWeight] = useState<string>(
    initialData?.weight ? String(initialData.weight) : ''
  );
  const [scr, setScr] = useState<string>(initialData?.scr ? String(initialData.scr) : '');
  const [error, setError] = useState<string>('');

  const isCG = formula === 'cg';

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const numAge = parseFloat(age);
    const numWt = parseFloat(weight);
    const numScr = parseFloat(scr);

    if (!gender) {
      setError('กรุณาเลือกเพศ');
      return;
    }
    if (!(numAge > 0) || !(numScr > 0)) {
      setError('กรุณากรอกอายุและ Serum creatinine ให้ถูกต้อง');
      return;
    }
    if (numAge >= 140) {
      setError('อายุไม่ถูกต้อง (ต้องน้อยกว่า 140 ปี)');
      return;
    }
    if (isCG && (!(numWt > 0) || numWt >= 400)) {
      setError('กรุณากรอกน้ำหนักตัวให้ถูกต้อง (กก.)');
      return;
    }

    setError('');

    let calculatedValue = 0;
    let unit = isCG ? 'mL/min' : 'mL/min/1.73 m²';
    let formulaText = '';

    if (isCG) {
      // Cockcroft-Gault equation:
      // Male: (140 - Age) * BW / (72 * SCr)
      // Female: (140 - Age) * 0.85 * BW / (72 * SCr)
      const factor = gender === 'F' ? 0.85 : 1;
      calculatedValue = ((140 - numAge) * factor * numWt) / (72 * numScr);

      formulaText = `สูตร Cockcroft-Gault:\n(140 − ${numAge}) × ${
        gender === 'F' ? '0.85 × ' : ''
      }${numWt} ÷ (72 × ${numScr})\n` +
      `= ${calculatedValue.toFixed(2)} mL/min\n` +
      `หมายเหตุ: ${gender === 'F' ? 'เพศหญิงคูณ 0.85 ' : ''}ใช้น้ำหนักตัวจริง (Actual BW)`;
    } else {
      // CKD-EPI equation from table page ก:
      // Male:
      //   SCr <= 0.9: 141 * (SCr / 0.9)^(-0.411) * (0.993)^Age
      //   SCr > 0.9:  141 * (SCr / 0.9)^(-1.209) * (0.993)^Age
      // Female:
      //   SCr <= 0.7: 144 * (SCr / 0.7)^(-0.329) * (0.993)^Age
      //   SCr > 0.7:  144 * (SCr / 0.7)^(-1.209) * (0.993)^Age
      if (gender === 'M') {
        if (numScr <= 0.9) {
          calculatedValue = 141 * Math.pow(numScr / 0.9, -0.411) * Math.pow(0.993, numAge);
          formulaText = `สูตร CKD-EPI (ชาย, SCr ≤ 0.9 มก./ดล.):\n141 × (${numScr} / 0.9)^(-0.411) × (0.993)^${numAge}`;
        } else {
          calculatedValue = 141 * Math.pow(numScr / 0.9, -1.209) * Math.pow(0.993, numAge);
          formulaText = `สูตร CKD-EPI (ชาย, SCr > 0.9 มก./ดล.):\n141 × (${numScr} / 0.9)^(-1.209) × (0.993)^${numAge}`;
        }
      } else {
        if (numScr <= 0.7) {
          calculatedValue = 144 * Math.pow(numScr / 0.7, -0.329) * Math.pow(0.993, numAge);
          formulaText = `สูตร CKD-EPI (หญิง, SCr ≤ 0.7 มก./ดล.):\n144 × (${numScr} / 0.7)^(-0.329) × (0.993)^${numAge}`;
        } else {
          calculatedValue = 144 * Math.pow(numScr / 0.7, -1.209) * Math.pow(0.993, numAge);
          formulaText = `สูตร CKD-EPI (หญิง, SCr > 0.7 มก./ดล.):\n144 × (${numScr} / 0.7)^(-1.209) × (0.993)^${numAge}`;
        }
      }
      formulaText += `\n= ${calculatedValue.toFixed(2)} mL/min/1.73 m²`;
    }

    // Staging from Table page ก:
    let stageNum = '1';
    let stageName = '';
    let stageColor = '';
    let stageDescription = '';

    if (calculatedValue >= 90) {
      stageNum = '1';
      stageName = 'ระยะที่ 1 (≥ 90)';
      stageColor = '#1f9d6b';
      stageDescription = 'อัตราการกรองของไตปกติ แต่พบมีความผิดปกติจากการตรวจปัสสาวะ เอกซเรย์ และ/หรือพยาธิสภาพของชิ้นเนื้อไต';
    } else if (calculatedValue >= 60) {
      stageNum = '2';
      stageName = 'ระยะที่ 2 (60–89)';
      stageColor = '#6aa84f';
      stageDescription = 'อัตราการกรองของไตลดลงเล็กน้อย';
    } else if (calculatedValue >= 45) {
      stageNum = '3a';
      stageName = 'ระยะที่ 3a (45–59)';
      stageColor = '#d98a00';
      stageDescription = 'อัตราการกรองของไตลดลงปานกลาง';
    } else if (calculatedValue >= 30) {
      stageNum = '3b';
      stageName = 'ระยะที่ 3b (30–44)';
      stageColor = '#c77d00';
      stageDescription = 'อัตราการกรองของไตลดลงปานกลาง';
    } else if (calculatedValue >= 15) {
      stageNum = '4';
      stageName = 'ระยะที่ 4 (15–29)';
      stageColor = '#e0622b';
      stageDescription = 'อัตราการกรองของไตลดลงมาก';
    } else {
      stageNum = '5';
      stageName = 'ระยะที่ 5 (< 15)';
      stageColor = '#d6354b';
      stageDescription = 'ภาวะไตวาย หรือรับการบำบัดทดแทนไต';
    }

    onCalculate({
      formula,
      crcl: calculatedValue,
      unit,
      stageName,
      stageNum,
      stageColor,
      stageDescription,
      formulaText,
      age: numAge,
      weight: isCG ? numWt : undefined,
      scr: numScr,
      gender,
    });
  };

  return (
    <div className="max-w-[560px] mx-auto px-4 py-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e6d0da] anim-card">
        {/* Title */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-[#8c2955] pl-2.5 border-l-4 border-[#b53a6b]">
              {isCG ? 'คำนวณ CrCl (Cockcroft-Gault)' : 'คำนวณ eGFR (CKD-EPI)'}
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              {isCG
                ? 'สูตร C-G equation (หน่วย mL/min)'
                : 'สูตร CKD-EPI equation (หน่วย mL/min/1.73 m²)'}
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isCG ? 'bg-rose-50 text-[#b53a6b] border border-rose-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
            }`}
          >
            {isCG ? 'CrCl' : 'eGFR'}
          </span>
        </div>

        <form onSubmit={handleCalculate} className="space-y-4">
          {/* Gender selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              เพศ <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setGender('M')}
                className={`py-2.5 px-4 rounded-xl border-2 font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  gender === 'M'
                    ? 'bg-[#b53a6b] border-[#b53a6b] text-white shadow-xs'
                    : 'bg-white border-[#e6d0da] text-slate-700 hover:border-rose-300'
                }`}
              >
                <User className="w-4 h-4" />
                <span>ชาย (Male)</span>
              </button>
              <button
                type="button"
                onClick={() => setGender('F')}
                className={`py-2.5 px-4 rounded-xl border-2 font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  gender === 'F'
                    ? 'bg-[#b53a6b] border-[#b53a6b] text-white shadow-xs'
                    : 'bg-white border-[#e6d0da] text-slate-700 hover:border-rose-300'
                }`}
              >
                <User className="w-4 h-4" />
                <span>หญิง (Female)</span>
              </button>
            </div>
          </div>

          {/* Age and Weight (Weight only for CG) */}
          <div className={`grid ${isCG ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                อายุ (ปี) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="1"
                max="120"
                step="1"
                placeholder="เช่น 65"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6d0da] focus:outline-none focus:border-[#b53a6b] focus:ring-2 focus:ring-rose-100 text-slate-800 text-sm font-medium"
              />
            </div>

            {isCG && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  น้ำหนักตัว (กก.) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  min="1"
                  max="300"
                  step="0.1"
                  placeholder="เช่น 60"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6d0da] focus:outline-none focus:border-[#b53a6b] focus:ring-2 focus:ring-rose-100 text-slate-800 text-sm font-medium"
                />
              </div>
            )}
          </div>

          {/* Serum Creatinine */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Serum Creatinine (mg/dL) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.1"
              max="30"
              placeholder="เช่น 1.20"
              value={scr}
              onChange={(e) => setScr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6d0da] focus:outline-none focus:border-[#b53a6b] focus:ring-2 focus:ring-rose-100 text-slate-800 text-sm font-medium"
            />
          </div>

          {error && (
            <div className="text-rose-600 text-xs font-medium bg-rose-50 border border-rose-200 rounded-lg p-2.5">
              {error}
            </div>
          )}

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full bg-[#b53a6b] hover:bg-[#8c2955] text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Calculator className="w-4 h-4" />
              <span>{isCG ? 'คำนวณค่า CrCl' : 'คำนวณค่า eGFR'}</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>เปลี่ยนสูตรคำนวณ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
