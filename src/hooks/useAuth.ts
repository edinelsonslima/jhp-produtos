import { logAudit } from '@/lib/audit'
import { generateUUID } from '@/lib/utils'
import { createStore } from './useStore'

export interface AppUser {
  id: string
  name: string
  email: string
  password: string
  initials: string
}

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
