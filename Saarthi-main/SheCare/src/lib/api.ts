// SheCycle+ talks to the shared Saarthi backend at /api (same origin).
// The JWT + user are written by the hub login under shared localStorage keys,
// so a user logged in on the hub is already logged in here.

const TOKEN_KEY = 'saarthi_token';
const USER_KEY = 'saarthi_user';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const getUser = (): SessionUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Send an unauthenticated visitor to the hub, opening the "Get Started" popup,
// and return them to SheCycle+ after they sign in.
export const goToLogin = (): void => {
  window.location.href = '/?auth=signup&next=' + encodeURIComponent('/shecare');
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
    logout();
    goToLogin();
    throw new Error('Please sign in.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).error || 'Request failed');
  return data as T;
}

export interface Summary {
  hasData: boolean;
  avgCycleLength?: number;
  avgPeriodLength?: number;
  regularityScore?: number;
  lastPeriodStart?: string;
  nextPeriodDate?: string;
  daysUntilNext?: number;
  currentCycleDay?: number;
  progressPercent?: number;
  phase?: string;
  fertileWindow?: { start: string; end: string };
  totalPeriodsLogged?: number;
  notifications: { type: string; title: string; message: string }[];
  recentMoods: { mood: string; date: string; emoji?: string }[];
}

export const shecareApi = {
  summary: () => api<Summary>('/shecare/summary'),
  listPeriods: () => api<{ periods: any[] }>('/shecare/periods'),
  logPeriod: (body: { startDate: string; endDate?: string; flow?: string; notes?: string }) =>
    api('/shecare/periods', { method: 'POST', body: JSON.stringify(body) }),
  listMoods: () => api<{ moods: any[] }>('/shecare/moods'),
  logMood: (body: { date: string; mood: string; emoji?: string; temperature?: string; note?: string }) =>
    api('/shecare/moods', { method: 'POST', body: JSON.stringify(body) }),
};
