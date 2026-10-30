import { RenalDrug } from '../types';

const G = 1e9;

function std(
  name: string,
  thaiName: string,
  drugClass: string,
  normalDose: string,
  a: string,
  b: string,
  d: string,
  hd?: string,
  note?: string
): RenalDrug {
  return {
    name,
    thaiName,
    drugClass,
    normalDose,
    groups: [
      {
        label: '',
        rules: [
          [50.1, G, 'CrCl > 50', a],
          [10, 50.1, 'CrCl 10–50', b],
          [0, 10, 'CrCl < 10', d],
        ],
        hd,
      },
    ],
    note,
  };
}

export const RENAL_DRUGS: RenalDrug[] = [
  // 1. Acyclovir
  {
    name: 'Acyclovir (ฉีด IV)',
    thaiName: 'อะไซโคลเวียร์ (ฉีด)',
    drugClass: 'Antiviral',
    normalDose: '5–10 mg/kg IV ทุก 8 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'ขนาดยาตาม CrCl (IV)',
        rules: [
          [50.1, G, 'CrCl > 50', '100% ของขนาดปกติ ทุก 8 ชม. (5–10 mg/kg ทุก 8 ชม.)'],
          [25, 50.1, 'CrCl 25–50', '100% ของขนาดปกติ ทุก 12 ชม. (5–10 mg/kg ทุก 12 ชม.)'],
          [10, 25, 'CrCl 10–25', '100% ของขนาดปกติ ทุก 24 ชม. (5–10 mg/kg ทุก 24 ชม.)'],
          [0, 10, 'CrCl < 10', '50% ของขนาดปกติ ทุก 24 ชม. (2.5–5 mg/kg ทุก 24 ชม.)'],
        ],
        hd: 'Hemodialysis: 2.5–5 mg/kg ทุก 24 ชม. (ให้หลังฟอกเลือด)',
        pd: 'Peritoneal dialysis: 50% ของขนาดปกติ วันละครั้ง',
      },
    ],
    note: 'ผู้ป่วยอ้วนให้ใช้น้ำหนัก Adjusted BW',
  },
  {
    name: 'Acyclovir (รับประทาน Oral)',
    thaiName: 'อะไซโคลเวียร์ (กิน)',
    drugClass: 'Antiviral',
    normalDose: '200–800 mg วันละ 5 ครั้ง',
    method: 'D&I',
    groups: [
      {
        label: 'ขนาดยาตาม CrCl (Oral)',
        rules: [
          [25.1, G, 'CrCl > 25', 'ขนาดยาปกติ 200–800 mg วันละ 5 ครั้ง'],
          [10, 25.1, 'CrCl 10–25', 'กรณีขนาดปกติ 800 mg 5 ครั้ง/วัน ให้ปรับเป็น 800 mg ทุก 8 ชม.'],
          [0, 10, 'CrCl < 10', 'กรณีขนาดปกติ 200 mg 5 ครั้ง/วัน (หรือ 400 mg q 12h) ให้เป็น 200 mg ทุก 12 ชม. | กรณี 800 mg 5 ครั้ง/วัน ให้เป็น 800 mg ทุก 12 ชม.'],
        ],
        hd: 'ให้ยาหลังการฟอกเลือด',
      },
    ],
  },

  // 2. Allopurinol
  {
    name: 'Allopurinol',
    thaiName: 'อัลโลพูรินอล',
    drugClass: 'Xanthine Oxidase Inhibitor (เกาต์)',
    normalDose: '100–600 mg/วัน รับประทานวันละครั้ง หรือแบ่ง 2–3 ครั้ง (สูงสุด 800 mg/วัน)',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [20.1, G, 'CrCl > 20', 'ขนาดยาปกติ 100–300 mg วันละครั้ง (เริ่มขนาดต่ำแล้วค่อยปรับขึ้น)'],
          [10, 20.1, 'CrCl 10–20', '200 mg วันละครั้ง'],
          [3, 10, 'CrCl 3–10', '≤ 100 mg วันละครั้ง'],
          [0, 3, 'CrCl < 3', '≤ 100 mg ต่อครั้ง โดยขยายระยะห่างการให้ยา (Extended intervals)'],
        ],
        hd: 'Hemodialysis: เริ่ม 100 mg วันเว้นวัน ให้หลังฟอกเลือด ค่อยๆ ปรับเพิ่มอย่างระมัดระวังสูงสุด 300 mg ตามการตอบสนอง',
      },
      {
        label: 'เกณฑ์ปรับตาม eGFR',
        rules: [
          [50.1, G, 'eGFR > 50', '75% ของขนาดปกติ หรือ 150 mg วันละครั้ง (eGFR 40–59)'],
          [20, 50.1, 'eGFR 20–50', '50% ของขนาดปกติ หรือ 100 mg วันละครั้ง'],
          [10, 20, 'eGFR 10–19', '100 mg วันเว้นวัน'],
          [0, 10, 'eGFR < 10', '25% ของขนาดปกติ หรือ 100 mg ทุก 3 วัน'],
        ],
      },
    ],
  },

  // 3. Amikacin
  {
    name: 'Amikacin',
    thaiName: 'อะมิคาซิน',
    drugClass: 'Aminoglycoside',
    normalDose: '15–20 mg/kg ทุก 24 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl (Once-daily dosing)',
        rules: [
          [60.1, G, 'CrCl > 60', '15–20 mg/kg ทุก 24 ชม.'],
          [40, 60.1, 'CrCl 40–59', '15 mg/kg ทุก 36 ชม.'],
          [30, 40, 'CrCl 30–39', '15 mg/kg ทุก 48 ชม.'],
          [0, 30, 'CrCl < 30', 'ไม่แนะนำให้ใช้ในรูปแบบ Once-daily หรือให้ปรับตามระดับยาในเลือดอย่างใกล้ชิด'],
        ],
        hd: 'Hemodialysis: 5–7.5 mg/kg ทุก 48–72 ชม. ติดตามระดับยา ให้ซ้ำเมื่อระดับก่อนฟอก < 10 mg/L หรือหลังฟอก < 6–8 mg/L',
        pd: 'Peritoneal dialysis: 2 mg/kg ต่อรอบ exchange วันละครั้ง (dwell ≥ 6 ชม.)',
      },
    ],
    note: 'ผู้ป่วยอ้วนใช้น้ำหนัก Adjusted BW และควรตรวจติดตาม TDM (ระดับยาในเลือด)',
  },

  // 4. Amoxicillin + Clavulanic
  {
    name: 'Amoxicillin + Clavulanic acid (IV)',
    thaiName: 'อะม็อกซีซิลลิน + คลาวูลาเนต (ฉีด)',
    drugClass: 'Penicillin + β-lactamase inhibitor',
    normalDose: '1.2 g IV ทุก 6–8 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30.1, G, 'CrCl > 30', 'ขนาดยาปกติ 1.2 g IV ทุก 6–8 ชม.'],
          [10, 30.1, 'CrCl 10–30', '1.2 g IV stat ตามด้วย 600 mg IV ทุก 12 ชม.'],
          [0, 10, 'CrCl < 10', '1.2 g IV stat ตามด้วย 600 mg IV ทุก 24 ชม.'],
        ],
        hd: 'Hemodialysis: ให้ขนาดเสริม 600 mg IV เมื่อสิ้นสุดการฟอกเลือด',
      },
    ],
  },
  {
    name: 'Amoxicillin + Clavulanic acid (Oral)',
    thaiName: 'อะม็อกซีซิลลิน + คลาวูลาเนต (กิน/Augmentin)',
    drugClass: 'Penicillin + β-lactamase inhibitor',
    normalDose: '500/125 mg ทุก 8–12 ชม. หรือ 875/125 mg ทุก 12 ชม. หรือ 1,000 mg ทุก 12 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30.1, G, 'CrCl ≥ 30', 'ไม่ต้องปรับขนาดยา ใช้ขนาดปกติได้'],
          [10, 30.1, 'CrCl 10–30', '250–500 mg ทุก 12 ชม. (ห้ามใช้เม็ดขนาด 875 mg หรือรูปแบบ Extended-release)'],
          [0, 10, 'CrCl < 10', '250–500 mg ทุก 24 ชม. (ห้ามใช้เม็ดขนาด 875 mg หรือรูปแบบ Extended-release)'],
        ],
        hd: 'Hemodialysis: 250–500 mg ทุก 24 ชม. ให้ยาทั้งระหว่างและหลังการฟอกเลือด (ห้ามใช้ 875 mg หรือ XR)',
      },
    ],
  },

  // 5. Amphotericin B
  {
    name: 'Amphotericin B deoxycholate',
    thaiName: 'แอมโฟเทอริซิน บี',
    drugClass: 'Antifungal',
    normalDose: '0.25–1 mg/kg IV ทุก 24 ชม.',
    method: 'I',
    groups: [
      {
        label: 'ขนาดยาตาม CrCl',
        rules: [
          [50.1, G, 'CrCl > 50', '0.25–1 mg/kg ทุก 24 ชม.'],
          [10, 50.1, 'CrCl 10–50', '0.25–1 mg/kg ทุก 24 ชม. (ไม่ต้องปรับขนาด)'],
          [0, 10, 'CrCl < 10', '0.25–1 mg/kg ทุก 24–36 ชม.'],
        ],
        pd: 'Peritoneal dialysis: ผสมในน้ำยาฟอกไต 1–2 mg/L',
      },
    ],
    note: 'ยานี้มีพิษต่อไตสูง ควรตรวจติดตามค่า SCr และ Electrolytes อย่างใกล้ชิด',
  },

  // 6. Ampicillin
  {
    name: 'Ampicillin (IV/IM)',
    thaiName: 'แอมพิซิลลิน',
    drugClass: 'Penicillin',
    normalDose: '1–2 g IV/IM ทุก 4–6 ชม. (สูงสุด 12 g/วัน)',
    method: 'I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [50.1, G, 'CrCl > 50', '1–2 g ทุก 6 ชม.'],
          [10, 50.1, 'CrCl 10–50', '1–2 g ทุก 6–12 ชม.'],
          [0, 10, 'CrCl < 10', '1–2 g ทุก 12–24 ชม.'],
        ],
        hd: 'Hemodialysis: 1–2 g ทุก 12–24 ชม. ให้ยาหลังการฟอกเลือดในวันที่ฟอก',
        pd: 'Peritoneal dialysis: 250 mg ทุก 12 ชม.',
      },
    ],
  },

  // 7. Ampicillin + Sulbactam
  {
    name: 'Ampicillin + Sulbactam (Unasyn)',
    thaiName: 'แอมพิซิลลิน + ซัลแบคแทม (ยูนาซิน)',
    drugClass: 'Penicillin + β-lactamase inhibitor',
    normalDose: '1.5–3 g IV ทุก 6 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30.1, G, 'CrCl ≥ 30', 'ขนาดยาปกติ 1.5–3 g ทุก 6 ชม.'],
          [15, 30.1, 'CrCl 15–29', '1.5–3 g ทุก 12 ชม.'],
          [5, 15, 'CrCl 5–14', '1.5–3 g ทุก 24 ชม.'],
          [0, 5, 'CrCl < 5', '1.5–3 g ทุก 24–48 ชม.'],
        ],
        hd: 'Hemodialysis: 1.5–3 g ทุก 12–24 ชม. ให้ยาหลังฟอกเลือด',
      },
    ],
  },

  // 8. Atenolol
  {
    name: 'Atenolol',
    thaiName: 'อะทีโนลอล',
    drugClass: 'Beta-blocker (ลดความดัน)',
    normalDose: '25–100 mg รับประทานวันละครั้ง (OD)',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [35.1, G, 'CrCl > 35', 'ไม่ต้องปรับขนาดยา 25–100 mg วันละครั้ง'],
          [15, 35.1, 'CrCl 15–35', 'ขนาดสูงสุดไม่เกิน 50 mg วันละครั้ง'],
          [0, 15, 'CrCl < 15', 'ขนาดสูงสุดไม่เกิน 25 mg วันละครั้ง'],
        ],
        hd: 'Hemodialysis: ให้ยาหลังการฟอกเลือด หรือให้ขนาดเสริม 25–50 mg',
        pd: 'Peritoneal dialysis: ไม่จำเป็นต้องให้ขนาดเสริม',
      },
    ],
  },

  // 9. Azathioprine
  {
    name: 'Azathioprine',
    thaiName: 'อะซาไธโอพรีน',
    drugClass: 'Immunosuppressant',
    normalDose: '1 mg/kg/วัน รับประทานครั้งเดียวหรือแบ่ง 2 ครั้ง (สูงสุด 2.5 mg/kg/วัน)',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl / eGFR',
        rules: [
          [50.1, G, 'CrCl/eGFR > 50', '100% ของขนาดปกติ'],
          [10, 50.1, 'CrCl/eGFR 10–50', '75% ของขนาดปกติ'],
          [0, 10, 'CrCl/eGFR < 10', '50% ของขนาดปกติ'],
        ],
        hd: 'Hemodialysis: 50% ของขนาดปกติ, ขนาดเสริมหลังฟอกไต 0.25 mg/kg',
      },
    ],
  },

  // 10. Benzathine Penicillin G
  {
    name: 'Benzathine Penicillin G',
    thaiName: 'เบนซาทีน เพนิซิลลิน จี',
    drugClass: 'Penicillin',
    normalDose: '1.2–2.4 ล้านยูนิต IM ทุก 1 สัปดาห์',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม eGFR',
        rules: [
          [50.1, G, 'eGFR > 50', '100% ของขนาดปกติ'],
          [10, 50.1, 'eGFR 10–50', '75% ของขนาดปกติ'],
          [0, 10, 'eGFR < 10', '20–50% ของขนาดปกติ'],
        ],
        pd: 'CAPD: 20–50% ทุก 6 ชม.',
      },
    ],
  },

  // 11. Benzylpenicillin (Penicillin G Sodium)
  {
    name: 'Benzylpenicillin (Penicillin G Sodium)',
    thaiName: 'เพนิซิลลิน จี โซเดียม',
    drugClass: 'Penicillin',
    normalDose: '1–24 ล้านยูนิต/วัน IV/IM แบ่งให้ทุก 4–6 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [10.1, G, 'CrCl > 10', 'Full loading dose IV/IM ตามด้วย 50% ของ loading dose ทุก 4–5 ชม.'],
          [0, 10.1, 'CrCl < 10', 'Full loading dose IV/IM ตามด้วย 1/2 loading dose ทุก 8–10 ชม.'],
        ],
        hd: 'Hemodialysis: ขนาดปกติ ตามด้วย 25–50% ของขนาดปกติทุก 4–6 ชม. หรือ 50–100% ทุก 8–12 ชม.',
      },
    ],
  },

  // 12. Cefazolin
  {
    name: 'Cefazolin',
    thaiName: 'เซฟาโซลิน',
    drugClass: 'Cephalosporin gen 1',
    normalDose: '1–1.5 g IV/IM ทุก 8 ชม. (สูงสุด 12 g/วัน)',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [55, G, 'CrCl ≥ 55', 'ขนาดยาปกติ 1–1.5 g ทุก 8 ชม.'],
          [35, 55, 'CrCl 35–54', '100% ของขนาดปกติ ทุก 8 ชม.'],
          [11, 35, 'CrCl 11–34', '50% ของขนาดปกติ ทุก 12 ชม.'],
          [0, 11, 'CrCl ≤ 10', '50% ของขนาดปกติ ทุก 18–24 ชม.'],
        ],
        hd: 'Hemodialysis: 500–1,000 mg ทุก 24 ชม. หรือ 1–2 g ทุก 48–72 ชม. หรือ 15–20 mg/kg (สูงสุด 2 g) IV หลังฟอกไต 3 ครั้ง/สัปดาห์',
        pd: 'Peritoneal dialysis: 0.5 g ทุก 12 ชม.',
      },
    ],
  },

  // 13. Cefdinir
  {
    name: 'Cefdinir',
    thaiName: 'เซฟดินีร์',
    drugClass: 'Cephalosporin gen 3',
    normalDose: '300 mg รับประทานทุก 12 ชม. (หรือ 100 mg ทุก 8 ชม.)',
    method: 'I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30, G, 'CrCl ≥ 30', 'ไม่ต้องปรับขนาดยา 300 mg ทุก 12 ชม.'],
          [0, 30, 'CrCl < 30', '300 mg วันละครั้ง (OD)'],
        ],
        hd: 'Hemodialysis: เริ่มต้น 300 mg (หรือ 7 mg/kg) วันเว้นวัน หลังฟอกเลือด',
      },
    ],
  },

  // 14. Cefepime
  {
    name: 'Cefepime',
    thaiName: 'เซฟีพิม',
    drugClass: 'Cephalosporin gen 4',
    normalDose: '1–2 g IV ทุก 8–12 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'กรณีขนาดปกติ 2 g ทุก 8 ชม. (Severe infection / Febrile neutropenia)',
        rules: [
          [60.1, G, 'CrCl > 60', '2 g ทุก 8 ชม.'],
          [30, 60.1, 'CrCl 30–60', '2 g ทุก 12 ชม.'],
          [11, 30, 'CrCl 11–29', '2 g ทุก 24 ชม.'],
          [0, 11, 'CrCl < 11', '1 g ทุก 24 ชม.'],
        ],
        hd: 'Hemodialysis: วันแรก 1 g, ต่อไป 500 mg – 1 g ทุก 24 ชม. หรือ 1–2 g ทุก 48–72 ชม. หรือ 2 g หลังฟอกเลือด 3 ครั้ง/สัปดาห์',
        pd: 'Peritoneal dialysis: ให้ขนาดยาที่แนะนำทุก 48 ชม.',
      },
      {
        label: 'กรณีขนาดปกติ 1–2 g ทุก 12 ชม. (Moderate infection)',
        rules: [
          [60.1, G, 'CrCl > 60', '1–2 g ทุก 12 ชม.'],
          [30, 60.1, 'CrCl 30–60', '1–2 g ทุก 24 ชม.'],
          [11, 30, 'CrCl 11–29', '500 mg – 1 g ทุก 24 ชม.'],
          [0, 11, 'CrCl < 11', '250–500 mg ทุก 24 ชม.'],
        ],
      },
    ],
    note: 'ผู้ป่วยไตเสื่อมที่ได้รับ cefepime ขนาดสูงเกินไปเสี่ยงเกิด Cefepime-induced Neurotoxicity (ชัก สับสน โคม่า)',
  },

  // 15. Cefixime
  {
    name: 'Cefixime',
    thaiName: 'เซฟิซิม',
    drugClass: 'Cephalosporin gen 3',
    normalDose: '400 mg รับประทานวันละครั้ง หรือ 200 mg ทุก 12 ชม.',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [40, G, 'CrCl ≥ 40', 'ขนาดยาปกติ 400 mg วันละครั้ง'],
          [20, 40, 'CrCl 20–40', '75% ของขนาดปกติ (300 mg วันละครั้ง)'],
          [0, 20, 'CrCl < 20', '50% ของขนาดปกติ (200 mg วันละครั้ง)'],
        ],
        hd: 'Hemodialysis: ไม่ถูกขจัดด้วยการฟอกไต ให้ยาน้ำ 260 mg วันละครั้ง หรือ 200 mg OD',
        pd: 'CAPD: 200 mg วันละครั้ง',
      },
    ],
  },

  // 16. Cefoperazone + Sulbactam
  {
    name: 'Cefoperazone + Sulbactam',
    thaiName: 'เซโฟเพอราโซน + ซัลแบคแทม (Sulperazon)',
    drugClass: 'Cephalosporin + β-lactamase inhibitor',
    normalDose: '1–2 g ทุก 12 ชม.',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดตาม Sulbactam',
        rules: [
          [30.1, G, 'CrCl > 30', 'ขนาดยาปกติ 1–2 g ทุก 12 ชม.'],
          [15, 30.1, 'CrCl 15–30', 'sulbactam สูงสุดไม่เกิน 1 g ทุก 12 ชม. (sulbactam รวมไม่เกิน 2 g/วัน)'],
          [0, 15, 'CrCl < 15', 'sulbactam สูงสุดไม่เกิน 500 mg ทุก 12 ชม. (sulbactam รวมไม่เกิน 1 g/วัน)'],
        ],
        hd: 'Hemodialysis: ให้ขนาดเสริม (Supplement) 1 g หลังการฟอกเลือด',
      },
    ],
  },

  // 17. Cefotaxime
  {
    name: 'Cefotaxime',
    thaiName: 'เซโฟแทกซิม',
    drugClass: 'Cephalosporin gen 3',
    normalDose: '1–2 g IM/IV ทุก 8–12 ชม. (รุนแรง 2 g ทุก 4 ชม.)',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม eGFR / CrCl',
        rules: [
          [50.1, G, 'CrCl/eGFR > 50', 'ขนาดยาปกติ 1–2 g ทุก 6–8 ชม.'],
          [10, 50.1, 'CrCl/eGFR 10–50', '1–2 g ทุก 6–12 ชม.'],
          [0, 10, 'CrCl/eGFR < 10', '1–2 g ทุก 24 ชม. หรือลดขนาดลง 50%'],
        ],
        hd: 'Hemodialysis: 1–2 g IV ทุก 24 ชม. ในวันที่ฟอกให้หลังฟอกเลือด',
        pd: 'Peritoneal dialysis: 1 g IV ทุก 24 ชม.',
      },
    ],
  },

  // 18. Ceftazidime
  {
    name: 'Ceftazidime',
    thaiName: 'เซฟตาซิดีม',
    drugClass: 'Cephalosporin gen 3 (antipseudomonal)',
    normalDose: '0.5–2 g IV ทุก 8 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [50.1, G, 'CrCl > 50', 'ขนาดยาปกติ 1–2 g ทุก 8 ชม.'],
          [31, 50.1, 'CrCl 31–50', '1 g ทุก 12 ชม.'],
          [16, 31, 'CrCl 16–30', '1 g ทุก 24 ชม.'],
          [6, 16, 'CrCl 6–15', '500 mg ทุก 24 ชม.'],
          [0, 6, 'CrCl < 5', '500 mg ทุก 48 ชม.'],
        ],
        hd: 'Hemodialysis: 0.5–1 g ทุก 24 ชม. หรือ 1–2 g ทุก 48–72 ชม. (ให้หลังฟอกเลือด)',
        pd: 'Peritoneal dialysis: โหลด 1 g ตามด้วย 500 mg ทุก 24 ชม.',
      },
    ],
  },

  // 19. Ceftriaxone
  {
    name: 'Ceftriaxone',
    thaiName: 'เซฟไตรอะโซน',
    drugClass: 'Cephalosporin gen 3',
    normalDose: '1–2 g IV/IM วันละครั้ง (เยื่อหุ้มสมองอักเสบ 2 g ทุก 12 ชม.)',
    rules: [
      [0, G, 'ทุกระดับการทำงานของไต', 'ไม่ต้องปรับขนาดยาตามไต (ขับทางตับและไต) แต่หากมีตับเสื่อมร่วมด้วย ขนาดสูงสุดไม่เกิน 2 g/วัน'],
    ],
    hd: 'Hemodialysis: ไม่ต้องปรับขนาดยา และไม่ต้องให้ยาเสริมหลังฟอกเลือด',
  },

  // 20. Cephalexin
  {
    name: 'Cephalexin',
    thaiName: 'เซฟาเลกซิน',
    drugClass: 'Cephalosporin gen 1',
    normalDose: '250–1,000 mg รับประทานทุก 6 ชม. หรือ 500 mg ทุก 12 ชม. (สูงสุด 4 g/วัน)',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [60, G, 'CrCl ≥ 60', 'ขนาดยาปกติ ไม่ต้องปรับขนาด'],
          [30, 60, 'CrCl 30–59', 'ขนาดรวมไม่เกิน 1,000 mg/วัน (หรือ 500 mg ทุก 8–12 ชม.)'],
          [15, 30, 'CrCl 15–29', '250 mg ทุก 8–12 ชม.'],
          [5, 15, 'CrCl 5–14', '250 mg ทุก 24 ชม.'],
          [0, 5, 'CrCl 1–4', '250 mg ทุก 48–60 ชม.'],
        ],
        hd: 'Hemodialysis: 250–500 mg ทุก 12–24 ชม. ให้ยาหลังการฟอกเลือด',
        pd: 'Peritoneal dialysis: 250–500 mg ทุก 12–24 ชม.',
      },
    ],
  },

  // 21. Cetirizine
  {
    name: 'Cetirizine',
    thaiName: 'เซทิริซีน (ยาแก้แพ้)',
    drugClass: 'Antihistamine',
    normalDose: '5–10 mg วันละครั้ง (สูงสุด 10 mg/วัน)',
    groups: [
      {
        label: 'ปรับขนาดยาตาม eGFR / CrCl',
        rules: [
          [50.1, G, 'CrCl/eGFR > 50', 'ขนาดยาปกติ 10 mg วันละครั้ง'],
          [0, 50.1, 'CrCl/eGFR ≤ 50', '5 mg วันละครั้ง (หรือ 5 mg วันเว้นวัน)'],
        ],
        hd: 'Hemodialysis: 5 mg วันละครั้ง หรือ 5 mg 3 ครั้งต่อสัปดาห์',
        pd: 'Peritoneal dialysis: 5 mg วันละครั้ง',
      },
    ],
  },

  // 22. Ciprofloxacin
  {
    name: 'Ciprofloxacin (IV)',
    thaiName: 'ซิโปรฟลอกซาซิน (ฉีด)',
    drugClass: 'Fluoroquinolone',
    normalDose: '400 mg IV ทุก 12 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30, G, 'CrCl ≥ 30', '400 mg IV ทุก 12 ชม. (ไม่ต้องปรับขนาด)'],
          [5, 30, 'CrCl 5–29', '200–400 mg IV ทุก 18–24 ชม.'],
          [0, 5, 'CrCl < 5', '200 mg IV ทุก 24 ชม.'],
        ],
        hd: 'Hemodialysis: 200–400 mg ทุก 24 ชม. ให้หลังการฟอกเลือด',
      },
    ],
  },
  {
    name: 'Ciprofloxacin (Oral)',
    thaiName: 'ซิโปรฟลอกซาซิน (กิน)',
    drugClass: 'Fluoroquinolone',
    normalDose: '500–750 mg รับประทานทุก 12 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [50, G, 'CrCl ≥ 50', '500–750 mg ทุก 12 ชม.'],
          [30, 50, 'CrCl 30–50', '250–500 mg ทุก 12 ชม.'],
          [5, 30, 'CrCl 5–29', '250–500 mg ทุก 18 ชม.'],
          [0, 5, 'CrCl < 5', '250–500 mg ทุก 24 ชม.'],
        ],
        hd: 'Hemodialysis: 250–500 mg ทุก 24 ชม. ให้ยาหลังทำฟอกเลือด',
      },
    ],
  },

  // 23. Clarithromycin
  {
    name: 'Clarithromycin',
    thaiName: 'คลาริโทรมัยซิน',
    drugClass: 'Macrolide',
    normalDose: '250–500 mg รับประทานทุก 12 ชม. หรือ 1,000 mg (XR) วันละครั้ง',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30, G, 'CrCl ≥ 30', 'ไม่ต้องปรับขนาดยา ใช้ขนาดปกติได้'],
          [0, 30, 'CrCl < 30', 'ลดขนาดยาลง 50% (เช่น 250 mg ทุก 12 ชม. หรือ 500 mg ทุก 24 ชม.) ห้ามใช้รูปแบบเม็ด XR'],
        ],
        hd: 'Hemodialysis: ให้ยาหลังการฟอกเลือดเสร็จสิ้น',
      },
    ],
  },

  // 24. Colistimethate (Colistin)
  {
    name: 'Colistimethate sodium (Colistin)',
    thaiName: 'โคลิสติน',
    drugClass: 'Polymyxin',
    normalDose: '2.5–5 mg/kg/วัน แบ่งให้ 2–4 ครั้ง (สูงสุด 5 mg/kg/วัน หรือ ~300 mg CBA/วัน)',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [80, G, 'CrCl ≥ 80', 'ไม่ต้องปรับขนาดยา (2.5–5 mg/kg/วัน แบ่ง 2–4 ครั้ง)'],
          [50, 80, 'CrCl 50–79', '2.5–3.8 mg/kg/วัน แบ่งให้ 2 ครั้ง'],
          [30, 50, 'CrCl 30–49', '2.5 mg/kg/วัน วันละครั้ง หรือแบ่ง 2 ครั้ง'],
          [10, 30, 'CrCl 10–29', '1.5 mg/kg ทุก 36 ชม.'],
          [0, 10, 'CrCl < 10', '1.5 mg/kg ทุก 48 ชม.'],
        ],
        hd: 'Hemodialysis: 1.5 mg/kg ทุก 24–48 ชม. (ในวันที่ฟอกให้หลังฟอกเลือด)',
      },
    ],
    note: 'ระวังพิษต่อไต (Nephrotoxicity) และระบบประสาท',
  },

  // 25. Cyclophosphamide
  {
    name: 'Cyclophosphamide',
    thaiName: 'ไซโคลฟอสฟาไมด์',
    drugClass: 'Alkylating agent (เคมีบำบัด/กดภูมิ)',
    normalDose: '1–5 mg/kg/วัน รับประทาน',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม eGFR / CrCl',
        rules: [
          [50.1, G, 'eGFR > 50', '100% ของขนาดปกติ ทุก 12 ชม.'],
          [10, 50.1, 'eGFR 10–50', '75% ของขนาดปกติ ทุก 12 ชม.'],
          [0, 10, 'eGFR < 10', '50% ของขนาดปกติ ทุก 18–24 ชม.'],
        ],
        hd: 'Hemodialysis: 50% ของขนาดปกติ ให้หลังการฟอกเลือด',
        pd: 'Peritoneal dialysis: 75% ของขนาดปกติ',
      },
    ],
  },

  // 26. Colchicine
  {
    name: 'Colchicine',
    thaiName: 'โคลชิซีน',
    drugClass: 'Anti-gout',
    normalDose: 'ป้องกันเกาต์: 0.6 mg วันละ 1–2 ครั้ง | ข้ออักเสบเฉียบพลัน: 1.2 mg แล้ว 0.6 mg 1 ชม.ถัดมา',
    method: 'D&I',
    groups: [
      {
        label: 'การป้องกันเกาต์กำเริบ (Gout Prophylaxis)',
        rules: [
          [30, G, 'CrCl 30–80', 'ไม่ต้องปรับขนาดยา แต่ให้ตรวจติดตามพิษของยาอย่างใกล้ชิด'],
          [0, 30, 'CrCl < 30', 'เริ่มต้น 0.3 mg/วัน หากปรับเพิ่มต้องติดตามอย่างระมัดระวัง'],
        ],
      },
      {
        label: 'การรักษาข้ออักเสบเฉียบพลัน (Gout Flare Treatment)',
        rules: [
          [30, G, 'CrCl 30–80', 'ไม่ต้องปรับขนาดยา'],
          [0, 30, 'CrCl < 30', 'ไม่จำเป็นต้องลดขนาดต่อครั้ง แต่ห้ามให้คอร์สซ้ำบ่อยกว่าทุก 2 สัปดาห์'],
        ],
        hd: 'Hemodialysis: ข้ออักเสบเฉียบพลันให้ 0.6 mg ครั้งเดียว ห้ามให้ซ้ำภายใน 14 วัน',
      },
    ],
  },

  // 27. Dapsone
  {
    name: 'Dapsone',
    thaiName: 'แดปโซน',
    drugClass: 'Sulfone Antibacterial',
    normalDose: '25–100 mg รับประทานวันละครั้ง',
    rules: [
      [0, G, 'ทุกระดับการทำงานของไต', 'ไม่ต้องปรับขนาดยา (No dosage adjustment required)'],
    ],
    hd: 'Hemodialysis (PCP prophylaxis): 50 mg วันละ 2 ครั้ง โดยให้อย่างน้อย 1 ขนาดหลังฟอกเลือด',
  },

  // 28. Diclofenac
  {
    name: 'Diclofenac',
    thaiName: 'ไดโคลฟีแนก',
    drugClass: 'NSAID',
    normalDose: 'IV: 37.5 mg ทุก 6 ชม. (max 150 mg/day) | Oral: 50 mg วันละ 2–3 ครั้ง',
    rules: [
      [50, G, 'CrCl ≥ 50', 'ใช้ตามขนาดปกติด้วยความระมัดระวัง'],
      [10, 50, 'CrCl 10–49', 'ไม่แนะนำให้ใช้ยาฉีด (IV formulation not recommended) และห้ามใช้ในผู้ป่วยที่เสี่ยงต่อภาวะขาดน้ำ'],
      [0, 10, 'CrCl < 10', 'ห้ามใช้ (Contraindicated) ในผู้ป่วยไตวายขั้นรุนแรง'],
    ],
    note: 'NSAIDs อาจทำให้ไตวายเฉียบพลันและบวมน้ำ ควรหลีกเลี่ยงในโรคไตเรื้อรัง',
  },

  // 29. Digoxin
  {
    name: 'Digoxin',
    thaiName: 'ดิจอกซิน',
    drugClass: 'Cardiac glycoside',
    normalDose: 'Maintenance: 0.125–0.375 mg IV/Oral วันละครั้ง',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม eGFR / CrCl',
        rules: [
          [50.1, G, 'eGFR > 50', 'ขนาดยาปกติ ไม่ต้องปรับขนาด'],
          [10, 50.1, 'eGFR 10–50', '0.0625 mg ทุก 24–36 ชม. (หรือ 25–75% ของขนาดปกติ)'],
          [0, 10, 'eGFR < 10 (ESRD)', '0.0625 mg ทุก 48 ชม. (หรือลดขนาดลง 50%)'],
        ],
        hd: 'Hemodialysis / CAPD: 0.0625 mg ทุก 48 ชม. (10–25% ของขนาดปกติ)',
      },
    ],
    note: 'ช่วงการรักษาแคบมาก (Narrow therapeutic index) ต้องติดตามระดับยาและภาวะโพแทสเซียมในเลือด',
  },

  // 30. Enalapril
  {
    name: 'Enalapril',
    thaiName: 'อีนาราพริล',
    drugClass: 'ACE Inhibitor',
    normalDose: 'ความดันโลหิตสูง: 5–40 mg OD | หัวใจล้มเหลว: เริ่ม 2.5 mg BID, maintenance 2.5–20 mg BID',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30.1, G, 'CrCl > 30', 'ไม่ต้องปรับขนาดยา ใช้ขนาดปกติได้'],
          [0, 30.1, 'CrCl ≤ 30', 'เริ่มต้น 2.5 mg/วัน ค่อยๆ ปรับเพิ่มอย่างระมัดระวังจนคุมความดันได้'],
        ],
        hd: 'Hemodialysis: เริ่ม 2.5 mg ในวันที่ฟอกไต ปรับขนาดยาในวันที่ไม่ฟอกตามการตอบสนองของความดัน',
        pd: 'Peritoneal dialysis: ไม่จำเป็นต้องให้ขนาดเสริม',
      },
    ],
  },

  // 31. Enoxaparin
  {
    name: 'Enoxaparin',
    thaiName: 'อีน็อกซาพาริน (LMWH)',
    drugClass: 'Low Molecular Weight Heparin',
    normalDose: 'DVT Treatment: 1 mg/kg SC q 12h | DVT Prophylaxis: 40 mg SC OD',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30, G, 'CrCl ≥ 30', 'ไม่ต้องปรับขนาดยา ใช้ขนาดปกติได้'],
          [0, 30, 'CrCl < 30', 'DVT Prophylaxis: SC 30 mg วันละครั้ง | DVT Treatment: SC 1 mg/kg วันละครั้ง | STEMI: <75 ปี ให้ 30 mg IV stat + 1 mg/kg SC วันละครั้ง'],
        ],
        hd: 'Hemodialysis: ยังไม่ได้รับการรับรองจาก US-FDA สำหรับผู้ป่วยฟอกเลือด ควรพิจารณาใช้ Unfractionated Heparin (UFH) แทน',
      },
    ],
  },

  // 32. Ertapenem
  {
    name: 'Ertapenem',
    thaiName: 'เออร์ตาพีเนม',
    drugClass: 'Carbapenem',
    normalDose: '1 g IV/IM วันละครั้ง (OD)',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30.1, G, 'CrCl > 30', 'ไม่ต้องปรับขนาดยา 1 g วันละครั้ง'],
          [0, 30.1, 'CrCl ≤ 30', '500 mg วันละครั้ง (ESRD: 500 mg/วัน)'],
        ],
        hd: 'Hemodialysis: 500 mg IV ทุก 24 ชม.; ให้ขนาดเสริม 150 mg หลังฟอกเลือด หากได้รับยาขนาดสุดท้ายภายใน 6 ชม. ก่อนฟอก',
        pd: 'CAPD: 500 mg IV วันละครั้ง',
      },
    ],
  },

  // 33. Fenofibrate
  {
    name: 'Fenofibrate (Supralip NT)',
    thaiName: 'ฟีโนไฟเบรต',
    drugClass: 'Fibrate (ยาลดไขมัน)',
    normalDose: '145 mg รับประทานวันละครั้ง',
    rules: [
      [50, G, 'CrCl ≥ 50', 'ขนาดยาปกติ 145 mg วันละครั้ง'],
      [15, 50, 'CrCl 15–49', 'จำเป็นต้องปรับลดขนาดยาลง'],
      [0, 15, 'CrCl < 15', 'ห้ามใช้ (Contraindicated) ในภาวะไตวายรุนแรง'],
    ],
  },

  // 34. Fentanyl
  {
    name: 'Fentanyl',
    thaiName: 'เฟนทานิล',
    drugClass: 'Opioid Analgesic',
    normalDose: 'ตามอาการและข้อบ่งใช้ทางคลินิก',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม eGFR',
        rules: [
          [50.1, G, 'eGFR > 50', '100% ของขนาดปกติ'],
          [10, 50.1, 'eGFR 10–50', '75% ของขนาดปกติ'],
          [0, 10, 'eGFR < 10', '50% ของขนาดปกติ ใช้ด้วยความระมัดระวัง'],
        ],
      },
    ],
  },

  // 35. Fluconazole
  {
    name: 'Fluconazole',
    thaiName: 'ฟลูโคนาโซล',
    drugClass: 'Antifungal',
    normalDose: 'Single dose 150 mg หรือ Loading 200–800 mg แล้วตามด้วย 200–800 mg/วัน',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl (Multiple dosing)',
        rules: [
          [50.1, G, 'CrCl > 50', '100% ของขนาดปกติ (ไม่ต้องปรับขนาด)'],
          [0, 50.1, 'CrCl ≤ 50', 'ให้ Loading dose 50–400 mg ในวันแรก แล้วปรับเป็น 50% ของขนาดปกติในวันถัดไป'],
        ],
        hd: 'Hemodialysis: ให้ 100% หลังฟอกเลือดแต่ละครั้ง ในวันที่ไม่ฟอกให้ลดขนาดตาม CrCl',
      },
    ],
  },

  // 36. Fexofenadine
  {
    name: 'Fexofenadine',
    thaiName: 'เฟกโซเฟนาดีน (Telfast)',
    drugClass: 'Antihistamine',
    normalDose: '60 mg วันละ 2 ครั้ง หรือ 180 mg วันละครั้ง',
    rules: [
      [80, G, 'eGFR ≥ 80', 'ขนาดยาปกติ 60 mg วันละ 2 ครั้ง'],
      [0, 80, 'eGFR < 80', '60 mg รับประทานวันละครั้ง (OD)'],
    ],
  },

  // 37. Fosfomycin
  {
    name: 'Fosfomycin (IV)',
    thaiName: 'ฟอสโฟมัยซิน (ฉีด)',
    drugClass: 'Antibacterial',
    normalDose: '2–4 g ทุก 8–12 ชม.',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [80, G, 'CrCl ≥ 80', '2–4 g ทุก 8–12 ชม.'],
          [40, 80, 'CrCl 40–79', '1–2 g ทุก 8–12 ชม.'],
          [20, 40, 'CrCl 20–39', '500 mg – 1 g ทุก 8–12 ชม.'],
          [0, 20, 'CrCl < 20', 'ปรับตามการฟอกไตและการกำจัดของยา'],
        ],
      },
    ],
  },

  // 38. Furosemide
  {
    name: 'Furosemide',
    thaiName: 'ฟูโรซีไมด์ (ยาขับปัสสาวะ)',
    drugClass: 'Loop Diuretic',
    normalDose: '20–80 mg IV/Oral, สูงสุดในภาวะไตวาย 1,500–2,000 mg/วัน',
    rules: [
      [0, G, 'ทุกระดับการทำงานของไต', 'ในภาวะไตวายรุนแรง อาจใช้ขนาดสูงถึง 3,200 mg/วัน (อัตราหยด < 500 mg/ชม.) หาก SCr > 5 อัตราหยด < 4 mg/นาที หลีกเลี่ยงในภาวะปัสสาวะไม่ออก (Oliguria/Anuria)'],
    ],
    hd: 'Hemodialysis / PD: ไม่จำเป็นต้องให้ขนาดเสริม',
  },

  // 39. Gabapentin
  {
    name: 'Gabapentin',
    thaiName: 'กาบาเพนติน',
    drugClass: 'Anticonvulsant / Neuropathic Pain',
    normalDose: '300–3,600 mg/วัน แบ่งรับประทาน 3 ครั้ง',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [60, G, 'CrCl ≥ 60', '300–1,200 mg วันละ 3 ครั้ง'],
          [30, 60, 'CrCl 30–59', '200–700 mg วันละ 2 ครั้ง'],
          [15, 30, 'CrCl 15–29', '200–700 mg วันละครั้ง'],
          [15, 15.1, 'CrCl = 15', '100–300 mg วันละครั้ง'],
          [0, 15, 'CrCl < 15', 'ลดขนาดยาตามสัดส่วนของ CrCl เช่น CrCl 7.5 ให้ลดขนาดลงครึ่งหนึ่ง (50–150 mg/วัน)'],
        ],
        hd: 'Hemodialysis: ให้ยาตาม CrCl และให้ขนาดเสริม 125–350 mg หลังฟอกเลือดทุก 4 ชม.',
      },
    ],
  },

  // 40. Ganciclovir
  {
    name: 'Ganciclovir',
    thaiName: 'แกนไซโคลเวียร์',
    drugClass: 'Antiviral (CMV)',
    normalDose: 'Induction: 5 mg/kg IV ทุก 12 ชม. | Maintenance: 5 mg/kg IV วันละครั้ง',
    method: 'D&I',
    groups: [
      {
        label: 'Induction Phase',
        rules: [
          [70, G, 'CrCl ≥ 70', '5 mg/kg ทุก 12 ชม.'],
          [50, 70, 'CrCl 50–69', '2.5 mg/kg ทุก 12 ชม.'],
          [25, 50, 'CrCl 25–49', '2.5 mg/kg ทุก 24 ชม.'],
          [10, 25, 'CrCl 10–24', '1.25 mg/kg ทุก 24 ชม.'],
          [0, 10, 'CrCl < 10', '1.25 mg/kg สัปดาห์ละ 3 ครั้ง หลังฟอกไต'],
        ],
        hd: 'Hemodialysis: 1.25 mg/kg ทุก 48–72 ชม. ให้หลังฟอกเลือด',
      },
      {
        label: 'Maintenance Phase',
        rules: [
          [70, G, 'CrCl ≥ 70', '5 mg/kg ทุก 24 ชม.'],
          [50, 70, 'CrCl 50–69', '2.5 mg/kg ทุก 24 ชม.'],
          [25, 50, 'CrCl 25–49', '1.25 mg/kg ทุก 24 ชม.'],
          [10, 25, 'CrCl 10–24', '0.625 mg/kg ทุก 24 ชม.'],
          [0, 10, 'CrCl < 10', '0.625 mg/kg สัปดาห์ละ 3 ครั้ง หลังฟอกไต'],
        ],
      },
    ],
  },

  // 41. Gemfibrozil
  {
    name: 'Gemfibrozil',
    thaiName: 'เจมไฟโบรซิล',
    drugClass: 'Fibrate (ยาลดไขมัน)',
    normalDose: '600 mg รับประทานวันละ 2 ครั้ง ก่อนอาหาร 30 นาที',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [31, G, 'CrCl 31–80', 'ใช้ด้วยความระมัดระวัง'],
          [0, 31, 'CrCl < 30', 'ห้ามใช้ (Contraindicated) เสี่ยงเกิด Rhabdomyolysis'],
        ],
        hd: 'Hemodialysis: ไม่จำเป็นต้องให้ขนาดเสริม',
      },
    ],
  },

  // 42. Gentamicin
  {
    name: 'Gentamicin',
    thaiName: 'เจนตาไมซิน',
    drugClass: 'Aminoglycoside',
    normalDose: '4–7 mg/kg ทุก 24 ชม. (Once-daily) หรือ 1.5–2 mg/kg ทุก 8 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl (Extended-interval)',
        rules: [
          [60, G, 'CrCl ≥ 60', '4–7 mg/kg ทุก 24 ชม.'],
          [40, 60, 'CrCl 40–59', '4–7 mg/kg ทุก 36 ชม.'],
          [30, 40, 'CrCl 30–39', '4–7 mg/kg ทุก 48 ชม.'],
          [0, 30, 'CrCl < 30', 'ไม่แนะนำในรูปแบบ Once-daily ให้ใช้การปรับตามระดับยา (TDM)'],
        ],
        hd: 'Hemodialysis: โหลด 2–3 mg/kg ตามด้วย 1–1.5 mg/kg ทุก 48–72 ชม. หลังฟอกเลือด',
      },
    ],
  },

  // 43. Hydralazine
  {
    name: 'Hydralazine',
    thaiName: 'ไฮดราลาซีน',
    drugClass: 'Vasodilator (ลดความดัน)',
    normalDose: '25–50 mg วันละ 3–4 ครั้ง',
    method: 'I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม eGFR',
        rules: [
          [10, G, 'eGFR ≥ 10', '25–50 mg ทุก 8 ชม.'],
          [0, 10, 'eGFR < 10', '25–50 mg ทุก 8–16 ชม.'],
        ],
        hd: 'Hemodialysis: ให้ยาหลังการฟอกเลือด',
        pd: 'Peritoneal dialysis: ทุก 8–16 ชม.',
      },
    ],
  },

  // 44. Imipenem + Cilastatin
  {
    name: 'Imipenem + Cilastatin',
    thaiName: 'อิมิพีเนม + ไซลาสตาติน',
    drugClass: 'Carbapenem',
    normalDose: '500 mg ทุก 6 ชม. หรือ 1,000 mg ทุก 8 ชม. (สูงสุด 4 g/วัน)',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl (สำหรับขนาดปกติ 500 mg q 6h)',
        rules: [
          [71, G, 'CrCl ≥ 71', '500 mg ทุก 6 ชม.'],
          [41, 71, 'CrCl 41–70', '500 mg ทุก 8 ชม.'],
          [21, 41, 'CrCl 21–40', '250 mg ทุก 6 ชม. (หรือ 500 mg ทุก 12 ชม.)'],
          [6, 21, 'CrCl 6–20', '250 mg ทุก 12 ชม.'],
          [0, 6, 'CrCl < 6', 'ไม่แนะนำให้ใช้ ยกเว้นผู้ป่วยได้รับการฟอกไต'],
        ],
        hd: 'Hemodialysis: 250 mg ทุก 12 ชม. + 250 mg เสริมหลังฟอกไต',
      },
    ],
    note: 'ระวังอาการชัก (Seizure) โดยเฉพาะในผู้ป่วยไตบกพร่องที่ได้รับยาขนาดสูง',
  },

  // 45. Kanamycin
  {
    name: 'Kanamycin',
    thaiName: 'คานามัยซิน',
    drugClass: 'Aminoglycoside',
    normalDose: '15 mg/kg รับประทาน/ฉีด วันละครั้ง',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [80, G, 'CrCl > 80', '15 mg/kg/วัน'],
          [60, 80, 'CrCl 60–80', '12 mg/kg/วัน'],
          [40, 60, 'CrCl 40–60', '7.5 mg/kg/วัน'],
          [30, 40, 'CrCl 30–40', '4 mg/kg/วัน'],
          [20, 30, 'CrCl 20–30', '7.5 mg/kg ทุก 48 ชม.'],
          [10, 20, 'CrCl 10–20', '4 mg/kg ทุก 48 ชม.'],
          [0, 10, 'CrCl < 10', '3 mg/kg ทุก 72 ชม.'],
        ],
        hd: 'Hemodialysis: 50% ของขนาดปกติหลังฟอกไต',
        pd: 'Peritoneal dialysis: 15–20 mg/L ในน้ำยาฟอกไต',
      },
    ],
  },

  // 46. Ketorolac
  {
    name: 'Ketorolac',
    thaiName: 'คีโตโรแลก',
    drugClass: 'NSAID (ยาแก้ปวดรุนแรง)',
    normalDose: 'IM: 30–60 mg ทุก 6 ชม. | IV: 15–30 mg ทุก 6 ชม. (max 120 mg/day)',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30.1, G, 'CrCl > 30', 'IM: 30 mg single หรือ 15 mg q 6h (max 60 mg/day) | IV: 15 mg single หรือ 15 mg q 6h (max 60 mg/day)'],
          [0, 30.1, 'CrCl ≤ 30', 'ห้ามใช้ (Contraindicated) เสี่ยงไตวายเฉียบพลัน'],
        ],
      },
    ],
    note: 'ห้ามใช้ติดต่อกันเกิน 5 วัน และห้ามใช้ในผู้ป่วยที่มีความเสี่ยงไตวายจากภาวะขาดน้ำ',
  },

  // 47. Lamivudine
  {
    name: 'Lamivudine (3TC)',
    thaiName: 'ลามิวูดีน',
    drugClass: 'Antiretroviral',
    normalDose: 'HIV-1: 150 mg วันละ 2 ครั้ง หรือ 300 mg วันละครั้ง | HBV: 100 mg วันละครั้ง',
    method: 'D&I',
    groups: [
      {
        label: 'กรณีรักษา HIV-1 (ขนาดปกติ 300 mg/วัน)',
        rules: [
          [50, G, 'CrCl ≥ 50', '300 mg วันละครั้ง (หรือ 150 mg วันละ 2 ครั้ง)'],
          [30, 50, 'CrCl 30–49', '150 mg วันละครั้ง'],
          [15, 30, 'CrCl 15–29', 'วันแรก 150 mg จากนั้น 100 mg วันละครั้ง'],
          [5, 15, 'CrCl 5–14', 'วันแรก 150 mg จากนั้น 50 mg วันละครั้ง'],
          [0, 5, 'CrCl < 5', 'วันแรก 50 mg จากนั้น 25 mg วันละครั้ง'],
        ],
        hd: 'Hemodialysis / PD: ไม่ต้องให้ขนาดยาเสริม',
      },
    ],
  },

  // 48. Levetiracetam
  {
    name: 'Levetiracetam',
    thaiName: 'เลเวทิราซีแทม (Keppra)',
    drugClass: 'Anticonvulsant (ยากันชัก)',
    normalDose: '500–1,500 mg รับประทาน/IV ทุก 12 ชม.',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [80, G, 'CrCl > 80', '500–1,500 mg ทุก 12 ชม.'],
          [50, 80, 'CrCl 50–80', '500–1,000 mg ทุก 12 ชม.'],
          [30, 50, 'CrCl 30–50', '250–750 mg ทุก 12 ชม.'],
          [0, 30, 'CrCl < 30', '250–500 mg ทุก 12 ชม.'],
        ],
        hd: 'Hemodialysis: 500–1,000 mg ทุก 24 ชม. เสริม 250–500 mg หลังฟอกเลือด',
        pd: 'Peritoneal dialysis: 500–1,000 mg ทุก 24 ชม.',
      },
    ],
  },

  // 49. Levofloxacin
  {
    name: 'Levofloxacin',
    thaiName: 'เลโวฟลอกซาซิน',
    drugClass: 'Fluoroquinolone',
    normalDose: '250–750 mg IV/Oral วันละครั้ง',
    method: 'D&I',
    groups: [
      {
        label: 'กรณีขนาดปกติ 500 mg วันละครั้ง',
        rules: [
          [50, G, 'CrCl ≥ 50', '500 mg ทุก 24 ชม.'],
          [20, 50, 'CrCl 20–49', 'เริ่ม 500 mg แล้วตามด้วย 250 mg ทุก 24 ชม.'],
          [10, 20, 'CrCl 10–19', 'เริ่ม 500 mg แล้วตามด้วย 250 mg ทุก 48 ชม.'],
          [0, 10, 'CrCl < 10', 'เริ่ม 500 mg แล้วตามด้วย 250 mg ทุก 48 ชม.'],
        ],
        hd: 'Hemodialysis: เริ่ม 500 mg แล้วตามด้วย 250 mg ทุก 48 ชม. ให้หลังฟอกไต',
      },
      {
        label: 'กรณีขนาดปกติ 750 mg วันละครั้ง',
        rules: [
          [50, G, 'CrCl ≥ 50', '750 mg ทุก 24 ชม.'],
          [20, 50, 'CrCl 20–49', '750 mg ทุก 48 ชม.'],
          [10, 20, 'CrCl 10–19', 'เริ่ม 750 mg แล้วตามด้วย 500 mg ทุก 48 ชม.'],
          [0, 10, 'CrCl < 10', 'เริ่ม 750 mg แล้วตามด้วย 500 mg ทุก 48 ชม.'],
        ],
      },
    ],
  },

  // 50. Lincomycin
  {
    name: 'Lincomycin',
    thaiName: 'ลิงโคไมซิน',
    drugClass: 'Lincosamide',
    normalDose: '600–1,000 mg IV ทุก 8–12 ชม.',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30, G, 'CrCl ≥ 30', 'ขนาดยาปกติ 600–1,000 mg ทุก 8–12 ชม.'],
          [0, 30, 'CrCl < 30 (Severe renal impairment)', '25%–30% ของขนาดปกติ'],
        ],
      },
    ],
  },

  // 51. Lithium carbonate
  {
    name: 'Lithium carbonate',
    thaiName: 'ลิเทียม คาร์บอเนต',
    drugClass: 'Mood Stabilizer',
    normalDose: '600–1,800 mg/วัน แบ่ง 2–3 ครั้ง',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [50.1, G, 'CrCl > 50', '100% ของขนาดปกติ'],
          [10, 50.1, 'CrCl 10–50', '50–75% ของขนาดปกติ'],
          [0, 10, 'CrCl < 10', '25–50% ของขนาดปกติ'],
        ],
        hd: 'Hemodialysis: 100% หลังฟอกเลือด (ถูกขจัดออกได้ดีมากด้วยการฟอกไต)',
      },
    ],
  },

  // 52. Loratadine
  {
    name: 'Loratadine',
    thaiName: 'ลอราทาดีน',
    drugClass: 'Antihistamine',
    normalDose: '10 mg วันละครั้ง หรือ 5 mg วันละ 2 ครั้ง',
    method: 'I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม eGFR',
        rules: [
          [50, G, 'eGFR ≥ 50', '10 mg ทุก 24 ชม.'],
          [10, 50, 'eGFR 10–49', '10 mg ทุก 24–48 ชม.'],
          [0, 10, 'eGFR < 10', '10 mg ทุก 48 ชม.'],
        ],
        hd: 'Dialysis: 10 mg ทุก 48 ชม.',
      },
    ],
  },

  // 53. Magnesium sulfate
  {
    name: 'Magnesium sulfate',
    thaiName: 'แมกนีเซียม ซัลเฟต',
    drugClass: 'Electrolyte',
    normalDose: '1–4 g IV หยดช้าๆ ≤ 1 g/ชม.',
    method: 'D',
    groups: [
      {
        label: 'ข้อควรระวังในผู้ป่วยไตบกพร่อง',
        rules: [
          [30, G, 'CrCl ≥ 30', 'ใช้ตามขนาดปกติ ติดตามระดับ Mg ในเลือด'],
          [0, 30, 'CrCl < 30', 'ไตวายรุนแรง: ขนาดสูงสุดไม่เกิน 20 g ใน 48 ชม. (หรือลดขนาดลง 50%) ติดตามสัญญาณชีพและ deep tendon reflexes อย่างใกล้ชิด'],
        ],
      },
    ],
  },

  // 54. Meropenem
  {
    name: 'Meropenem',
    thaiName: 'เมโรพีเนม',
    drugClass: 'Carbapenem',
    normalDose: '1–2 g IV ทุก 8 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'กรณีขนาดปกติ 1 g ทุก 8 ชม.',
        rules: [
          [50.1, G, 'CrCl > 50', '1 g ทุก 8 ชม.'],
          [26, 50.1, 'CrCl 26–50', '1 g ทุก 12 ชม.'],
          [10, 26, 'CrCl 10–25', '500 mg ทุก 12 ชม.'],
          [0, 10, 'CrCl < 10', '500 mg ทุก 24 ชม.'],
        ],
        hd: 'Hemodialysis: 500 mg ทุก 24 ชม. (ให้หลังฟอกเลือด)',
        pd: 'Peritoneal dialysis: 100% ทุก 24 ชม.',
      },
      {
        label: 'กรณีขนาดปกติ 2 g ทุก 8 ชม. (Severe / Meningitis)',
        rules: [
          [50.1, G, 'CrCl > 50', '2 g ทุก 8 ชม.'],
          [26, 50.1, 'CrCl 26–50', '1 g ทุก 8 ชม.'],
          [10, 26, 'CrCl 10–25', '1 g ทุก 12 ชม.'],
          [0, 10, 'CrCl < 10', '1 g ทุก 24 ชม.'],
        ],
      },
    ],
  },

  // 55. Metoclopramide
  {
    name: 'Metoclopramide',
    thaiName: 'เมโทโคลพราไมด์ (Plasil)',
    drugClass: 'Antiemetic / Prokinetic',
    normalDose: '10–20 mg IV ทุก 4–6 ชม.',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [40, G, 'CrCl ≥ 40', '100% ของขนาดปกติ'],
          [0, 40, 'CrCl < 40', '50% ของขนาดปกติ (เสี่ยงต่อ Extrapyramidal symptoms)'],
        ],
      },
    ],
  },

  // 56. Metronidazole
  {
    name: 'Metronidazole',
    thaiName: 'เมโทรนิดาโซล',
    drugClass: 'Nitroimidazole',
    normalDose: '500 mg ทุก 6–8 ชม. (สูงสุด 4 g/วัน)',
    rules: [
      [10, G, 'CrCl ≥ 10', '500 mg ทุก 6–8 ชม. (ไม่ต้องปรับขนาด)'],
      [0, 10, 'CrCl < 10', '500 mg ทุก 12 ชม. (หรือลดขนาดลง 50%)'],
    ],
    hd: 'Hemodialysis: ให้ยาเสริมหลังการฟอกเลือด หากไม่สามารถแยกเวลาบริหารยาได้',
    pd: 'Peritoneal dialysis: ไม่จำเป็นต้องปรับขนาดยา',
  },

  // 57. Midazolam
  {
    name: 'Midazolam',
    thaiName: 'ไมดาโซแลม',
    drugClass: 'Benzodiazepine',
    normalDose: 'ตามข้อบ่งใช้และการระงับความรู้สึก',
    method: 'D',
    rules: [
      [10, G, 'CrCl ≥ 10', 'ขนาดปกติ ไตเตรทตามการตอบสนอง'],
      [0, 10, 'CrCl < 10', 'ลดขนาดยาลง 50%'],
    ],
  },

  // 58. Mitomycin C
  {
    name: 'Mitomycin C',
    thaiName: 'ไมโตไมซิน ซี',
    drugClass: 'Antineoplastic',
    normalDose: 'ตามโปรโตคอลเคมีบำบัด',
    method: 'D',
    rules: [
      [50.1, G, 'CrCl > 50', '100% ของขนาดปกติ'],
      [10, 50.1, 'CrCl 10–50', '100% ของขนาดปกติ'],
      [0, 10, 'CrCl < 10', '75% ของขนาดปกติ (หาก SCr > 1.7 ให้หลีกเลี่ยงการใช้)'],
    ],
  },

  // 59. Morphine sulfate
  {
    name: 'Morphine sulfate',
    thaiName: 'มอร์ฟีน ซัลเฟต',
    drugClass: 'Opioid Analgesic',
    normalDose: 'Opioid naive: 2.5–5 mg IV ทุก 3–4 ชม.',
    method: 'D',
    rules: [
      [50, G, 'eGFR ≥ 50', 'ขนาดปกติ ค่อยๆ ปรับเพิ่มอย่างระมัดระวัง'],
      [25, 50, 'eGFR 25–49', '75% ของขนาดปกติ'],
      [10, 25, 'eGFR 10–24', '50% ของขนาดปกติ'],
      [0, 10, 'eGFR < 10', 'ลดขนาดยาลงอย่างมาก หรือยืดระยะห่างเป็นทุก 6–8 ชม.'],
    ],
    note: 'Active metabolite (M6G) ขับทางไตและสะสม ทำให้เกิดภาวะกดการหายใจได้',
  },

  // 60. Neostigmine
  {
    name: 'Neostigmine',
    thaiName: 'นีโอสติกมีน',
    drugClass: 'Cholinesterase Inhibitor',
    normalDose: 'ตามข้อบ่งใช้',
    method: 'D',
    rules: [
      [50.1, G, 'CrCl > 50', '100% ของขนาดปกติ'],
      [10, 50.1, 'CrCl 10–50', '50% ของขนาดปกติ'],
      [0, 10, 'CrCl < 10', '25% ของขนาดปกติ'],
    ],
  },

  // 61. Octreotide
  {
    name: 'Octreotide',
    thaiName: 'ออกทรีโอไทด์',
    drugClass: 'Somatostatin analogue',
    normalDose: 'Bleeding esophageal varices: 50 mcg IV bolus, then 50 mcg/hr IV infusion 2–5 วัน',
    rules: [
      [10, G, 'CrCl > 10', 'ไม่ต้องปรับขนาดยา'],
      [0, 10, 'CrCl ≤ 10 / Dialysis', 'ควรปรับลดขนาดยาลงประมาณ 50% เนื่องจาก Clearance ลดลง'],
    ],
  },

  // 62. Oxytetracycline
  {
    name: 'Oxytetracycline',
    thaiName: 'ออกซีเตตราไซคลิน',
    drugClass: 'Tetracycline',
    normalDose: '250–500 mg IV ทุก 12 ชม.',
    method: 'I',
    rules: [
      [50, G, 'eGFR > 50', 'ให้ทุก 8–12 ชม.'],
      [10, 50, 'eGFR 10–50', 'ให้ทุก 12–24 ชม.'],
      [0, 10, 'eGFR < 10', 'ควรหลีกเลี่ยงการใช้ (หรือให้ทุก 24 ชม.)'],
    ],
  },

  // 63. Oseltamivir
  {
    name: 'Oseltamivir (Oral)',
    thaiName: 'โอเซลทามิเวียร์ (Tamiflu)',
    drugClass: 'Antiviral (ไข้หวัดใหญ่)',
    normalDose: 'รักษา: 75 mg วันละ 2 ครั้ง นาน 5 วัน | ป้องกัน: 75 mg วันละครั้ง นาน 7–10 วัน',
    method: 'D&I',
    groups: [
      {
        label: 'การรักษาไข้หวัดใหญ่ (Treatment of Influenza)',
        rules: [
          [60.1, G, 'CrCl > 60', '75 mg วันละ 2 ครั้ง นาน 5 วัน'],
          [30, 60.1, 'CrCl 30–60', '30 mg วันละ 2 ครั้ง นาน 5 วัน'],
          [10, 30, 'CrCl 10–30', '30 mg วันละครั้ง นาน 5 วัน'],
          [0, 10, 'CrCl < 10', 'ไม่แนะนำให้ใช้ (ยกเว้นฟอกเลือด)'],
        ],
        hd: 'ESRD on HD: 30 mg หลังฟอกเลือดแต่ละรอบ ไม่เกิน 5 วัน',
        pd: 'CAPD: 30 mg ครั้งเดียวทันทีหลังเปลี่ยนถ่ายน้ำยา',
      },
      {
        label: 'การป้องกันไข้หวัดใหญ่ (Prophylaxis of Influenza)',
        rules: [
          [60.1, G, 'CrCl > 60', '75 mg วันละครั้ง'],
          [30, 60.1, 'CrCl 30–60', '30 mg วันละครั้ง'],
          [10, 30, 'CrCl 10–30', '30 mg วันเว้นวัน'],
          [0, 10, 'CrCl < 10', 'ไม่แนะนำให้ใช้'],
        ],
        hd: 'ESRD on HD: 30 mg หลังฟอกเลือดรอบเว้นรอบ',
        pd: 'CAPD: 30 mg สัปดาห์ละครั้งหลังเปลี่ยนถ่ายน้ำยา',
      },
    ],
  },

  // 64. Paracetamol
  {
    name: 'Paracetamol',
    thaiName: 'พาราเซตามอล',
    drugClass: 'Analgesic / Antipyretic',
    normalDose: 'BW ≥ 50 kg: 500–1,000 mg ทุก 4–6 ชม. (max 4 g/day) | BW < 50 kg: 10–15 mg/kg ทุก 4–6 ชม.',
    method: 'D&I',
    rules: [
      [30.1, G, 'CrCl > 30', 'ขนาดยาปกติ ไม่ต้องปรับขนาด'],
      [0, 30.1, 'CrCl ≤ 30', 'ใช้ด้วยความระมัดระวัง พิจารณาลดขนาดรวมต่อวัน และขยายระยะห่างการให้ยาเป็นทุก 6–8 ชม.'],
    ],
  },

  // 65. Pethidine
  {
    name: 'Pethidine (Meperidine)',
    thaiName: 'เพทิดีน',
    drugClass: 'Opioid Analgesic',
    normalDose: '50–100 mg IM/IV ทุก 3–4 ชม.',
    method: 'D',
    rules: [
      [50, G, 'CrCl ≥ 50', 'ใช้ด้วยความระมัดระวัง'],
      [10, 50, 'CrCl 10–49', '75% ของขนาดปกติ'],
      [0, 10, 'CrCl < 10', '50% ของขนาดปกติ หรือควรหลีกเลี่ยงการใช้ (Avoid use)'],
    ],
    note: 'Nor-pethidine metabolite สะสมในไตวาย ทำให้เกิดอาการชักและสับสนรุนแรง',
  },

  // 66. Phenobarbital
  {
    name: 'Phenobarbital',
    thaiName: 'ฟีโนบาร์บิทัล',
    drugClass: 'Barbiturate Anticonvulsant',
    normalDose: 'ตามข้อบ่งใช้',
    method: 'I',
    rules: [
      [10, G, 'CrCl/eGFR ≥ 10', 'ไม่ต้องปรับขนาดยา'],
      [0, 10, 'CrCl/eGFR < 10', 'ให้ยาทุก 12–16 ชม.'],
    ],
    hd: 'Hemodialysis: ให้ยาก่อนฟอกไต และเสริม 50% ของขนาดปกติหลังฟอกไต',
    pd: 'Peritoneal dialysis: 50% ของขนาดปกติ',
  },

  // 67. Phenytoin
  {
    name: 'Phenytoin',
    thaiName: 'ฟีนิโทอิน',
    drugClass: 'Anticonvulsant',
    normalDose: 'Loading 10–15 mg/kg IV, Maintenance 100 mg ทุก 6–8 ชม.',
    rules: [
      [0, G, 'ทุกระดับการทำงานของไต', 'ระดับยาในเลือดรวมอาจตีความยากในภาวะไตวายเนื่องจากการจับโปรตีนลดลง แนะนำให้ตรวจติดตาม Free (Unbound) Phenytoin concentration'],
    ],
  },

  // 68. Piperacillin + Tazobactam
  {
    name: 'Piperacillin + Tazobactam',
    thaiName: 'ไพเพอราซิลลิน + ทาโซแบคแทม (Tazocin)',
    drugClass: 'Antipseudomonal Penicillin + β-lactamase inhibitor',
    normalDose: '3.375 g IV ทุก 6 ชม. หรือ 4.5 g IV ทุก 6–8 ชม. (สูงสุด 18 g/วัน)',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [40.1, G, 'CrCl > 40', 'ขนาดยาปกติ 3.375–4.5 g ทุก 6–8 ชม.'],
          [20, 40.1, 'CrCl 20–40', '2.25 g ทุก 6 ชม. (ปอดอักเสบในรพ. 3.375 g ทุก 6 ชม.)'],
          [0, 20, 'CrCl < 20', '2.25 g ทุก 8 ชม. (ปอดอักเสบในรพ. 2.25 g ทุก 6 ชม.)'],
        ],
        hd: 'Hemodialysis: 2.25 g ทุก 12 ชม. (ปอดอักเสบ 2.25 g ทุก 8 ชม.) ให้หลังฟอกไต หรือเสริม 0.75 g หลังฟอกไต',
        pd: 'Peritoneal dialysis: 2.25 g ทุก 12 ชม. (ปอดอักเสบ 2.25 g ทุก 8 ชม.)',
      },
    ],
  },

  // 69. Propranolol
  {
    name: 'Propranolol',
    thaiName: 'โพรพราโนลอล',
    drugClass: 'Non-selective Beta-blocker',
    normalDose: 'ความดันโลหิตสูง 80–240 mg/วัน, หัวใจเต้นผิดจังหวะ 30–160 mg/วัน',
    rules: [
      [40, G, 'eGFR ≥ 40', 'ขนาดปกติ'],
      [10, 40, 'eGFR 10–40', '50% หรือขนาดปกติทุก 24–36 ชม.'],
      [0, 10, 'eGFR < 10', '25% หรือขนาดปกติทุก 40–60 ชม.'],
    ],
  },

  // 70. Pregabalin
  {
    name: 'Pregabalin',
    thaiName: 'พรีการ์บาลิน (Lyrica)',
    drugClass: 'GABA analogue / Neuropathic Pain',
    normalDose: '150–600 mg/วัน แบ่งให้ 2–3 ครั้ง',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [60, G, 'CrCl > 60', '150–600 mg/วัน แบ่ง 2–3 ครั้ง'],
          [30, 60, 'CrCl 30–60', '75–300 mg/วัน แบ่ง 2–3 ครั้ง'],
          [15, 30, 'CrCl 15–30', '25–150 mg/วัน วันละ 1–2 ครั้ง'],
          [0, 15, 'CrCl < 15', '25–75 mg/วัน วันละครั้ง (OD)'],
        ],
        hd: 'Hemodialysis: เสริมหลังฟอกเลือด 25–100 mg ขึ้นกับขนาดเดิมต่อวัน',
      },
    ],
  },

  // 71. Quinine
  {
    name: 'Quinine',
    thaiName: 'ควินิน',
    drugClass: 'Antimalarial',
    normalDose: 'Initial 16.4 mg/kg IV in 4 hr แล้วตามด้วย 8.2 mg/kg ทุก 8 ชม.',
    method: 'D',
    rules: [
      [0, G, 'ทุกระดับการทำงานของไต', 'ในผู้ป่วยไตบกพร่อง ให้ลดขนาด Maintenance dose ลงเหลือ 1 ใน 3 (Reduced threefold)'],
    ],
  },

  // 72. Ranitidine
  {
    name: 'Ranitidine',
    thaiName: 'รานิทิดีน',
    drugClass: 'H2-receptor antagonist',
    normalDose: 'Oral 150 mg BID | IV 50 mg ทุก 6–8 ชม.',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [50, G, 'CrCl ≥ 50', 'ขนาดปกติ'],
          [0, 50, 'CrCl < 50', 'IV: 50 mg ทุก 18–24 ชม. | Oral: 150 mg ทุก 18–24 ชม.'],
        ],
        hd: 'Hemodialysis: ให้ยาหลังการฟอกเลือด',
      },
    ],
  },

  // 73. Risperidone
  {
    name: 'Risperidone',
    thaiName: 'ริสเพอริโดน',
    drugClass: 'Atypical Antipsychotic',
    normalDose: 'ตามข้อบ่งใช้',
    method: 'D',
    rules: [
      [30, G, 'CrCl ≥ 30', 'พิจารณาลดขนาดยาลงตามสภาพไต'],
      [0, 30, 'CrCl < 30', 'เริ่มต้น 0.5 mg วันละ 2 ครั้ง ค่อยๆ ปรับเพิ่มไม่เกิน 0.5 mg BID สัปดาห์ละครั้ง (จำกัดขนาดเริ่ม 1 mg/วัน เพื่อลดความเสี่ยงความดันตกวูบ)'],
    ],
  },

  // 74. Rosuvastatin
  {
    name: 'Rosuvastatin',
    thaiName: 'โรซูวาสแตติน',
    drugClass: 'Statin',
    normalDose: '5–40 mg รับประทานวันละครั้ง (สูงสุด 40 mg/วัน)',
    method: 'D',
    rules: [
      [30, G, 'CrCl ≥ 30', 'ไม่ต้องปรับขนาดยา'],
      [0, 30, 'CrCl < 30', 'เริ่มต้น 5 mg วันละครั้ง (ขนาดสูงสุดไม่เกิน 10 mg/วัน)'],
    ],
  },

  // 75. Simvastatin
  {
    name: 'Simvastatin',
    thaiName: 'ซิมวาสแตติน',
    drugClass: 'Statin',
    normalDose: '5–40 mg รับประทานวันละครั้ง',
    method: 'D',
    rules: [
      [30, G, 'CrCl 30–80', 'ไม่ต้องปรับขนาดยา'],
      [0, 30, 'CrCl < 30', 'เริ่มต้น 5 mg/วัน ติดตามอาการปวดกล้ามเนื้ออย่างใกล้ชิด'],
    ],
  },

  // 76. Sitagliptin
  {
    name: 'Sitagliptin',
    thaiName: 'ซิตากลิปติน (Januvia)',
    drugClass: 'DPP-4 inhibitor (เบาหวาน)',
    normalDose: '100 mg รับประทานวันละครั้ง',
    method: 'D',
    rules: [
      [50, G, 'CrCl ≥ 50', '100 mg วันละครั้ง'],
      [30, 50, 'CrCl 30–49', '50 mg วันละครั้ง'],
      [0, 30, 'CrCl < 30', '25 mg วันละครั้ง'],
    ],
    hd: 'Hemodialysis / PD: 25 mg วันละครั้ง ให้โดยไม่ต้องคำนึงถึงเวลาฟอกไต',
  },

  // 77. Streptomycin
  {
    name: 'Streptomycin',
    thaiName: 'สเตรปโตมัยซิน',
    drugClass: 'Aminoglycoside / Anti-TB',
    normalDose: '1–2 g IM ทุก 6–12 ชม. (TB: 15 mg/kg IM OD)',
    method: 'I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม eGFR / CrCl',
        rules: [
          [50.1, G, 'CrCl/eGFR > 50', 'ให้ทุก 24 ชม.'],
          [10, 50.1, 'CrCl/eGFR 10–50', 'ให้ทุก 24–72 ชม.'],
          [0, 10, 'CrCl/eGFR < 10', 'ให้ทุก 72–96 ชม.'],
        ],
        hd: 'Hemodialysis: 50% ของขนาดปกติ ให้หลังการฟอกเลือด',
        pd: 'Peritoneal dialysis: 20–40 mg/L ในน้ำยาฟอกไต',
      },
    ],
  },

  // 78. Sulfamethoxazole + Trimethoprim (Co-trimoxazole)
  {
    name: 'Sulfamethoxazole + Trimethoprim (Bactrim)',
    thaiName: 'โคไตรม็อกซาโซล (แบคทริม)',
    drugClass: 'Antibacterial',
    normalDose: 'PCP treatment: 15–20 mg TMP/kg/day IV แบ่งทุก 6–8 ชม. | UTI: 1–2 DS tab BID',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [30.1, G, 'CrCl > 30', '100% ของขนาดปกติ'],
          [15, 30.1, 'CrCl 15–30', '50% ของขนาดปกติ (PCP: ให้เต็มขนาด 48 ชม.แรกแล้วลดลง 50% q 12h)'],
          [0, 15, 'CrCl < 15', 'ไม่แนะนำให้ใช้ หรือกรณีจำเป็นให้ 50% ทุก 24 ชม. หรือ 100% ทุก 48 ชม.'],
        ],
        hd: 'Hemodialysis: 2.5–10 mg/kg TMP ทุก 24 ชม. หรือ 5–20 mg/kg 3 ครั้งต่อสัปดาห์หลังฟอกเลือด',
      },
    ],
  },

  // 79. Terbutaline
  {
    name: 'Terbutaline',
    thaiName: 'เทอร์บูทาลีน (ขยายหลอดลม)',
    drugClass: 'Beta-2 agonist',
    normalDose: '0.25 mg SC ซ้ำได้ใน 15–30 นาที (max 0.5 mg/4h)',
    method: 'D',
    rules: [
      [50, G, 'eGFR > 50', '100% ของขนาดปกติ'],
      [10, 50, 'eGFR 10–50', '50% ของขนาดปกติ'],
      [0, 10, 'eGFR < 10', 'ควรหลีกเลี่ยงการใช้ (Should be avoided)'],
    ],
  },

  // 80. Tenofovir
  {
    name: 'Tenofovir disoproxil fumarate (TDF)',
    thaiName: 'เทโนโฟเวียร์',
    drugClass: 'Antiretroviral',
    normalDose: '300 mg รับประทานวันละครั้ง',
    method: 'I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [50, G, 'CrCl ≥ 50', '300 mg ทุก 24 ชม.'],
          [30, 50, 'CrCl 30–49', '300 mg ทุก 48 ชม.'],
          [10, 30, 'CrCl 10–29', '300 mg ทุก 72–96 ชม.'],
          [0, 10, 'CrCl < 10', 'หลีกเลี่ยงการใช้'],
        ],
        hd: 'Hemodialysis: 300 mg หลังฟอกเลือดทุก 7 วัน (หรือหลังฟอกสะสม ~12 ชม.)',
        pd: 'Peritoneal dialysis: ใช้ด้วยความระมัดระวัง',
      },
    ],
  },

  // 81. Topiramate
  {
    name: 'Topiramate',
    thaiName: 'โทพิราเมต',
    drugClass: 'Anticonvulsant / Migraine prophylaxis',
    normalDose: '200–400 mg/วัน แบ่ง 2 ครั้ง',
    method: 'D',
    rules: [
      [70, G, 'CrCl ≥ 70', 'ขนาดยาปกติ'],
      [0, 70, 'CrCl < 70', 'ให้ 50% ของขนาดปกติ และค่อยๆ ปรับขนาดยาช้าๆ'],
    ],
    hd: 'Hemodialysis: จำเป็นต้องให้ขนาดยาเสริมระหว่างการฟอกเลือด',
  },

  // 82. Tramadol
  {
    name: 'Tramadol',
    thaiName: 'ทรามาดอล',
    drugClass: 'Opioid Analgesic',
    normalDose: '50–100 mg IV/Oral ทุก 4–6 ชม. (max 400 mg/day)',
    method: 'D',
    rules: [
      [30, G, 'CrCl ≥ 30', 'ขนาดยาปกติ'],
      [0, 30, 'CrCl < 30', 'เพิ่มระยะห่างเป็นทุก 12 ชม. (ขนาดยาสูงสุดไม่เกิน 200 mg/วัน)'],
    ],
    hd: 'Hemodialysis: ให้ทุก 12 ชม. สูงสุดไม่เกิน 200 mg/วัน (ไม่ต้องให้ขนาดเสริม)',
  },

  // 83. Tranexamic acid
  {
    name: 'Tranexamic acid (Transamin)',
    thaiName: 'ทราเนกซามิก แอซิด (ทรานซามิน)',
    drugClass: 'Antifibrinolytic (ห้ามเลือด)',
    normalDose: 'Oral: 1,000–1,500 mg วันละ 2–3 ครั้ง | IV: 10 mg/kg วันละ 2–3 ครั้ง',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม Serum Creatinine (Oral)',
        rules: [
          [50, G, 'SCr < 1.4 mg/dL', 'ขนาดยาปกติ 1,000–1,500 mg วันละ 2–3 ครั้ง'],
          [25, 50, 'SCr 1.4–2.8 mg/dL', '1,300–1,500 mg วันละ 2 ครั้ง'],
          [10, 25, 'SCr 2.9–5.7 mg/dL', '1,300 mg วันละครั้ง'],
          [0, 10, 'SCr ≥ 5.7 mg/dL', '650 mg วันละครั้ง หรือ 15 mg/kg ทุก 48 ชม.'],
        ],
      },
      {
        label: 'ปรับขนาดยาตาม Serum Creatinine (IV)',
        rules: [
          [50, G, 'SCr < 1.4 mg/dL', '10 mg/kg ทุก 8 ชม.'],
          [25, 50, 'SCr 1.4–2.8 mg/dL', '10 mg/kg ทุก 12 ชม.'],
          [10, 25, 'SCr 2.8–5.7 mg/dL', '10 mg/kg ทุก 24 ชม.'],
          [0, 10, 'SCr ≥ 5.7 mg/dL', '10 mg/kg ทุก 48 ชม.'],
        ],
      },
    ],
  },

  // 84. Vancomycin
  {
    name: 'Vancomycin',
    thaiName: 'แวนโคมัยซิน',
    drugClass: 'Glycopeptide Antibiotic',
    normalDose: '500 mg ทุก 6 ชม. หรือ 1,000 mg ทุก 12 ชม. (15–20 mg/kg ทุก 8–12 ชม.)',
    method: 'D&I',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [50.1, G, 'CrCl > 50', '15–20 mg/kg ทุก 8–12 ชม. (ปกติ 750–1,500 mg q 8–12h)'],
          [20, 50.1, 'CrCl 20–49', '15–20 mg/kg ทุก 24 ชม. (ปกติ 750–1,500 mg q 24h)'],
          [0, 20, 'CrCl < 20', 'ขยายระยะห่างการให้ยา กำหนดขนาดยาโดยตรวจวัดระดับยาในเลือด (TDM)'],
        ],
        hd: 'Hemodialysis: โหลด 15–25 mg/kg จากนั้นให้ 500–1,000 mg หรือ 5–10 mg/kg หลังการฟอกเลือดแต่ละรอบ',
        pd: 'Peritoneal dialysis: โหลด 1,000 mg ตามด้วย 500–1,000 mg ทุก 48–72 ชม. ติดตามระดับยา',
      },
      {
        label: 'เกณฑ์ปรับตาม eGFR',
        rules: [
          [50.1, G, 'eGFR > 50', '500 mg IV ทุก 6–12 ชม.'],
          [10, 50.1, 'eGFR 10–50', '500 mg IV ทุก 24–48 ชม.'],
          [0, 10, 'eGFR < 10', '500 mg ทุก 48–96 ชม.'],
        ],
        hd: 'Hemodialysis: 500 mg IV ทุก 48–96 ชม.',
      },
    ],
    note: 'ตรวจวัดระดับยา Trough level ก่อนให้ dose ที่ 4 เป้าหมาย 15–20 mcg/mL (หรือ AUC/MIC 400–600)',
  },

  // 85. Valacyclovir
  {
    name: 'Valacyclovir',
    thaiName: 'วาลาไซโคลเวียร์',
    drugClass: 'Antiviral',
    normalDose: 'Herpes zoster: 1 g วันละ 3 ครั้ง 7 วัน | Genital herpes: 500 mg – 1 g วันละ 2 ครั้ง',
    method: 'I',
    groups: [
      {
        label: 'Herpes Zoster (งูสวัด)',
        rules: [
          [50, G, 'CrCl ≥ 50', '1 g วันละ 3 ครั้ง (ทุก 8 ชม.)'],
          [30, 50, 'CrCl 30–49', '1 g ทุก 12 ชม.'],
          [10, 30, 'CrCl 10–29', '1 g ทุก 24 ชม.'],
          [0, 10, 'CrCl < 10', '500 mg ทุก 24 ชม.'],
        ],
        hd: 'Hemodialysis: ให้ยาหลังการฟอกเลือด',
      },
      {
        label: 'Genital Herpes (เริมอวัยวะเพศ)',
        rules: [
          [30, G, 'CrCl ≥ 30', '1 g ทุก 12 ชม.'],
          [10, 30, 'CrCl 10–29', '1 g ทุก 24 ชม.'],
          [0, 10, 'CrCl < 10', '500 mg ทุก 24 ชม.'],
        ],
      },
    ],
  },

  // 86. Voriconazole
  {
    name: 'Voriconazole',
    thaiName: 'โวริโคนาโซล',
    drugClass: 'Antifungal',
    normalDose: 'IV: Load 6 mg/kg q 12h x 2 doses, then 4 mg/kg q 12h | Oral: 200 mg q 12h',
    method: 'D',
    groups: [
      {
        label: 'ปรับขนาดยาตาม CrCl',
        rules: [
          [50, G, 'CrCl ≥ 50', 'ขนาดยาปกติ'],
          [30, 50, 'CrCl 30–49', 'ยาเม็ดกินไม่ต้องปรับขนาด | ยาฉีด IV ควรหลีกเลี่ยงเนื่องจากการสะสมของตัวทำละลาย Cyclodextrin ให้เปลี่ยนเป็นยากิน'],
          [0, 30, 'CrCl < 30', 'แนะนำให้ใช้รูปแบบรับประทาน (Oral) เท่านั้น หลีกเลี่ยง IV formulation'],
        ],
        hd: 'Hemodialysis / PD: ไม่ต้องให้ขนาดยาเสริม',
      },
    ],
  },

  // 87. Zoledronic acid
  {
    name: 'Zoledronic acid',
    thaiName: 'โซเลโดรนิก แอซิด',
    drugClass: 'Bisphosphonate',
    normalDose: 'Multiple myeloma / Bone metastases: 4 mg IV infusion',
    method: 'D',
    groups: [
      {
        label: 'Multiple myeloma และ Bone metastases',
        rules: [
          [60.1, G, 'CrCl > 60', '4 mg IV'],
          [50, 60.1, 'CrCl 50–60', '3.5 mg IV'],
          [40, 50, 'CrCl 40–49', '3.3 mg IV'],
          [30, 40, 'CrCl 30–39', '3 mg IV'],
          [0, 30, 'CrCl < 30', 'ไม่แนะนำให้ใช้ (Use is not recommended)'],
        ],
      },
      {
        label: 'ภาวะกระดูกพรุน (Osteoporosis / Non-oncology)',
        rules: [
          [35, G, 'CrCl ≥ 35', '5 mg IV ปีละครั้ง (ไม่ต้องปรับขนาด)'],
          [0, 35, 'CrCl < 35', 'ห้ามใช้ (Contraindicated)'],
        ],
      },
    ],
    note: 'การให้พาราเซตามอลหลังการให้ยา อาจช่วยลดอาการไข้และปวดเมื่อย (Acute-phase reactions)',
  },
];
