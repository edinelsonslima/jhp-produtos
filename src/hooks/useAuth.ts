import { logAudit } from "@/lib/audit";
import { useSyncExternalStore } from "react";

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

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  return state;
}

function update(partial: Partial<AuthState>) {
  state = { ...state, ...partial };

  if (partial.users !== undefined) {
    localStorage.setItem("auth_users", JSON.stringify(state.users));
  }

  partial.user
    ? localStorage.setItem("auth_user", JSON.stringify(partial.user))
    : localStorage.removeItem("auth_user");

  emit();
}

function getPasswords(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem("auth_passwords") || "{}");
  } catch {
    return {};
  }
}

export function useAuth() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const login = (email: string, password: string): string | null => {
    const found = snap.users.find((u) => u.email === email);
    if (!found) return "Usuário não encontrado";

    const passwords = getPasswords();
    if (passwords[found.id] !== password) return "Senha incorreta";

    update({ user: found });
    logAudit("login", `Login realizado: ${found.name} (${found.email})`);
    return null;
  };

  const register = (
    name: string,
    email: string,
    password: string,
  ): string | null => {
    if (snap.users.some((u) => u.email === email))
      return "E-mail já cadastrado";

    const newUser: AppUser = { id: crypto.randomUUID(), name, email };

    const passwords = getPasswords();
    passwords[newUser.id] = password;
    localStorage.setItem("auth_passwords", JSON.stringify(passwords));

    update({ users: [...snap.users, newUser], user: newUser });
    logAudit("user_registered", `Novo usuário: ${name} (${email})`);
    return null;
  };

  const logout = () => {
    const userName = snap.user?.name ?? "?";
    logAudit("logout", `Logout: ${userName}`);
    update({ user: null });
  };

  return { user: snap.user, login, register, logout };
}
