import { useCallback, useSyncExternalStore } from "react";

export interface AppUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: AppUser | null;
  users: AppUser[];
}

let state: AuthState = {
  user: (() => {
    try {
      const d = localStorage.getItem("auth_user");
      return d ? JSON.parse(d) : null;
    } catch {
      return null;
    }
  })(),
  users: (() => {
    try {
      const d = localStorage.getItem("auth_users");
      return d ? JSON.parse(d) : [];
    } catch {
      return [];
    }
  })(),
};

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }
function subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); }
function getSnapshot() { return state; }

function update(partial: Partial<AuthState>) {
  state = { ...state, ...partial };
  if (partial.user !== undefined) {
    if (partial.user) localStorage.setItem("auth_user", JSON.stringify(partial.user));
    else localStorage.removeItem("auth_user");
  }
  if (partial.users) localStorage.setItem("auth_users", JSON.stringify(partial.users));
  emit();
}

export function useAuth() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const login = useCallback((email: string, password: string): string | null => {
    const found = snap.users.find((u) => u.email === email);
    if (!found) return "Usuário não encontrado";
    // MVP: no password hashing, stored alongside
    const passwords: Record<string, string> = (() => {
      try { return JSON.parse(localStorage.getItem("auth_passwords") || "{}"); } catch { return {}; }
    })();
    if (passwords[found.id] !== password) return "Senha incorreta";
    update({ user: found });
    return null;
  }, [snap.users]);

  const register = useCallback((name: string, email: string, password: string): string | null => {
    if (snap.users.some((u) => u.email === email)) return "E-mail já cadastrado";
    const newUser: AppUser = { id: crypto.randomUUID(), name, email };
    const passwords: Record<string, string> = (() => {
      try { return JSON.parse(localStorage.getItem("auth_passwords") || "{}"); } catch { return {}; }
    })();
    passwords[newUser.id] = password;
    localStorage.setItem("auth_passwords", JSON.stringify(passwords));
    update({ users: [...snap.users, newUser], user: newUser });
    return null;
  }, [snap.users]);

  const logout = useCallback(() => {
    update({ user: null });
  }, []);

  return { user: snap.user, login, register, logout };
}
