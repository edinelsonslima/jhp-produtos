import { CurrencyInput } from "@/components/CurrencyInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useStore } from "@/hooks/useStore";
import { cn, formatCurrency } from "@/lib/utils";
import { Employee } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DailyPayments() {
  const {
    dailyPayments,
    employees,
    addDailyPayment,
    deleteDailyPayment,
    addEmployee,
    deleteEmployee,
    todayPaymentsTotal,
  } = useStore();

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [customAmount, setCustomAmount] = useState(0);

  const [newName, setNewName] = useState("");
  const [newRate1, setNewRate1] = useState(0);
  const [newRate2, setNewRate2] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setCustomAmount(0);
  };

  const handlePayPreset = (amount: number) => {
    if (!selectedEmployee) return;
    addDailyPayment({
      employeeName: selectedEmployee.name,
      employeeId: selectedEmployee.id,
      amount,
      date: new Date().toISOString().split("T")[0],
    });
    toast.success(
      `Diária de ${formatCurrency(amount)} registrada para ${selectedEmployee.name}!`,
    );
  };

  const handlePayCustom = () => {
    if (!selectedEmployee) return;
    if (customAmount <= 0) {
      toast.error("Informe um valor válido");
      return;
    }
    addDailyPayment({
      employeeName: selectedEmployee.name,
      employeeId: selectedEmployee.id,
      amount: customAmount,
      date: new Date().toISOString().split("T")[0],
    });
    toast.success(
      `Diária de ${formatCurrency(customAmount)} registrada para ${selectedEmployee.name}!`,
    );
    setCustomAmount(0);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim() || newName.trim().length < 2) {
      toast.error("Nome deve ter ao menos 2 caracteres");
      return;
    }

    addEmployee({
      name: newName.trim(),
      defaultRates: [newRate1, newRate2],
    });
    toast.success("Funcionário cadastrado!");
    setNewName("");
    setNewRate1(0);
    setNewRate2(0);
    setDialogOpen(false);
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const todayPayments = dailyPayments.filter((p) => p.date === todayStr);
  const otherPayments = dailyPayments.filter((p) => p.date !== todayStr);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-extrabold tracking-tight">Diárias</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Selecione um funcionário e registre a diária
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border bg-card p-4"
      >
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-2">
            {employees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => handleSelectEmployee(emp)}
                className={cn(
                  "flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-xl transition-all duration-200",
                  selectedEmployee?.id === emp.id
                    ? "bg-primary/10 ring-2 ring-primary scale-105"
                    : "hover:bg-muted",
                )}
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-colors",
                    selectedEmployee?.id === emp.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
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

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-xl hover:bg-muted transition-colors">
                  <div className="w-14 h-14 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <Plus size={20} className="text-muted-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Novo
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Funcionário</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleAddEmployee}
                  className="space-y-4 mt-2"
                >
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Nome do funcionário"
                      maxLength={100}
                      minLength={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Diária Opção 1 (R$)</Label>
                      <CurrencyInput
                        value={newRate1}
                        onValueChange={setNewRate1}
                        placeholder="Ex: 80,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Diária Opção 2 (R$)</Label>
                      <CurrencyInput
                        value={newRate2}
                        onValueChange={setNewRate2}
                        placeholder="Ex: 100,00"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Plus size={16} /> Cadastrar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </motion.div>

      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            key={selectedEmployee.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="rounded-xl border bg-card p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {selectedEmployee.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{selectedEmployee.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Selecione o valor da diária
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  deleteEmployee(selectedEmployee.id);
                  setSelectedEmployee(null);
                  toast.info("Funcionário removido");
                }}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {selectedEmployee.defaultRates
                .filter((r) => r > 0)
                .map((rate, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="h-16 text-lg font-mono font-bold hover:bg-primary/10 hover:border-primary"
                    onClick={() => handlePayPreset(rate)}
                  >
                    {formatCurrency(rate)}
                  </Button>
                ))}
            </div>

            <div className="flex gap-2">
              <CurrencyInput
                value={customAmount}
                onValueChange={setCustomAmount}
                placeholder="Valor personalizado"
                className="flex-1"
              />
              <Button onClick={handlePayCustom} className="gap-2 shrink-0">
                <Plus size={16} /> Registrar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl border bg-destructive/10 border-destructive/30 p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
          Total Diárias Hoje
        </p>
        <p className="text-2xl font-extrabold font-mono text-destructive mt-1">
          {formatCurrency(todayPaymentsTotal)}
        </p>
      </div>

      {todayPayments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Hoje
          </h3>
          <div className="rounded-xl border bg-card overflow-hidden divide-y divide-border">
            {todayPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {p.employeeName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-semibold">{p.employeeName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold font-mono">
                    {formatCurrency(p.amount)}
                  </p>
                  <button
                    onClick={() => {
                      deleteDailyPayment(p.id);
                      toast.info("Diária removida");
                    }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {otherPayments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Anteriores
          </h3>
          <div className="rounded-xl border bg-card overflow-hidden divide-y divide-border">
            {otherPayments.slice(0, 20).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {p.employeeName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.employeeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold font-mono">
                  {formatCurrency(p.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
