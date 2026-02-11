import { logAudit } from "@/lib/audit";
import { storage } from "@/lib/utils";
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

const authStorage = storage(["auth-user", "auth-users", "auth-passwords"]);

const state: AuthState = {
  user: authStorage.load<AppUser>("auth-user", null),
  users: authStorage.load<AppUser[]>("auth-users", []),
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
  state.user = partial.user ?? state.user;
  state.users = partial.users ?? state.users;

  if (partial.users !== undefined) {
    authStorage.save("auth-users", state.users);
  }

  partial.user
    ? authStorage.save("auth-user", partial.user)
    : authStorage.remove("auth-user");

  emit();
}

function getPasswords() {
  return authStorage.load<Record<string, string>>("auth-passwords", {});
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
    authStorage.save("auth-passwords", passwords);

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
