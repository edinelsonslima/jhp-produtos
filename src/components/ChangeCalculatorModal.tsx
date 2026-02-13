import { CurrencyInput } from "@/components/CurrencyInput";
import { formatCurrency, vibrate } from "@/lib/utils";
import { Calculator } from "lucide-react";
import { useState } from "react";
import { Label } from "./ui/label";
import { Modal } from "./ui/modal";

interface Props {
  saleTotal: number;
}

export function ChangeCalculatorModal({ saleTotal }: Props) {
  const [amountPaid, setAmountPaid] = useState(0);

  const getBreakdown = (value: number) => {
    if (value <= 0) {
      return [];
    }

    const result: { denom: number; count: number }[] = [];
    const denominations = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05];

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

  const change = amountPaid - saleTotal;
  const breakdown = getBreakdown(change);

  return (
    <Modal>
      <Modal.Trigger
        as="button"
        type="button"
        title="Calculadora de Troco"
        className="daisy-btn daisy-btn-outline daisy-btn-lg"
        onClick={() => vibrate(100)}
      >
        <Calculator size={18} />
      </Modal.Trigger>

      <Modal.Title>
        <div className="flex items-center gap-3 mb-6">
          <Calculator size={20} className="text-primary" />
          <h3 className="text-lg font-bold">Calculadora de Troco</h3>
        </div>
      </Modal.Title>

      <Modal.Content>
        <div className="mb-3">
          <Label>Valor da Venda</Label>
          <p className="text-2xl font-extrabold font-mono text-primary">
            {formatCurrency(saleTotal)}
          </p>
        </div>

        <div className="">
          <CurrencyInput
            className="text-lg"
            label="Valor Recebido (R$)"
            value={amountPaid}
            onValueChange={setAmountPaid}
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
      </Modal.Content>

      <Modal.Close
        as="button"
        type="button"
        onClick={() => setAmountPaid(0)}
        className="daisy-btn daisy-btn-outline daisy-btn-lg mt-5 w-full"
      >
        Fechar
      </Modal.Close>
    </Modal>
  );
}
