import { CurrencyInput } from "@/components/CurrencyInput";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import { employeeStore } from "@/hooks/useEmployees";
import { paymentStore } from "@/hooks/usePayments";
import { cn, formatCurrency } from "@/lib/utils";
import { Employee } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Payments() {
  const payments = paymentStore.useStore((state) => state.payments);
  const employees = employeeStore.useStore((state) => state.employees);
  const todayPayments = paymentStore.useStore((state) => state.today);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [customAmount, setCustomAmount] = useState(0);

  const [newName, setNewName] = useState("");
  const [newRate1, setNewRate1] = useState(0);
  const [newRate2, setNewRate2] = useState(0);

  const handleSelectEmployee = (emp: Employee) => {
    setEmployee(emp);
    setCustomAmount(0);
  };

  const handlePayPreset = (amount: number) => {
    if (!employee) {
      return;
    }

    paymentStore.action.add({
      date: new Date().toISOString(),
      amount,
      receiver: { id: employee.id, type: "employee" },
    });

    toast.success(
      `Diária de ${formatCurrency(amount)} registrada para ${employee.name}!`,
    );
  };

  const handlePayCustom = () => {
    if (!employee) {
      return;
    }

    if (customAmount <= 0) {
      toast.error("Informe um valor válido");
      return;
    }

    paymentStore.action.add({
      date: new Date().toISOString(),
      amount: customAmount,
      receiver: { id: employee.id, type: "employee" },
    });

    toast.success(
      `Diária de ${formatCurrency(customAmount)} registrada para ${employee.name}!`,
    );

    setCustomAmount(0);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName.trim().length < 2) {
      toast.error("Nome deve ter ao menos 2 caracteres");
      return;
    }

    employeeStore.action.add({
      name: newName.trim(),
      defaultRates: [newRate1, newRate2],
    });

    toast.success("Funcionário cadastrado!");
    setNewName("");
    setNewRate1(0);
    setNewRate2(0);
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const otherPayments = payments.filter((p) => !p.date.startsWith(todayStr));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 w-full overflow-x-auto p-4 rounded-xl border border-base-300 bg-base-100"
      >
        <Modal>
          <Modal.Trigger
            as="button"
            type="button"
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-base-200 transition-colors cursor-pointer"
          >
            <div className="size-14 rounded-full bg-base-200 border-2 border-dashed border-base-content/20 flex items-center justify-center">
              <Plus size={20} className="text-base-content/60" />
            </div>
            <span className="text-xs font-semibold text-base-content/60">
              Novo
            </span>
          </Modal.Trigger>

          <Modal.Title className="text-lg font-bold">
            Cadastrar Funcionário
          </Modal.Title>

          <Modal.Content
            as="form"
            id="add-employee-form"
            className="space-y-4 mt-4"
            onSubmit={handleAddEmployee}
          >
            <div className="space-y-2">
              <Label>Nome</Label>
              <input
                className="daisy-input daisy-input-bordered w-full"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome do funcionário"
                maxLength={100}
                minLength={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <CurrencyInput
                  value={newRate1}
                  label="Diária Opção 1 (R$)"
                  placeholder="Ex: 20,00"
                  onValueChange={setNewRate1}
                />
              </div>

              <div className="space-y-2">
                <CurrencyInput
                  value={newRate2}
                  label="Diária Opção 2 (R$)"
                  placeholder="Ex: 40,00"
                  onValueChange={setNewRate2}
                />
              </div>
            </div>
          </Modal.Content>

          <Modal.Actions>
            {({ close }) => [
              <button
                key="submit"
                type="submit"
                form="add-employee-form"
                className="daisy-btn daisy-btn-primary gap-2"
              >
                <Plus size={16} /> Cadastrar
              </button>,
              <button
                key="button"
                type="button"
                className="daisy-btn"
                onClick={close}
              >
                Cancelar
              </button>,
            ]}
          </Modal.Actions>
        </Modal>

        {employees.map((emp) => (
          <button
            key={emp.id}
            onClick={() => handleSelectEmployee(emp)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 cursor-pointer",
              employee?.id === emp.id
                ? "bg-primary/10 ring-2 ring-primary scale-105"
                : "hover:bg-base-200",
            )}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-colors",
                employee?.id === emp.id
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content/60",
              )}
            >
              {emp.avatarUrl ? (
                <img
                  src={emp.avatarUrl}
                  alt={emp.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                emp.name.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-xs font-semibold text-center truncate w-full">
              {emp.name}
            </span>
          </button>
        ))}
      </motion.div>

      <AnimatePresence>
        {employee && (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="rounded-xl border border-base-300 bg-base-100 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{employee.name}</p>
                  <p className="text-xs text-base-content/60">
                    Selecione o valor da diária
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  employeeStore.action.delete(employee.id);
                  setEmployee(null);
                  toast.info("Funcionário removido");
                }}
                className="p-2 rounded-lg text-base-content/60 hover:text-error hover:bg-error/10 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {employee.defaultRates
                .filter((r) => r > 0)
                .map((rate, i) => (
                  <button
                    key={i}
                    className="daisy-btn daisy-btn-outline h-16 text-lg font-mono font-bold hover:bg-primary/10 hover:border-primary"
                    onClick={() => handlePayPreset(rate)}
                  >
                    {formatCurrency(rate)}
                  </button>
                ))}
            </div>

            <div className="flex gap-2">
              <CurrencyInput
                value={customAmount}
                onValueChange={setCustomAmount}
                placeholder="Valor personalizado"
                className="flex-1"
              />
              <button
                onClick={handlePayCustom}
                className="daisy-btn daisy-btn-primary gap-2 shrink-0"
              >
                <Plus size={16} /> Registrar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl border border-error/30 bg-error/10 p-5">
        <p className="text-xs text-base-content/60 uppercase tracking-wide font-semibold">
          Total Diárias Hoje
        </p>
        <p className="text-2xl font-extrabold font-mono text-error mt-1">
          {formatCurrency(todayPayments.total)}
        </p>
      </div>

      {todayPayments.paymentId.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
            Hoje
          </h3>
          <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden divide-y divide-base-300">
            {todayPayments.paymentId.map((paymentId) => {
              const payment = paymentStore.action.get(paymentId);
              if (!payment?.receiver?.id) {
                return null;
              }

              const emp = employeeStore.action.get(payment.receiver.id);
              if (!emp) {
                return null;
              }

              return (
                <div
                  key={paymentId}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-xs font-bold text-base-content/60">
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold">{emp.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold font-mono">
                      {formatCurrency(payment.amount)}
                    </p>
                    <button
                      onClick={() => {
                        paymentStore.action.delete(payment.id);
                        toast.info("Diária removida");
                      }}
                      className="p-2 rounded-lg text-base-content/60 hover:text-error hover:bg-error/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {otherPayments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
            Anteriores
          </h3>
          <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden divide-y divide-base-300">
            {otherPayments.slice(0, 20).map((payment) => {
              if (!payment.receiver?.id) return null;
              const emp = employeeStore.action.get(payment.receiver.id);
              if (!emp) return null;

              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-xs font-bold text-base-content/60">
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{emp.name}</p>
                      <p className="text-xs text-base-content/60">
                        {new Date(payment.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold font-mono">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
