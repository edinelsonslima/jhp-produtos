import { Title } from "@/components/_layout/title";
import { Card } from "@/components/_ui/card";
import { toast } from "@/components/_ui/toast";
import { Calendar } from "@/components/calendar";
import { Stat } from "@/components/dashboard/stat";
import { SalesChart } from "@/components/history/chart";
import { SaleItem } from "@/components/sales/item";
import { employeeStore } from "@/hooks/useEmployees";
import { paymentStore } from "@/hooks/usePayments";
import { saleStore } from "@/hooks/useSales";
import { formatCurrency } from "@/lib/utils";
import {
  Banknote,
  DollarSign,
  Minus,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { ComponentProps, useState } from "react";

type HighDateProps = Parameters<
  NonNullable<ComponentProps<typeof Calendar>["highlight"]>
>[0];

type SelectDateProps = Parameters<
  NonNullable<ComponentProps<typeof Calendar>["onSelect"]>
>[0];

export default function History() {
  const sales = saleStore.useStore((s) => s.sales);
  const payments = paymentStore.useStore((s) => s.payments);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const daySales = sales.filter((s) => s.date.startsWith(date));
  const dayPayments = payments.filter((p) => p.date.startsWith(date));

  const totalSales = daySales.reduce((a, s) => a + (s.price?.total ?? 0), 0);
  const totalPix = daySales.reduce((a, s) => a + (s.price?.pix ?? 0), 0);
  const totalCash = daySales.reduce((a, s) => a + (s.price?.cash ?? 0), 0);
  const totalPayments = dayPayments.reduce((a, p) => a + (p.amount ?? 0), 0);
  const net = totalSales - totalPayments;

  const currentDateSelected = {
    day: parseInt(date.split("-")[2], 10),
    month: parseInt(date.split("-")[1], 10) - 1,
    year: parseInt(date.split("-")[0], 10),
  };

  const handleSelectDate = ({ day, month, year }: SelectDateProps) => {
    const m = (month + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    const date = `${year}-${m}-${d}`;
    setDate(date);
  };

  const hasSalesOnDay = ({ day, month, year, selected }: HighDateProps) => {
    const m = (month + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    const dateStr = `${year}-${m}-${d}`;
    return sales.some((s) => s.date.startsWith(dateStr)) && !selected;
  };

  const handleDelete = (id: string) => {
    saleStore.action.delete(id);
    toast.success("Venda excluída");
  };

  return (
    <>
      <Title
        title="Histórico"
        subtitle="Visualize vendas e pagamentos por dia"
      />

      <Calendar onSelect={handleSelectDate} highlight={hasSalesOnDay} />

      <p className="text-sm text-base-content/60 capitalize">
        {new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <SalesChart
        day={currentDateSelected.day}
        year={currentDateSelected.year}
        month={currentDateSelected.month}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          title="Vendas"
          value={totalSales}
          icon={{ element: DollarSign, variant: "primary" }}
        />
        <Stat
          title="Pix"
          value={totalPix}
          icon={{ element: Smartphone, variant: "success" }}
          variant="success"
        />
        <Stat
          title="Dinheiro"
          value={totalCash}
          icon={{ element: Banknote, variant: "warning" }}
          variant="warning"
        />
        <Stat
          title="Diárias"
          value={totalPayments}
          icon={{ element: Minus, variant: "error" }}
          variant="error"
        />
      </div>

      <Card variant={net >= 0 ? "success" : "error"}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
              Líquido do Dia
            </p>
            <p className="text-2xl font-extrabold font-mono mt-1">
              {formatCurrency(net)}
            </p>
          </div>
          <TrendingUp size={24} className="text-base-content/20" />
        </div>
      </Card>

      {dayPayments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
            Pagamentos ({dayPayments.length})
          </h3>
          <Card className="divide-y divide-base-300 p-0 overflow-hidden">
            {dayPayments.map((payment) => {
              const emp = payment.receiver?.id
                ? employeeStore.action.get(payment.receiver.id)
                : null;

              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-xs font-bold text-base-content/60">
                      {emp?.name?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <p className="text-sm font-semibold">
                      {emp?.name ?? "Externo"}
                    </p>
                  </div>
                  <p className="text-sm font-bold font-mono">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
          Vendas do Dia ({daySales.length})
        </h3>

        {daySales.length === 0 ? (
          <Card className="text-center text-base-content/60 text-sm py-8">
            Nenhuma venda neste dia
          </Card>
        ) : (
          <div className="space-y-2">
            {daySales.map((sale) => (
              <SaleItem
                key={sale.id}
                saleId={sale.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
