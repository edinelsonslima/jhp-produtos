import { Title } from "@/components/_layout/title";
import { Button } from "@/components/_ui/button";
import { Card } from "@/components/_ui/card";
import { toast } from "@/components/_ui/toast";
import { Stat } from "@/components/dashboard/stat";
import { SalesChart } from "@/components/history/chart";
import { SaleItem } from "@/components/sales/item";
import { employeeStore } from "@/hooks/useEmployees";
import { paymentStore } from "@/hooks/usePayments";
import { saleStore } from "@/hooks/useSales";
import { formatCurrency } from "@/lib/utils";
import { m } from "framer-motion";
import {
  Banknote,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Minus,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function History() {
  const sales = saleStore.useStore((s) => s.sales);
  const payments = paymentStore.useStore((s) => s.payments);

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const daySales = sales.filter((s) => s.date.startsWith(selectedDate));
  const dayPayments = payments.filter((p) => p.date.startsWith(selectedDate));

  const totalSales = daySales.reduce((a, s) => a + (s.price?.total ?? 0), 0);
  const totalPix = daySales.reduce((a, s) => a + (s.price?.pix ?? 0), 0);
  const totalCash = daySales.reduce((a, s) => a + (s.price?.cash ?? 0), 0);
  const totalPayments = dayPayments.reduce((a, p) => a + (p.amount ?? 0), 0);
  const net = totalSales - totalPayments;

  const handleDelete = (id: string) => {
    saleStore.action.delete(id);
    toast.success("Venda excluída");
  };

  const daysInMonth = new Date(
    viewMonth.year,
    viewMonth.month + 1,
    0,
  ).getDate();
  const firstDayOfWeek = new Date(viewMonth.year, viewMonth.month, 1).getDay();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const prevMonth = () =>
    setViewMonth((v) =>
      v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { ...v, month: v.month - 1 },
    );

  const nextMonth = () =>
    setViewMonth((v) =>
      v.month === 11
        ? { year: v.year + 1, month: 0 }
        : { ...v, month: v.month + 1 },
    );

  const selectDay = (day: number) => {
    const m = (viewMonth.month + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    setSelectedDate(`${viewMonth.year}-${m}-${d}`);
  };

  const hasSalesOnDay = (day: number) => {
    const m = (viewMonth.month + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    const dateStr = `${viewMonth.year}-${m}-${d}`;
    return sales.some((s) => s.date.startsWith(dateStr));
  };

  const selectedDay = parseInt(selectedDate.split("-")[2]);
  const selectedMonth = parseInt(selectedDate.split("-")[1]) - 1;
  const selectedYear = parseInt(selectedDate.split("-")[0]);

  const formattedDate = new Date(selectedDate + "T12:00:00").toLocaleDateString(
    "pt-BR",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  );

  return (
    <>
      <Title
        title="Histórico"
        subtitle="Visualize vendas e pagamentos por dia"
      />

      <Card>
        <div className="flex items-center justify-between mb-4">
          <Button
            size="sm"
            appearance="ghost"
            modifier="square"
            onClick={prevMonth}
          >
            <ChevronLeft size={18} />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span className="font-semibold text-sm">
              {monthNames[viewMonth.month]} {viewMonth.year}
            </span>
          </div>
          <Button
            size="sm"
            appearance="ghost"
            modifier="square"
            onClick={nextMonth}
          >
            <ChevronRight size={18} />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
            <span key={i} className="font-semibold text-base-content/40 py-1">
              {d}
            </span>
          ))}

          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <span key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isSelected =
              day === selectedDay &&
              viewMonth.month === selectedMonth &&
              viewMonth.year === selectedYear;
            const hasData = hasSalesOnDay(day);
            const isToday =
              day === new Date().getDate() &&
              viewMonth.month === new Date().getMonth() &&
              viewMonth.year === new Date().getFullYear();

            return (
              <button
                key={day}
                onClick={() => selectDay(day)}
                className={`relative py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-content"
                    : isToday
                      ? "bg-primary/20 text-primary font-bold"
                      : "hover:bg-base-200"
                }`}
              >
                {day}
                {hasData && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-success" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <SalesChart year={viewMonth.year} month={viewMonth.month} />

      <m.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-base-content/60 capitalize"
      >
        {formattedDate}
      </m.p>

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
