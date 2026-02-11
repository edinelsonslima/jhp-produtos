import { SaleItem } from "@/components/SaleItem";
import StatCard from "@/components/StatCard";
import { toast } from "@/components/ui/sonner";
import { authStore } from "@/hooks/useAuth";
import { paymentStore } from "@/hooks/usePayments";
import { saleStore } from "@/hooks/useSales";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Banknote,
  DollarSign,
  Minus,
  Smartphone,
  TrendingUp,
} from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Dashboard() {
  const user = authStore.useStore((state) => state.user);

  const todaySales = saleStore.useStore((state) => state.today);
  const monthSales = saleStore.useStore((state) => state.month);

  const todayPayments = paymentStore.useStore((state) => state.today);

  const todayNet = todaySales.total - todayPayments.total;
  const firstName = user?.name?.split(" ")[0] ?? "";

  const handleDelete = (id: string) => {
    saleStore.action.delete(id);
    toast.success("Venda excluída");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-extrabold tracking-tight">
          {getGreeting()}, {firstName}!
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Resumo do dia {new Date().toLocaleDateString("pt-BR")}
        </p>
      </motion.div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Hoje
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Vendido"
            value={formatCurrency(todaySales.total)}
            icon={DollarSign}
            delay={0}
          />
          <StatCard
            label="Pix"
            value={formatCurrency(todaySales.pix)}
            icon={Smartphone}
            variant="pix"
            delay={0.05}
          />
          <StatCard
            label="Dinheiro"
            value={formatCurrency(todaySales.cash)}
            icon={Banknote}
            variant="cash"
            delay={0.1}
          />
          <StatCard
            label="Diárias Pagas"
            value={formatCurrency(todaySales.total)}
            icon={Minus}
            variant="destructive"
            delay={0.15}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border bg-card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Líquido Hoje
            </p>
            <p
              className={`text-2xl sm:text-3xl font-extrabold mt-1 font-mono ${todayNet >= 0 ? "text-success" : "text-destructive"}`}
            >
              {formatCurrency(todayNet)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total vendido − diárias pagas
            </p>
          </div>
          <TrendingUp size={28} className="text-muted-foreground/40" />
        </div>
      </motion.div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Este Mês
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Total Mês"
            value={formatCurrency(monthSales.total)}
            icon={DollarSign}
            delay={0.25}
          />
          <StatCard
            label="Pix no Mês"
            value={formatCurrency(monthSales.pix)}
            icon={Smartphone}
            variant="pix"
            delay={0.3}
          />
          <StatCard
            label="Dinheiro no Mês"
            value={formatCurrency(monthSales.cash)}
            icon={Banknote}
            variant="cash"
            delay={0.35}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Vendas de Hoje ({todaySales.saleId.length})
        </h3>
        {todaySales.saleId.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground text-sm">
            Nenhuma venda registrada hoje
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden">
            {todaySales.saleId.slice(0, 10).map((saleId) => (
              <SaleItem key={saleId} saleId={saleId} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
