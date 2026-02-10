import { DailyPayment, Employee, Product, Sale } from "@/types";
import { useCallback, useSyncExternalStore } from "react";

// ── Persistence helpers ──────────────────────────────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Mock data ────────────────────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Metazil", unit: "litro", price: 15 },
  { id: "2", name: "Solupam", unit: "litro", price: 18 },
  { id: "3", name: "Desinfetante Industrial", unit: "litro", price: 12 },
  { id: "4", name: "Detergente Pesado", unit: "unidade", price: 25 },
  { id: "5", name: "Limpa Alumínio", unit: "litro", price: 20 },
  { id: "6", name: "Desincrustante", unit: "litro", price: 22 },
];

// ── Global store (singleton) ─────────────────────────────────────────
interface StoreState {
  sales: Sale[];
  dailyPayments: DailyPayment[];
  products: Product[];
  employees: Employee[];
}

let state: StoreState = {
  sales: loadFromStorage("sales", []),
  dailyPayments: loadFromStorage("dailyPayments", []),
  products: loadFromStorage("products", MOCK_PRODUCTS),
  employees: loadFromStorage("employees", []),
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): StoreState {
  return state;
}

function updateState(partial: Partial<StoreState>) {
  state = { ...state, ...partial };
  // persist changed keys
  if (partial.sales) saveToStorage("sales", state.sales);
  if (partial.dailyPayments) saveToStorage("dailyPayments", state.dailyPayments);
  if (partial.products) saveToStorage("products", state.products);
  if (partial.employees) saveToStorage("employees", state.employees);
  emitChange();
}

// ── Hook ─────────────────────────────────────────────────────────────
export function useStore() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const addSale = useCallback((sale: Omit<Sale, "timestamp">) => {
    updateState({ sales: [{ ...sale, timestamp: Date.now() }, ...snap.sales] });
  }, [snap.sales]);

  const deleteSale = useCallback((id: string) => {
    updateState({ sales: snap.sales.filter((s) => s.id !== id) });
  }, [snap.sales]);

  const addDailyPayment = useCallback(
    (payment: Omit<DailyPayment, "id" | "timestamp">) => {
      updateState({
        dailyPayments: [
          {
            ...payment,
            id: window.crypto?.randomUUID(),
            timestamp: Date.now(),
          },
          ...snap.dailyPayments,
        ],
      });
    },
    [snap.dailyPayments],
  );

  const deleteDailyPayment = useCallback((id: string) => {
    updateState({
      dailyPayments: snap.dailyPayments.filter((p) => p.id !== id),
    });
  }, [snap.dailyPayments]);

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    updateState({
      products: [...snap.products, { ...product, id: window.crypto?.randomUUID() }],
    });
  }, [snap.products]);

  const deleteProduct = useCallback((id: string) => {
    updateState({ products: snap.products.filter((p) => p.id !== id) });
  }, [snap.products]);

  const addEmployee = useCallback((employee: Omit<Employee, "id">) => {
    updateState({
      employees: [...snap.employees, { ...employee, id: window.crypto?.randomUUID() }],
    });
  }, [snap.employees]);

  const deleteEmployee = useCallback((id: string) => {
    updateState({ employees: snap.employees.filter((e) => e.id !== id) });
  }, [snap.employees]);

  const todayStr = new Date().toISOString().split("T")[0];

  const todaySales = snap.sales.filter((s) => s.date.startsWith(todayStr));
  const todayTotal = todaySales.reduce((sum, s) => sum + s.price.total, 0);
  const todayPix = todaySales
    .filter((s) => s.paymentMethod === "pix")
    .reduce((sum, s) => sum + s.price.total, 0);
  const todayCash = todaySales
    .filter((s) => s.paymentMethod === "dinheiro")
    .reduce((sum, s) => sum + s.price.total, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthSales = snap.sales.filter((s) => s.date.startsWith(currentMonth));
  const monthTotal = monthSales.reduce((sum, s) => sum + s.price.total, 0);
  const monthPix = monthSales
    .filter((s) => s.paymentMethod === "pix")
    .reduce((sum, s) => sum + s.price.total, 0);
  const monthCash = monthSales
    .filter((s) => s.paymentMethod === "dinheiro")
    .reduce((sum, s) => sum + s.price.total, 0);

  const todayPayments = snap.dailyPayments.filter((p) => p.date.startsWith(todayStr));
  const todayPaymentsTotal = todayPayments.reduce(
    (sum, p) => sum + p.amount,
    0,
  );

  return {
    sales: snap.sales,
    todaySales,
    monthSales,
    todayTotal,
    todayPix,
    todayCash,
    monthTotal,
    monthPix,
    monthCash,
    todayPayments,
    todayPaymentsTotal,
    dailyPayments: snap.dailyPayments,
    products: snap.products,
    employees: snap.employees,
    addSale,
    deleteSale,
    addDailyPayment,
    deleteDailyPayment,
    addProduct,
    deleteProduct,
    addEmployee,
    deleteEmployee,
  };
}
