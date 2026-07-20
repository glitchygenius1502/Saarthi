// Client-side auth for Saarthi.
//
// NOTE: This stores users and the active session in the browser's
// localStorage. It is intended for this demo / hackathon project and works on
// static hosting (Vercel) with no backend. It is NOT production-grade security
// — passwords are only lightly obfuscated, not properly hashed. Swap this out
// for a real backend (e.g. Supabase) when you need real security.

export interface StoredUser {
  name: string;
  email: string;
  phone?: string;
  age?: string;
  city?: string;
  password: string; // obfuscated, see encode()
}

export interface SessionUser {
  name: string;
  email: string;
}

export type AuthResult =
  | { ok: true; user: SessionUser }
  | { ok: false; error: string };

const USERS_KEY = 'saarthi_users';
const SESSION_KEY = 'saarthi_session';

// Light obfuscation so passwords aren't sitting in plain text in devtools.
// This is NOT secure hashing — do not treat it as such.
const encode = (value: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(value)));
  } catch {
    return value;
  }
};

const loadUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: StoredUser[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const setSession = (user: SessionUser): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getSession = (): SessionUser | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  age?: string;
  city?: string;
}

export const signup = (data: SignupData): AuthResult => {
  const email = data.email.trim().toLowerCase();
  const users = loadUsers();

  if (users.some((u) => u.email === email)) {
    return { ok: false, error: 'An account with this email already exists. Please sign in instead.' };
  }

  const newUser: StoredUser = {
    name: data.name.trim(),
    email,
    phone: data.phone,
    age: data.age,
    city: data.city,
    password: encode(data.password),
  };

  users.push(newUser);
  saveUsers(users);

  const session: SessionUser = { name: newUser.name, email: newUser.email };
  setSession(session);
  return { ok: true, user: session };
};

export const login = (email: string, password: string): AuthResult => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = loadUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { ok: false, error: 'No account found with this email. Please sign up first.' };
  }

  if (user.password !== encode(password)) {
    return { ok: false, error: 'Incorrect password. Please try again.' };
  }

  const session: SessionUser = { name: user.name, email: user.email };
  setSession(session);
  return { ok: true, user: session };
};
