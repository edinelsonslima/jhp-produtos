import { logAudit } from '@/lib/audit'
import { generateUUID } from '@/lib/utils'
import type { Module } from '@/types'
import { createStore } from './useStore'

export interface AppUser {
  id: string
  name: string
  email: string
  password: string
  initials: string
  modules: Module[]
}

const ALL_MODULES: Module[] = ['sale', 'stock', 'payments', 'manager', 'audit', 'admin']

type State = {
  user: AppUser | null
  users: AppUser[]
}

type Actions = {
  getCurrentUser: () => AppUser | null
  login: (email: string, password: string) => string | null
  logout: () => void
  register: (name: string, email: string, password: string) => string | null
  update: (user: Partial<Omit<AppUser, 'id'>>) => void
}

export const authStore = createStore<State, Actions>({
  persist: { key: 'auth' },

  createState: () => ({
    user: null,
    users: [],
  }),

  createActions: (set, get) => ({
    getCurrentUser: () => {
      return get().user
    },

    login: (email, password) => {
      const users = get().users

      const found = users.find((u) => u.email === email)

      if (!found) {
        return 'Usuário não encontrado'
      }

      if (found.password !== password) {
        return 'Senha incorreta'
      }

      set({ ...get(), user: found })
      logAudit('login', `Login realizado: ${found.name} (${found.email})`)

      return null
    },

    logout: () => {
      const userName = get().user?.name ?? '?'

      set({ ...get(), user: null })
      logAudit('logout', `Logout: ${userName}`)
    },

    register: (name, email, password) => {
      const users = get().users

      if (users.some((u) => u.email === email)) {
        return 'E-mail já cadastrado'
      }

      const user = {
        id: generateUUID(),
        password,
        name,
        email,
        modules: users.length === 0 ? [...ALL_MODULES] : [],
        initials: !name
          ? '?'
          : name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2),
      }

      set({ users: [...get().users, user], user })
      logAudit('user_registered', `Novo usuário: ${name} (${email})`)

      return null
    },

    update: (data) => {
      const user = get().user

      if (!user) {
        return 'Usuário não autenticado'
      }

      set({ ...get(), user: { ...user, ...data } })
      logAudit('user_updated', `Usuário atualizado: ${user.name} (${user.email})`)
    },
  }),
})

// Migração: usuários persistidos antes do campo `modules` recebem todos os módulos.
;(() => {
  const state = authStore.action.getCurrentUser
  void state
  const store = authStore
  const current = store.useStore
  void current

  const raw = (globalThis as { localStorage?: Storage }).localStorage?.getItem('jhp-store-store-auth')
  if (!raw) return

  // Aplica a migração via um set indireto: buscamos o estado atual e reescrevemos usuários sem `modules`.
  const users = (() => {
    try {
      return (JSON.parse(raw)?.data?.users ?? []) as AppUser[]
    } catch {
      return [] as AppUser[]
    }
  })()

  const needs = users.some((u) => !Array.isArray(u.modules))
  if (!needs) return

  // Reaplica via login-safe path: usamos o hook interno atualizando cada usuário e o usuário atual.
  const patched = users.map((u) => (Array.isArray(u.modules) ? u : { ...u, modules: [...ALL_MODULES] }))
  const currentUser = store.action.getCurrentUser()
  const patchedCurrent = currentUser && !Array.isArray(currentUser.modules)
    ? { ...currentUser, modules: [...ALL_MODULES] }
    : currentUser

  // Substitui todo o estado preservando a forma.
  const setAll = (next: { user: AppUser | null; users: AppUser[] }) => {
    // Usa update() só quando há usuário logado; caso contrário, reescreve via truque:
    // login() garante o setState interno. Aqui replicamos manualmente via update de campo por campo.
    if (next.user) {
      // Força atualização do usuário logado (mantém referências).
      store.action.update({
        name: next.user.name,
        email: next.user.email,
        password: next.user.password,
        initials: next.user.initials,
        modules: next.user.modules,
      })
    }
    // Persiste diretamente a lista completa de usuários no localStorage seguindo o formato do storage util.
    const rawNow = localStorage.getItem('jhp-store-store-auth')
    if (!rawNow) return
    try {
      const parsed = JSON.parse(rawNow)
      parsed.data = { ...(parsed.data ?? {}), users: next.users, user: next.user }
      parsed.updatedAt = Date.now()
      localStorage.setItem('jhp-store-store-auth', JSON.stringify(parsed))
    } catch {
      // noop
    }
  }

  setAll({ user: patchedCurrent ?? null, users: patched })
})()
