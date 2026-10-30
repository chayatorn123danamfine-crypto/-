import { UserSessionLog } from '../types';

const STORAGE_KEY = 'sukhothai_system_logs_v2';
const CURRENT_SESSION_KEY = 'sukhothai_current_session';

export function getSystemLogs(): UserSessionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: UserSessionLog[] = JSON.parse(raw);
    // Ensure only real logs exist (filter out any legacy sample ids)
    return parsed.filter((l) => !l.id.startsWith('log-'));
  } catch (e) {
    console.error('Failed to read logs from storage', e);
    return [];
  }
}

export function saveSystemLogs(logs: UserSessionLog[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs', e);
  }
}

export function startUserSession(userName: string): UserSessionLog {
  const newLog: UserSessionLog = {
    id: 'session-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    userName: userName.trim() || 'ผู้ใช้งานทั่วไป',
    loginTime: new Date().toISOString(),
    lastActiveTime: new Date().toISOString(),
    durationMinutes: 1,
    functionsUsed: ['เข้าสู่ระบบ'],
  };

  try {
    sessionStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(newLog));
  } catch (e) {
    console.warn(e);
  }

  // Prepend to logs
  const logs = getSystemLogs();
  const updatedLogs = [newLog, ...logs];
  saveSystemLogs(updatedLogs);

  return newLog;
}

export function recordFunctionUsage(functionName: string) {
  try {
    const rawCurrent = sessionStorage.getItem(CURRENT_SESSION_KEY);
    if (!rawCurrent) return;

    const current: UserSessionLog = JSON.parse(rawCurrent);
    if (!current.functionsUsed.includes(functionName)) {
      current.functionsUsed.push(functionName);
    }

    const now = new Date();
    const loginTime = new Date(current.loginTime);
    const elapsedMinutes = Math.max(
      1,
      Math.round((now.getTime() - loginTime.getTime()) / (1000 * 60))
    );
    current.durationMinutes = elapsedMinutes;
    current.lastActiveTime = now.toISOString();

    sessionStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(current));

    // Update in stored list
    const logs = getSystemLogs();
    const targetIdx = logs.findIndex((l) => l.id === current.id);
    if (targetIdx >= 0) {
      logs[targetIdx] = current;
    } else {
      logs.unshift(current);
    }
    saveSystemLogs(logs);
  } catch (e) {
    console.warn('Error recording function usage', e);
  }
}

export function clearAllLogs() {
  saveSystemLogs([]);
}
