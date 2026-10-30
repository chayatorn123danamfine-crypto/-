export interface WeightRowItem {
  form: string;
  str: string;
  fn?: (w: number) => number | [number, number];
  unit?: string;
  fixed?: boolean;
  sub?: string;
  k?: string;
  v?: string;
}

export interface WeightBlock {
  cat?: string;
  t?: string;
  rows?: WeightRowItem[];
  note?: string;
}

const row = (
  form: string,
  str: string,
  fn: (w: number) => number | [number, number],
  unit: string,
  fixed?: boolean
): WeightRowItem => ({ form, str, fn, unit, fixed });

const sub = (t: string): WeightRowItem => ({ sub: t, form: '', str: '' });
const info = (k: string, v: string): WeightRowItem => ({ k, v, form: '', str: '' });
const cat = (t: string): WeightBlock => ({ cat: t });
const blk = (t: string, rows: WeightRowItem[], note?: string): WeightBlock => ({ t, rows, note });
const XL = 'หมายเหตุ (แก้จาก Excel): ';

export function fmt(x: number): string {
  if (!isFinite(x)) return '—';
  const s = Math.abs(x) < 0.1 ? x.toFixed(3) : x.toFixed(2);
  return s.replace(/\.?0+$/, '');
}

export const KID_OTHER: WeightBlock[] = [
  cat('Analgesic (แก้ปวด/ลดไข้)'),
  blk('Paracetamol 10–15 mg/kg/dose q 4–6 hour', [
    row('Drop', '60 mg/0.6 ml', (w) => [(w * 10 * 0.6) / 60, (w * 15 * 0.6) / 60], 'cc/dose'),
    row('Syrup', '120 mg/5 ml', (w) => [(w * 10 * 5) / 120, (w * 15 * 5) / 120], 'cc/dose'),
    row('Tab', '325 mg', (w) => [(w * 10) / 325, (w * 15) / 325], 'tab/dose'),
    row('Tab', '500 mg', (w) => [(w * 10) / 500, (w * 15) / 500], 'tab/dose'),
  ]),

  cat('NSAIDs'),
  blk(
    'Ibuprofen 5–10 mg/kg/day q 4–6 hour',
    [
      row('Syrup', '100 mg/5 ml', (w) => [(w * 5 * 5) / 100, (w * 10 * 5) / 100], 'cc tid'),
      row('Tab', '200 mg', (w) => [(w * 5) / 200, (w * 10) / 200], 'tab tid'),
      row('Tab', '400 mg', (w) => [(w * 5) / 400, (w * 10) / 400], 'tab tid'),
    ],
    'สูตรใน Excel คำนวณเป็นขนาดต่อครั้ง (ต่อ dose) ตามที่แสดง'
  ),

  cat('Antihistamine (แก้แพ้)'),
  blk('CPM 0.35 mg/kg/day PO, SC tid–qid', [
    row('Syrup', '2 mg/5 ml', (w) => (0.35 * w / 3) / 0.4, 'cc tid'),
    row('Tab', '4 mg', (w) => (0.35 * w / 3) / 4, 'tab tid'),
    row('Inj', '10 mg/ml', (w) => (0.35 * w / 3) / 10, 'cc tid'),
  ]),
  blk(
    'Diphenhydramine (Benadryl) 5 mg/kg/day',
    [
      row('Syrup', '2.5 mg/ml', (w) => (5 * w / 3) / 2.5, 'cc tid'),
      row('Syrup', '2.5 mg/ml', (w) => (5 * w / 4) / 2.5, 'cc qid'),
      row('Tab', '50 mg', (w) => (5 * w / 3) / 50, 'tab tid'),
    ],
    XL + 'ช่อง Tab 50 mg ในไฟล์ Excel เสีย (#REF!) จึงใช้สูตรเดียวกับ syrup: (5 mg/kg/วัน ÷ 3 ครั้ง) ÷ 50 mg'
  ),
  blk('Hydroxyzine 2 mg/kg/day PO tid–qid', [
    row('Tab', '10 mg', (w) => (2 * w / 3) / 10, 'tab tid'),
    row('Syrup', '10 mg/5 ml', (w) => (2 * w / 3) / 2, 'cc tid'),
  ]),
  blk(
    'Cetirizine 0.25 mg/kg/day (เด็ก < 2 ปี)',
    [
      row('Syrup', '5 mg/5 ml', (w) => 0.25 * w, 'cc hs'),
      row('Tab', '10 mg', (w) => (0.25 * w) / 10, 'tab hs'),
      row('Syrup', '5 mg/ml', (w) => (0.25 * w) / 5, 'ml'),
    ],
    XL + 'แถว 5 mg/ml ในไฟล์ Excel คำนวณเป็น W × 0.25 (ไม่ได้หารความเข้มข้น) จึงแก้เป็น (0.25 × W) ÷ 5'
  ),
  blk('Loratadine 10 mg/tab', [
    info('2–5 ปี / < 30 กก.', '5 mg PO = 0.5 Tab/day'),
    info('> 30 กก.', '10 mg PO = 1 Tab/day'),
    info('> 6 ปี', '10 mg PO = 1 Tab/day'),
  ]),
  blk('Levocetirizine 5 mg/tab', [info('> 6 ปี', '5 mg PO OD')]),
  blk('Brompheniramine', [
    sub('< 6 ปี: 0.125 mg/kg/dose q 4–6 hr (Max 8 mg/day)'),
    row('Syrup', '2 mg/5 ml', (w) => (0.125 * w) / 0.4, 'cc/dose'),
    sub('6–12 ปี: 2–4 mg/dose'),
    row('Syrup', '2 mg/5 ml', () => [5, 10], 'cc/dose', true),
  ]),

  cat('Antiemetic (แก้คลื่นไส้อาเจียน)'),
  blk('Domperidone 0.2–0.4 mg/kg/dose PO tid–qid', [
    row('Syrup', '5 mg/5 ml', (w) => 0.3 * w, 'cc tid'),
    row('Tab', '10 mg', (w) => (0.3 * w) / 10, 'tab tid'),
  ]),
  blk('Metoclopramide — Intestinal intubation, Small bowel', [
    sub('< 6 ปี: 0.1 mg/kg IV ช้า ๆ ใน 1–2 นาที เป็น single undiluted dose'),
    row('INJ', '< 6 ปี', (w) => 0.1 * w, 'mg/dose'),
    info('6–14 ปี', '2.5–5 mg IV ช้า ๆ ใน 1–2 นาที เป็น single undiluted dose'),
    info('> 15 ปี', '10 mg IV ช้า ๆ ใน 1–2 นาที เป็น single undiluted dose'),
  ]),

  cat('Mucolytics and Antitussives (ละลายเสมหะ/แก้ไอ)'),
  blk('Bromhexine 0.6–0.8 mg/kg/day PO tid', [
    row('Syrup', '4 mg/5 ml', (w) => [(0.6 * w / 3) / 0.8, (0.8 * w / 3) / 0.8], 'cc tid'),
    row('Tab', '8 mg', (w) => [(0.6 * w / 3) / 8, (0.8 * w / 3) / 8], 'tab tid'),
  ]),
  blk('Ambroxol 1.5–2 mg/kg/day', [
    row('Syrup', '15 mg/5 ml', (w) => [(1.5 * w) / 3 / 3, (2 * w / 3) / 3], 'cc TID'),
  ]),
  blk('Guaifenesin ≥ 2 ปี: 12 mg/kg/day', [
    row('Syrup', '100 mg/5 ml', (w) => (12 * w / 3) / 20, 'cc TID'),
  ]),
];

export const KID_AB: WeightBlock[] = [
  cat('Antibiotic'),
  blk(
    'Amoxicillin (Amoxycillin)',
    [
      sub('Mild–Moderate infection 25–50 mg/kg/day'),
      row('Syrup', '125 mg/5 ml', (w) => [(20 * w / 3) / 25, (50 * w / 3) / 25], 'cc tid'),
      row('Syrup', '250 mg/5 ml', (w) => [(20 * w / 3) / 50, (50 * w / 3) / 50], 'cc tid'),
      row('Cap', '250 mg', (w) => [(20 * w / 250) / 3, (50 * w / 250) / 3], 'cap tid'),
      row('Cap', '500 mg', (w) => [(20 * w / 500) / 3, (50 * w / 500) / 3], 'cap tid'),
      sub('Severe infection 80–100 mg/kg/day'),
      row('Syrup', '125 mg/5 ml', (w) => [(80 * w / 3) / 25, (100 * w / 3) / 25], 'cc tid'),
      row('Syrup', '250 mg/5 ml', (w) => [(80 * w / 3) / 50, (100 * w / 3) / 50], 'cc tid'),
      row('Cap', '250 mg', (w) => [(80 * w / 250) / 3, (100 * w / 250) / 3], 'cap tid'),
      row('Cap', '500 mg', (w) => [(80 * w / 500) / 3, (100 * w / 500) / 3], 'cap tid'),
    ],
    'สูตร Mild–Moderate ในไฟล์ Excel คำนวณจาก 20–50 mg/kg/วัน (หัวข้อระบุ 25–50) — แสดงตามสูตรในไฟล์'
  ),

  blk(
    'Augmentin (Amoxicillin/Clavulanate)',
    [
      sub('Acute otitis media — mild to moderate: amoxicillin 90 mg/kg/day + clavulanate 6.4 mg/kg/day แบ่งให้ 2 ครั้ง'),
      row('Syrup', '6–12 ปี (amox 80 mg/ml)', (w) => (90 * w / 2) / 80, 'cc BID × 5–7 วัน'),
      row('Syrup', '2–5 ปี (amox 80 mg/ml)', (w) => (90 * w / 2) / 80, 'cc BID × 7 วัน'),
      row('Syrup', '< 2 ปี (amox 80 mg/ml)', (w) => (90 * w / 2) / 80, 'cc BID × 10 วัน'),
      info('Severe infection', 'amoxicillin 90 mg/kg/day + clavulanate 6.4 mg/kg/day แบ่งให้ 2 ครั้ง นาน 10 วัน'),
      sub('Other infection (ส่วน amoxicillin) — UTI / ติดเชื้อผิวหนังและเนื้อเยื่อใต้ผิวหนัง'),
      sub('อายุ 3 เดือนขึ้นไป / < 40 กก.: 25–45 mg/kg/day'),
      row('Syrup', 'amox 80 mg/ml', (w) => [(25 * w / 2) / 80, (45 * w / 2) / 80], 'cc BID'),
      row('Tab', '875 mg', (w) => [(25 * w / 2) / 875, (45 * w / 2) / 875], 'tab BID'),
      sub('> 40 กก. — Mild to moderate: 500 mg q 12 hr หรือ 250 mg q 8 hr'),
      row('Syrup', '500 mg q 12 hr', () => 500 / 80, 'cc q 12 hr', true),
      row('Syrup', '250 mg q 8 hr', () => 250 / 80, 'cc q 8 hr', true),
      row('Tab', '500 mg q 12 hr', () => 500 / 875, 'tab q 12 hr', true),
      row('Tab', '250 mg q 8 hr', () => 250 / 875, 'tab q 8 hr', true),
      sub('> 40 กก. — Severe: 875 mg q 12 hr หรือ 500 mg q 8 hr'),
      row('Syrup', '875 mg q 12 hr', () => 875 / 80, 'cc q 12 hr', true),
      row('Syrup', '500 mg q 8 hr', () => 500 / 80, 'cc q 8 hr', true),
    ],
    XL + 'แถวสุดท้ายของ otitis media ในไฟล์ Excel พิมพ์ว่า “> 2 years” แก้เป็น “< 2 ปี” (10 วัน) · สูตรในไฟล์ใช้ความเข้มข้น amoxicillin 80 mg/ml (400/57 mg ใน 5 ml) ซึ่งต่างจาก ES 600/42.9 (120 mg/ml) ที่ตรงกับสูตร 90/6.4 — ควรตรวจสอบชนิดยาที่จ่ายจริง'
  ),

  blk(
    'Cephalexin 25–50 mg/kg/day q 6–8 hr',
    [
      row('Syrup', '125 mg/5 ml', (w) => [(25 * w / 4) / 25, (50 * w / 4) / 25], 'cc q 6 hr'),
      row('Cap', '250 mg', (w) => [(25 * w / 4) / 250, (50 * w / 4) / 250], 'cap q 6 hr'),
      row('Syrup', '125 mg/5 ml', (w) => [(25 * w / 3) / 25, (50 * w / 3) / 25], 'cc q 8 hr'),
      row('Cap', '250 mg', (w) => [(25 * w / 3) / 250, (50 * w / 3) / 250], 'cap q 8 hr'),
    ],
    XL + 'ใน Excel ช่องสูงสุดของ syrup q 8 hr เป็น (W/3)/25 (ขาด 50) และ cap q 8 hr ติดป้าย “q 6 hr” จึงแก้เป็น 25–50 mg/kg/วัน และ q 8 hr'
  ),

  blk('Cefixime 8 mg/kg/day q 12–24 hr', [
    row('Syrup', '100 mg/5 ml', (w) => (8 * w / 2) / 20, 'cc BID'),
    row('Cap', '100 mg', (w) => (8 * w / 2) / 100, 'cap BID'),
    row('Syrup', '100 mg/5 ml', (w) => (8 * w) / 20, 'cc OD'),
    row('Cap', '100 mg', (w) => (8 * w) / 100, 'cap OD'),
  ]),

  blk('Metronidazole 30–50 mg/kg/day q 8–12 hr', [
    row('Syrup', '200 mg/5 ml', (w) => [(30 * w / 3) / 40, (50 * w / 3) / 40], 'cc q 8 hr'),
    row('Syrup', '200 mg/5 ml', (w) => [(30 * w / 2) / 40, (50 * w / 2) / 40], 'cc q 12 hr'),
  ]),

  blk('Dicloxacillin 25–50 mg/kg/day PO qid ac', [
    row('Syrup', '62.5 mg/5 ml', (w) => [(25 * w / 4) * 0.08, (50 * w / 4) * 0.08], 'cc qid'),
    row('Cap', '250 mg', (w) => [(25 * w / 4) / 250, (50 * w / 4) / 250], 'cap qid'),
    row('Cap', '500 mg', (w) => [(25 * w / 4) / 500, (50 * w / 4) / 500], 'cap qid'),
  ]),

  blk('Ciprofloxacin 10–20 mg/kg/dose q 12 hr (Max 750 mg/dose)', [
    row('Tab', '250 mg', (w) => [(10 * w) / 250, (20 * w) / 250], 'tab'),
  ]),

  blk('Clarithromycin 15 mg/kg/day q 12 hr (Max 1,000 mg/day)', [
    row('Tab', '500 mg', (w) => (15 * w / 2) / 500, 'tab q 12 hr'),
  ]),

  blk('Erythromycin 30–50 mg/kg/day q 6–12 hr', [
    row('Syrup', '125 mg/5 ml', (w) => [(30 * w / 4) / 25, (50 * w) / 4 / 25], 'cc q 6 hr'),
    row('Syrup', '125 mg/5 ml', (w) => [(30 * w / 2) / 25, (50 * w) / 2 / 25], 'cc q 12 hr'),
  ]),

  blk('Clindamycin 8–40 mg/kg/day q 8–12 hr', [
    row('Tab', '300 mg', (w) => [(8 * w / 3) / 300, (40 * w / 3) / 300], 'tab q 8 hr'),
    row('INJ', '600 mg/amp', (w) => [8 * w / 3, 40 * w / 3], 'mg q 8 hr'),
  ]),

  blk(
    'Sulfamethoxazole + Trimethoprim (> 2 เดือน: TMP 8 mg/kg/day, SMX 40 mg/kg/day q 12 hr)',
    [
      info('Max dose', 'SMX 1,600 mg/day, TMP 300 mg/day'),
      row('Syrup', '200/40 mg ต่อ 5 ml', (w) => (40 * w / 2) / 40, 'cc q 12 hr'),
      row('Dose', 'SMX', (w) => 40 * w, 'mg/day'),
      row('Dose', 'TMP', (w) => 8 * w, 'mg/day'),
      row('Tab', '400/80 mg', (w) => (40 * w / 400) / 2, 'tab q 12 hr'),
    ],
    XL + 'แถว syrup ในไฟล์ Excel คำนวณเป็น (40×W/80)/2 ซึ่งได้ครึ่งหนึ่งของขนาดจริง (SMX 200 mg ต่อ 5 ml = 40 mg/ml) จึงแก้เป็น (40×W ÷ 2) ÷ 40 ให้สอดคล้องกับแถว Tab'
  ),

  blk('Azithromycin 5–12 mg/kg/day OD', [
    row('Syrup', '200 mg/5 ml', (w) => [(5 * w) / 40, (12 * w) / 40], 'cc OD'),
    row('Cap', '250 mg', (w) => [(5 * w) / 250, (12 * w) / 250], 'cap OD'),
  ]),
];

export const KID_AV: WeightBlock[] = [
  cat('Antiviral'),
  blk('Tamiflu (Oseltamivir) 4 mg/kg/day PO bid × 5 วัน', [
    row('Syrup', '10 mg/ml', (w) => (4 * w / 10) / 2, 'cc bid'),
    row('Cap', '75 mg', (w) => (4 * w / 2) / 75, 'cap bid'),
    sub('ขนาดตามน้ำหนัก/อายุ'),
    info('ผู้ใหญ่', '75 mg bid'),
    info('> 40 กก.', '75 mg bid'),
    info('23–40 กก.', '60 mg bid'),
    info('15–23 กก.', '45 mg bid'),
    info('> 1 ปี, < 15 กก.', '30 mg bid'),
    info('6–11 เดือน', '25 mg bid'),
    info('3–5 เดือน', '20 mg bid'),
    info('< 3 เดือน', '12 mg bid'),
  ]),
  blk('Acyclovir 200 mg/Tab', [
    sub('อายุ > 28 วัน: 40–80 mg/kg/day'),
    row('Tab', '200 mg', (w) => [(40 * w / 3) / 200, (80 * w / 3) / 200], 'Tab q 8 hr'),
    info('> 2 ปี', '800 mg = 4 Tab q 8 hr'),
  ]),
];
