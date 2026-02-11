import { logAudit } from "@/lib/audit";
import { storage } from "@/lib/utils";
import { DailyPayment, Employee, Product, Sale } from "@/types";
import { useSyncExternalStore } from "react";

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Metazil", unit: "litro", price: 15 },
  { id: "2", name: "Solupam", unit: "litro", price: 18 },
  { id: "3", name: "Desinfetante Industrial", unit: "litro", price: 12 },
  { id: "4", name: "Detergente Pesado", unit: "unidade", price: 25 },
  { id: "5", name: "Limpa Alumínio", unit: "litro", price: 20 },
  { id: "6", name: "Desincrustante", unit: "litro", price: 22 },
];

interface StoreState {
  sales: Sale[];
  dailyPayments: DailyPayment[];
  products: Product[];
  employees: Employee[];
}

const listeners = new Set<() => void>();

const storeStorage = storage([
  "sales-store",
  "daily-payments-store",
  "products-store",
  "employees-store",
]);

const state: StoreState = {
  sales: storeStorage.load<Sale[]>("sales-store", []),
  dailyPayments: storeStorage.load<DailyPayment[]>("daily-payments-store", []),
  products: storeStorage.load<Product[]>("products-store", MOCK_PRODUCTS),
  employees: storeStorage.load<Employee[]>("employees-store", []),
};

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
  state.sales = partial.sales ?? state.sales;
  state.dailyPayments = partial.dailyPayments ?? state.dailyPayments;
  state.products = partial.products ?? state.products;
  state.employees = partial.employees ?? state.employees;

  if (partial.sales) {
    storeStorage.save("sales-store", state.sales);
  }

  if (partial.dailyPayments) {
    storeStorage.save("daily-payments-store", state.dailyPayments);
  }

  if (partial.products) {
    storeStorage.save("products-store", state.products);
  }

  if (partial.employees) {
    storeStorage.save("employees-store", state.employees);
  }

  emitChange();
}

export function useStore() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const addSale = (sale: Omit<Sale, "timestamp">) => {
    const current = getSnapshot();
    updateState({
      sales: [{ ...sale, timestamp: Date.now() }, ...current.sales],
    });
    logAudit(
      "sale_created",
      `Venda de ${sale.products.length} itens - Total: R$ ${sale.price.total.toFixed(2)}`,
    );
  };

  const updateSale = (
    id: string,
    data: Partial<Omit<Sale, "id" | "timestamp">>,
  ) => {
    const current = getSnapshot();
    updateState({
      sales: current.sales.map((s) => (s.id === id ? { ...s, ...data } : s)),
    });
    logAudit("sale_edited", `Venda editada - ID: ${id.slice(0, 8)}`);
  };

  const deleteSale = (id: string) => {
    const current = getSnapshot();
    const sale = current.sales.find((s) => s.id === id);
    updateState({ sales: current.sales.filter((s) => s.id !== id) });
    logAudit(
      "sale_deleted",
      `Venda excluída - Total: R$ ${sale?.price?.total.toFixed(2) ?? "?"}`,
    );
  };

  const addDailyPayment = (payment: Omit<DailyPayment, "id" | "timestamp">) => {
    const current = getSnapshot();
    updateState({
      dailyPayments: [
        { ...payment, id: crypto.randomUUID(), timestamp: Date.now() },
        ...current.dailyPayments,
      ],
    });
    logAudit(
      "payment_created",
      `Diária de R$ ${payment.amount.toFixed(2)} para ${payment.employeeName}`,
    );
  };

  const deleteDailyPayment = (id: string) => {
    const current = getSnapshot();
    const payment = current.dailyPayments.find((p) => p.id === id);
    updateState({
      dailyPayments: current.dailyPayments.filter((p) => p.id !== id),
    });
    logAudit(
      "payment_deleted",
      `Diária excluída - R$ ${payment?.amount.toFixed(2) ?? "?"} de ${payment?.employeeName ?? "?"}`,
    );
  };

  const addProduct = (product: Omit<Product, "id">) => {
    const current = getSnapshot();
    updateState({
      products: [...current.products, { ...product, id: crypto.randomUUID() }],
    });
    logAudit("product_created", `Produto cadastrado: ${product.name}`);
  };

  const deleteProduct = (id: string) => {
    const current = getSnapshot();
    const product = current.products.find((p) => p.id === id);
    updateState({
      products: current.products.filter((p) => p.id !== id),
    });
    logAudit("product_deleted", `Produto excluído: ${product?.name ?? "?"}`);
  };

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const current = getSnapshot();
    updateState({
      employees: [
        ...current.employees,
        { ...employee, id: crypto.randomUUID() },
      ],
    });
    logAudit("employee_created", `Funcionário cadastrado: ${employee.name}`);
  };

  const deleteEmployee = (id: string) => {
    const current = getSnapshot();
    const emp = current.employees.find((e) => e.id === id);
    updateState({
      employees: current.employees.filter((e) => e.id !== id),
    });
    logAudit("employee_deleted", `Funcionário excluído: ${emp?.name ?? "?"}`);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const todaySales = snap.sales.filter((s) => s.date.startsWith(todayStr));
  const todayTotal = todaySales.reduce(
    (sum, s) => sum + (s.price?.total ?? 0),
    0,
  );
  const todayPix = todaySales
    .filter((s) => s.paymentMethod === "pix")
    .reduce((sum, s) => sum + (s.price?.total ?? 0), 0);
  const todayCash = todaySales
    .filter((s) => s.paymentMethod === "dinheiro")
    .reduce((sum, s) => sum + (s.price?.total ?? 0), 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthSales = snap.sales.filter((s) => s.date.startsWith(currentMonth));
  const monthTotal = monthSales.reduce(
    (sum, s) => sum + (s.price?.total ?? 0),
    0,
  );
  const monthPix = monthSales
    .filter((s) => s.paymentMethod === "pix")
    .reduce((sum, s) => sum + (s.price?.total ?? 0), 0);
  const monthCash = monthSales
    .filter((s) => s.paymentMethod === "dinheiro")
    .reduce((sum, s) => sum + (s.price?.total ?? 0), 0);

  const todayPayments = snap.dailyPayments.filter((p) =>
    p.date.startsWith(todayStr),
  );
  const todayPaymentsTotal = todayPayments.reduce(
    (sum, p) => sum + (p.amount ?? 0),
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
    updateSale,
    deleteSale,
    addDailyPayment,
    deleteDailyPayment,
    addProduct,
    deleteProduct,
    addEmployee,
    deleteEmployee,
  };
}
