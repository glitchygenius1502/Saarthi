// MediVault talks to the shared Saarthi backend at /api (same origin).
// Auth (JWT) is written by the hub login under shared localStorage keys.

const TOKEN_KEY = 'saarthi_token';
const USER_KEY = 'saarthi_user';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const goToLogin = (): void => {
  window.location.href = '/?auth=signup&next=' + encodeURIComponent('/medivault');
};

async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    goToLogin();
    throw new Error('Please sign in.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).error || 'Request failed');
  return data as T;
}

export interface ReportMeta {
  _id: string;
  name: string;
  category: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
}

export interface Metric {
  _id: string;
  type: 'weight' | 'bp' | 'sugar';
  date: string;
  weightKg?: number;
  heightCm?: number;
  bmi?: number;
  systolic?: number;
  diastolic?: number;
  sugar?: number;
  sugarContext?: string;
  category?: string;
}

export const medivaultApi = {
  listReports: () => api<{ reports: ReportMeta[] }>('/medivault/reports'),
  getReport: (id: string) => api<{ report: ReportMeta & { data: string } }>(`/medivault/reports/${id}`),
  uploadReport: (body: { name: string; category: string; mimeType: string; size: number; data: string }) =>
    api<{ report: ReportMeta }>('/medivault/reports', { method: 'POST', body: JSON.stringify(body) }),
  deleteReport: (id: string) => api(`/medivault/reports/${id}`, { method: 'DELETE' }),
  listMetrics: (type?: string) => api<{ metrics: Metric[] }>(`/medivault/metrics${type ? `?type=${type}` : ''}`),
  saveMetric: (body: Record<string, unknown>) =>
    api<{ metric: Metric }>('/medivault/metrics', { method: 'POST', body: JSON.stringify(body) }),
  listPrescriptions: () => api<{ prescriptions: any[] }>('/medivault/prescriptions'),
  addPrescription: (body: Record<string, unknown>) =>
    api<{ prescription: any }>('/medivault/prescriptions', { method: 'POST', body: JSON.stringify(body) }),
  deletePrescription: (id: string) => api(`/medivault/prescriptions/${id}`, { method: 'DELETE' }),
};

// Shared client-side classification (mirrors the server) for instant feedback.
export const classifyBmi = (bmi: number): string =>
  bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';

export const classifyBp = (s: number, d: number): string => {
  if (s >= 180 || d >= 120) return 'Hypertensive Crisis';
  if (s >= 140 || d >= 90) return 'Hypertension Stage 2';
  if (s >= 130 || d >= 80) return 'Hypertension Stage 1';
  if (s >= 120 && d < 80) return 'Elevated';
  if (s < 120 && d < 80) return 'Normal';
  return 'Elevated';
};

export const classifySugar = (v: number, ctx: string): string => {
  if (ctx === 'fasting') {
    if (v < 70) return 'Low';
    if (v < 100) return 'Normal';
    if (v < 126) return 'Prediabetes';
    return 'Diabetes';
  }
  if (v < 70) return 'Low';
  if (v < 140) return 'Normal';
  if (v < 200) return 'Prediabetes';
  return 'Diabetes';
};

export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
