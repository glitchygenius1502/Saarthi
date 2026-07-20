// Auth for Saarthi, backed by the real backend API (/api/auth) with JWT.
//
// The token + user are stored in localStorage under shared keys. Because every
// module is served from the same origin (sub-paths of one deployment), all
// modules read the same session — one login works across the whole site.

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export type AuthResult =
  | { ok: true; user: SessionUser }
  | { ok: false; error: string };

const TOKEN_KEY = 'saarthi_token';
const USER_KEY = 'saarthi_user';

async function postJson(path: string, body: unknown) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

function persist(token: string, user: SessionUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  age?: string;
  city?: string;
}

export async function signup(data: SignupData): Promise<AuthResult> {
  const { ok, data: res } = await postJson('/api/auth/register', data);
  if (!ok) return { ok: false, error: res.error || 'Could not create your account. Please try again.' };
  persist(res.token, res.user);
  return { ok: true, user: res.user };
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const { ok, data: res } = await postJson('/api/auth/login', { email, password });
  if (!ok) return { ok: false, error: res.error || 'Could not sign you in. Please try again.' };
  persist(res.token, res.user);
  return { ok: true, user: res.user };
}

export function getSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
