import { productStore } from "@/hooks/useProducts";
import { saleStore } from "@/hooks/useSales";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Banknote,
  ChevronDown,
  Pencil,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface SaleItemProps {
  saleId: string;
  onDelete?: (id: string) => void;
}

export function SaleItem({ saleId, onDelete }: SaleItemProps) {
  const [open, setOpen] = useState(false);

  const sale = saleStore.useStore((state) => {
    return state.sales.find((s) => s.id === saleId);
  });

  if (!sale) {
    return null;
  }

  return (
    <div className="border-b border-base-300 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 md:hover:bg-base-200/50 transition-colors"
      >
        <div className="flex flex-col items-start gap-1">
          <p className="text-sm font-semibold">
            Venda • {sale.products?.length ?? 0} itens
          </p>
          <p className="text-xs text-base-content/60">
            {formatDateTime(sale.date)}
          </p>
          <div className="flex items-center gap-3 text-xs text-base-content/60 mt-1">
            {sale.price?.cash > 0 && (
              <span className="flex items-center gap-1">
                <Banknote size={12} className="text-warning" />
                {formatCurrency(sale.price.cash)}
              </span>
            )}
            {sale.price?.pix > 0 && (
              <span className="flex items-center gap-1">
                <Smartphone size={12} className="text-success" />
                {formatCurrency(sale.price.pix)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono font-bold">
            {formatCurrency(sale.price?.total ?? 0)}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 opacity-50 transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-4 space-y-2">
          <div className="space-y-1 pt-3 border-t border-dashed border-base-300">
            {sale.products?.map((p) => {
              const product = productStore.action.get(p.id);
              console.log(p);

              if (!product) {
                return null;
              }

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="truncate">
                    {product.name} ({product.unit === "litro" ? "L" : "un."})
                  </span>
                  <span className="flex-1 mx-2 border-b border-dotted border-base-content/20 translate-y-1" />
                  <span className="text-base-content/60">{p.quantity}x</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t border-dashed border-base-300">
            <Link
              to={`/vendas/${sale.id}/editar`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-base-300 px-3 py-2 text-xs font-medium hover:bg-base-200 transition-colors"
            >
              <Pencil size={12} /> Editar
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(sale.id)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-error/30 px-3 py-2 text-xs font-medium text-error hover:bg-error/10 transition-colors"
              >
                <Trash2 size={12} /> Excluir
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
