import { saleStore } from "@/hooks/useSales";
import { formatCurrency } from "@/lib/utils";
import { m } from "framer-motion";
import { Card } from "../_ui/card";

interface Props {
  year: number;
  month: number;
}

export function SalesChart({ year, month }: Props) {
  const sales = saleStore.useStore((s) => s.sales);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dailyTotals = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const mm = (month + 1).toString().padStart(2, "0");
    const dd = day.toString().padStart(2, "0");
    const dateStr = `${year}-${mm}-${dd}`;

    return sales
      .filter((s) => s.date.startsWith(dateStr))
      .reduce((acc, s) => acc + (s.price?.total ?? 0), 0);
  });

  const max = Math.max(...dailyTotals, 1);
  const monthTotal = dailyTotals.reduce((a, b) => a + b, 0);

  if (monthTotal === 0) return null;

  return (
    <Card>
      <Card.Title>VENDAS POR DIA</Card.Title>

      <div className="flex items-end gap-[2px] h-28 mt-3">
        {dailyTotals.map((total, i) => {
          const height = (total / max) * 100;

          return (
            <m.div
              key={i}
              className="flex-1 bg-primary/50 rounded-t-sm relative group cursor-pointer hover:bg-primary transition-colors"
              style={{ minHeight: total > 0 ? 4 : 2 }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 2)}%` }}
              transition={{ delay: i * 0.02, duration: 0.4, ease: "easeOut" }}
            >
              {total > 0 && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-base-300 text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {i + 1}: {formatCurrency(total)}
                </div>
              )}
            </m.div>
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-base-content/40 mt-1">
        <span>1</span>
        <span>{Math.ceil(daysInMonth / 2)}</span>
        <span>{daysInMonth}</span>
      </div>

      <p className="text-xs text-base-content/60 mt-2">
        Total do mês: <strong className="font-mono">{formatCurrency(monthTotal)}</strong>
      </p>
    </Card>
  );
}
