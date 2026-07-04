import { logAudit } from '@/lib/audit'
import { generateUUID } from '@/lib/utils'
import type { Tenant } from '@/types'
import { createStore } from './useStore'

type State = {
  tenant: Tenant
}

type Actions = {
  get: () => Tenant
  update: (name: string) => void
}

export const tenantStore = createStore<State, Actions>({
  persist: { key: 'tenant' },

  createState: () => ({
    tenant: { id: generateUUID(), name: 'JHP Produtos' },
  }),

  createActions: (set, get) => ({
    get: () => {
      return get().tenant
    },

    update: (name) => {
      const tenant = get().tenant

      set({ ...get(), tenant: { ...tenant, name } })
      logAudit('tenant_updated', `Tenant atualizado: ${name}`)
    },
  }),
})