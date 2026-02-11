import { CurrencyInput } from "@/components/CurrencyInput";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { useState } from "react";

export default function ChangeCalculator() {
  const [saleValue, setSaleValue] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);

  const change = amountPaid - saleValue;

  const getBreakdown = (value: number) => {
    if (value <= 0) return [];
    const denominations = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05];
    const result: { denom: number; count: number }[] = [];
    let remaining = Math.round(value * 100) / 100;
    for (const d of denominations) {
      const count = Math.floor(remaining / d);
      if (count > 0) {
        result.push({ denom: d, count });
        remaining = Math.round((remaining - d * count) * 100) / 100;
      }
    }
    return result;
  };

  const breakdown = getBreakdown(change);

  return (
    <div className="max-w-md mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-extrabold tracking-tight">
          Calculadora de Troco
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Calcule o troco rapidamente
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border bg-card p-6 space-y-5"
      >
        <div className="space-y-2">
          <Label>Valor da Venda (R$)</Label>
          <CurrencyInput
            value={saleValue}
            onValueChange={setSaleValue}
            className="text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label>Valor Recebido (R$)</Label>
          <CurrencyInput
            value={amountPaid}
            onValueChange={setAmountPaid}
            className="text-lg"
          />
        </div>

        {amountPaid > 0 && saleValue > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <Calculator size={20} className="text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Troco
              </p>
            </div>
            <p
              className={`text-4xl font-extrabold font-mono ${change >= 0 ? "text-success" : "text-destructive"}`}
            >
              {change >= 0
                ? formatCurrency(change)
                : `− ${formatCurrency(Math.abs(change))}`}
            </p>
            {change < 0 && (
              <p className="text-sm text-destructive mt-2">
                Valor recebido é menor que o valor da venda!
              </p>
            )}

            {breakdown.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                  Devolver
                </p>
                <div className="flex flex-wrap gap-2">
                  {breakdown.map(({ denom, count }) => (
                    <span
                      key={denom}
                      className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-sm font-mono font-bold"
                    >
                      {count}×{" "}
                      {denom >= 1
                        ? `R$${denom}`
                        : `${(denom * 100).toFixed(0)}¢`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
