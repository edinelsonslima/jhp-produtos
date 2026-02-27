import { logAudit } from '@/lib/audit'
import { generateUUID } from '@/lib/utils'
import type { Product } from '@/types'
import { createStore } from './useStore'

type CreateProduct = Omit<Product, 'id'>

type Actions = {
  get: (id: string) => Product | undefined
  add: (data: CreateProduct) => Product
  update: (id: string, data: Partial<CreateProduct>) => void
  delete: (id: string) => void
}

type State = {
  products: Product[]
}

export const productStore = createStore<State, Actions>({
  persist: { key: 'products' },

  createState: () => ({
    products: [],
    customProducts: [],
  }),

  createActions: (set, get) => ({
    get: (id) => {
      return get().products.find((p) => p.id === id)
    },

    add: (data) => {
      const products = get().products

      const productItem = { ...data, id: generateUUID() }

      set({ ...get(), products: [...products, productItem] })

      logAudit('product_created', `Produto cadastrado: ${data.name}`)

      return productItem
    },

    update: (id, data) => {
      const products = get().products

      set({
        ...get(),
        products: products.map((p) => (p.id === id ? { ...p, ...data } : p)),
      })

      logAudit('product_edited', `Produto editado: ${id}`)
    },

    delete: (id) => {
      const products = get().products
      const product = products.find((p) => p.id === id)

      if (!product) {
        return
      }

      set({
        ...get(),
        products: products.filter((p) => p.id !== id),
      })

      logAudit('product_deleted', `Produto excluído: ${product?.name ?? '?'}`)
    },
  }),
})
