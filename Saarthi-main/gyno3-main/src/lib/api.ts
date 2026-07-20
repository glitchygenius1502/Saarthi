// GynoConnect talks to the shared Saarthi backend at /api (same origin).
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
  window.location.href = '/';
};

export interface BookingInput {
  doctorId?: string;
  doctorName: string;
  clinic?: string;
  address?: string;
  date: string;
  time: string;
  mode?: 'call' | 'video' | 'appointment';
}

// Returns { ok, status, data }. Never throws.
export async function bookAppointment(input: BookingInput) {
  const token = getToken();
  const res = await fetch('/api/gyno/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
