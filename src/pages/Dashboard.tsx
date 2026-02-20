import { Title } from "@/components/_layout/title";
import { Card } from "@/components/_ui/card";
import { toast } from "@/components/_ui/toast";
import { SaleItem } from "@/components/Sales/item";
import StatCard from "@/components/StatCard";
import { authStore } from "@/hooks/useAuth";
import { paymentStore } from "@/hooks/usePayments";
import { saleStore } from "@/hooks/useSales";
import { formatCurrency } from "@/lib/utils";
import { m } from "framer-motion";
import {
  Banknote,
  DollarSign,
  Minus,
  Smartphone,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const user = authStore.useStore((state) => state.user);
  const todaySales = saleStore.useStore((state) => state.today);
  const monthSales = saleStore.useStore((state) => state.month);
  const todayPayments = paymentStore.useStore((state) => state.today);

  const todayNet = todaySales.total - todayPayments.total;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const handleDelete = (id: string) => {
    saleStore.action.delete(id);
    toast.success("Venda excluída");
  };

  return (
    <>
      <Title
        title={`${getGreeting()}, ${user?.name?.split(" ")[0] ?? ""}!`}
        subtitle={`Resumo do dia ${new Date().toLocaleDateString("pt-BR")}`}
      />

      <Card appearance="ghost">
        <Card.Title>HOJE</Card.Title>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Vendido",
              value: todaySales.total,
              icon: DollarSign,
              variant: undefined,
            },
            {
              title: "Pix",
              value: todaySales.pix,
              icon: Smartphone,
              variant: "success",
            },
            {
              title: "Dinheiro",
              value: todaySales.cash,
              icon: Banknote,
              variant: "warning",
            },
            {
              title: "Diárias Pagas",
              value: todayPayments.total,
              icon: Minus,
              variant: "error",
            },
          ].map((item) => (
            <Card key={item.title} variant={item.variant}>
              <Card.Title className="text-xs uppercase">
                {item.title}
              </Card.Title>

              <div className="flex items-center justify-between">
                <p className="text-xl sm:text-2xl font-extrabold mt-1 font-mono truncate">
                  {formatCurrency(item.value)}
                </p>

                <item.icon
                  size={18}
                  className={Card.getStyle(`text-${item.variant} p-2`, {
                    variant: item.variant,
                    modifier: "square",
                    size: "lg",
                  })}
                />
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={Card.getStyle("p-6")}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
              Líquido Hoje
            </p>
            <p
              className={`text-2xl sm:text-3xl font-extrabold mt-1 font-mono ${todayNet >= 0 ? "text-success" : "text-error"}`}
            >
              {formatCurrency(todayNet)}
            </p>
            <p className="text-xs text-base-content/60 mt-1">
              Total vendido − diárias pagas
            </p>
          </div>
          <TrendingUp size={28} className="text-base-content/20" />
        </div>
      </m.div>

      <div>
        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
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
            variant="success"
            delay={0.3}
          />
          <StatCard
            label="Dinheiro no Mês"
            value={formatCurrency(monthSales.cash)}
            icon={Banknote}
            variant="warning"
            delay={0.35}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
          Vendas de Hoje ({todaySales.saleId.length})
        </h3>

        {todaySales.saleId.length === 0 ? (
          <Card className="p-8 text-center text-base-content/60 text-sm">
            Nenhuma venda registrada hoje
          </Card>
        ) : (
          <div className="space-y-2">
            {todaySales.saleId.slice(0, 10).map((saleId) => (
              <SaleItem key={saleId} saleId={saleId} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
