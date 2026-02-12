import { CurrencyInput } from "@/components/CurrencyInput";
import { formatCurrency } from "@/lib/utils";
import { Calculator } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  saleTotal: number;
  open: boolean;
  onClose: () => void;
}

export function ChangeCalculatorModal({ saleTotal, open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [amountPaid, setAmountPaid] = useState(0);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (open) setAmountPaid(0);
  }, [open]);

  const change = amountPaid - saleTotal;

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
    <dialog
      ref={ref}
      className="modal modal-bottom md:modal-middle"
      onClose={onClose}
    >
      <div className="modal-box w-full max-h-[70dvh] md:max-h-none md:max-w-md space-y-5">
        <div className="flex items-center gap-3">
          <Calculator size={20} className="text-primary" />
          <h3 className="text-lg font-bold">Calculadora de Troco</h3>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-base-content/60">
            Valor da Venda
          </label>
          <p className="text-2xl font-extrabold font-mono text-primary">
            {formatCurrency(saleTotal)}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Valor Recebido (R$)</label>
          <CurrencyInput
            value={amountPaid}
            onValueChange={setAmountPaid}
            className="text-lg"
          />
        </div>

        {amountPaid > 0 && (
          <div className="pt-4 border-t border-base-300">
            <p className="text-xs text-base-content/60 uppercase tracking-wide font-semibold mb-2">
              Troco
            </p>
            <p
              className={`text-4xl font-extrabold font-mono ${change >= 0 ? "text-success" : "text-error"}`}
            >
              {change >= 0
                ? formatCurrency(change)
                : `− ${formatCurrency(Math.abs(change))}`}
            </p>
            {change < 0 && (
              <p className="text-sm text-error mt-2">
                Valor recebido é menor que o valor da venda!
              </p>
            )}
            {breakdown.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-base-content/60 font-semibold uppercase tracking-wide">
                  Devolver
                </p>
                <div className="flex flex-wrap gap-2">
                  {breakdown.map(({ denom, count }) => (
                    <span
                      key={denom}
                      className="inline-flex items-center gap-1 rounded-lg bg-base-200 px-3 py-1.5 text-sm font-mono font-bold"
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

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Fechar</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
