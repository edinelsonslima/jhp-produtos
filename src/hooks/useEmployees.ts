import { logAudit } from "@/lib/audit";
import { Employee } from "@/types";
import { createStore } from "./useStore";

type CreateEmployee = Omit<Employee, "id">;

type Actions = {
  get: (id: string) => Employee | undefined;
  add: (data: CreateEmployee) => void;
  update: (id: string, data: Partial<CreateEmployee>) => void;
  delete: (id: string) => void;
};

type State = {
  employees: Employee[];
};

export const employeeStore = createStore<State, Actions>({
  persist: { key: "employees" },

  createState: () => ({ employees: [] }),

  createActions: (set, get) => ({
    get: (id) => {
      return get().employees.find((e) => e.id === id);
    },

    add: (data) => {
      const employees = get().employees;

      set({
        employees: [...employees, { ...data, id: crypto.randomUUID() }],
      });

      logAudit("employee_created", `Funcionário cadastrado: ${data.name}`);
    },

    update: (id, data) => {
      const employees = get().employees;

      set({
        employees: employees.map((e) => (e.id === id ? { ...e, ...data } : e)),
      });

      logAudit("employee_edited", `Funcionário editado: ${id}`);
    },

    delete: (id) => {
      const employees = get().employees;
      const employee = employees.find((e) => e.id === id);

      const currentEmployees = employees.filter((e) => e.id !== id);

      set({
        employees: currentEmployees,
      });

      logAudit(
        "employee_deleted",
        `Funcionário excluído: ${employee?.name ?? "?"}`,
      );
    },
  }),
});
