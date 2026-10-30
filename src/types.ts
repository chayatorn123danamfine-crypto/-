export type Gender = 'M' | 'F';

export type RenalFormula = 'cg' | 'ckdepi';

export interface CrClResultData {
  formula: RenalFormula;
  crcl: number; // Value in mL/min or mL/min/1.73m²
  unit: string;
  stageName: string;
  stageNum: string; // '1' | '2' | '3a' | '3b' | '4' | '5'
  stageColor: string;
  stageDescription: string;
  formulaText: string;
  age: number;
  weight?: number;
  scr: number;
  gender: Gender;
}

export type RenalRule = [number, number, string, string] | [number, number, string];

export interface RenalDrugGroup {
  label: string;
  rules: RenalRule[];
  hd?: string;
  pd?: string;
  remark?: string;
}

export interface RenalDrug {
  name: string;
  thaiName: string;
  drugClass: string;
  normalDose?: string;
  method?: string; // 'D' | 'I' | 'D&I'
  groups?: RenalDrugGroup[];
  rules?: RenalRule[];
  hd?: string;
  pd?: string;
  note?: string;
}

export type ViewState =
  | 'login'
  | 'menu'
  | 'admin'
  | 'renal-formula-select'
  | 'renal-input'
  | 'renal-result'
  | 'renal-drugs'
  | 'weight-menu'
  | 'weight-kids'
  | 'weight-antibiotics'
  | 'weight-antiviral'
  | 'weight-warfarin'
  | 'weight-tb';

export interface UserSessionLog {
  id: string;
  userName: string;
  loginTime: string; // ISO string
  lastActiveTime: string; // ISO string
  durationMinutes: number;
  functionsUsed: string[];
}
