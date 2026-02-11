import { logAudit } from "@/lib/audit";
import { Sale } from "@/types";
import { createStore } from "./useStore";

type CreateSale = Omit<Sale, "id" | "timestamp">;

type Actions = {
  get: (id: string) => Sale | undefined;
  add: (data: CreateSale) => void;
  update: (id: string, data: Partial<CreateSale>) => void;
  delete: (id: string) => void;
};

type State = {
  sales: Sale[];
  today: { saleId: string[]; total: number; pix: number; cash: number };
  month: { saleId: string[]; total: number; pix: number; cash: number };
};

export const saleStore = createStore<State, Actions>({
  persist: { key: "sales" },

  createState: () => ({
    sales: [],
    today: { saleId: [], total: 0, pix: 0, cash: 0 },
    month: { saleId: [], total: 0, pix: 0, cash: 0 },
  }),

  createActions: (set, get) => ({
    get: (id) => {
      return get().sales.find((s) => s.id === id);
    },

    add: (data) => {
      const total = data.price.total;
      const count = data.products.reduce((s, p) => s + p.quantity, 0);

      const sales = [
        { ...data, id: crypto.randomUUID(), timestamp: Date.now() },
        ...get().sales,
      ];

      set({
        sales: sales,
        today: calculateStats(sales, "today"),
        month: calculateStats(sales, "month"),
      });

      logAudit("sale_created", `Venda de ${count} itens - Total: R$ ${total}`);
    },

    update: (id, data) => {
      const currentSales = get().sales.map((s) => {
        return s.id === id ? { ...s, ...data } : s;
      });

      set({
        sales: currentSales,
        today: calculateStats(currentSales, "today"),
        month: calculateStats(currentSales, "month"),
      });

      logAudit("sale_updated", `Venda editada - ID: ${id}`);
    },

    delete: (id) => {
      const sales = get().sales;
      const total = sales.find((s) => s.id === id)?.price?.total ?? "?";

      const currentSales = sales.filter((s) => s.id !== id);

      set({
        sales: currentSales,
        today: calculateStats(currentSales, "today"),
        month: calculateStats(currentSales, "month"),
      });

      logAudit("sale_deleted", `Venda excluída - Total: R$ ${total}`);
    },
  }),
});

function calculateStats(sales: Sale[], period: "today" | "month") {
  const now = new Date();

  const month = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
  const today = now.toISOString().split("T")[0];

  let pix = 0;
  let cash = 0;
  let total = 0;

  const saleId = sales
    .filter((s) => s.date.startsWith(period === "today" ? today : month))
    .map((s) => {
      const saleTotal = s.price?.total ?? 0;
      total += saleTotal;

      if (s.paymentMethod === "pix") {
        pix += saleTotal;
      }

      if (s.paymentMethod === "dinheiro") {
        cash += saleTotal;
      }

      return s.id;
    });

  return { saleId, total, pix, cash };
}
