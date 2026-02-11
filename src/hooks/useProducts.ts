import { logAudit } from "@/lib/audit";
import { Product } from "@/types";
import { createStore } from "./useStore";

type CreateProduct = Omit<Product, "id">;

type Actions = {
  get: (id: string) => Product | undefined;
  add: (data: CreateProduct) => void;
  update: (id: string, data: Partial<CreateProduct>) => void;
  delete: (id: string) => void;
};

type State = {
  products: Product[];
};

export const productStore = createStore<State, Actions>({
  persist: { key: "products" },

  createState: () => ({ products: [] }),

  createActions: (set, get) => ({
    get: (id) => {
      return get().products.find((p) => p.id === id);
    },

    add: (data) => {
      const products = get().products;

      set({
        products: [...products, { ...data, id: crypto.randomUUID() }],
      });

      logAudit("product_created", `Produto cadastrado: ${data.name}`);
    },

    update: (id, data) => {
      const products = get().products;

      set({
        products: products.map((p) => (p.id === id ? { ...p, ...data } : p)),
      });

      logAudit("product_edited", `Produto editado: ${id}`);
    },

    delete: (id) => {
      const products = get().products;
      const product = products.find((p) => p.id === id);

      set({
        products: products.filter((p) => p.id !== id),
      });

      logAudit("product_deleted", `Produto excluído: ${product?.name ?? "?"}`);
    },
  }),
});
