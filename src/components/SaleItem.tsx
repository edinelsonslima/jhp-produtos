import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Sale } from "@/types";
import { Banknote, ChevronDown, Pencil, Smartphone, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface SaleItemProps {
  sale: Sale;
  onDelete?: (id: string) => void;
}

export function SaleItem({ sale, onDelete }: SaleItemProps) {
  return (
    <Collapsible className="border-b last:border-b-0">
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between px-5 py-4 md:hover:bg-accent/40 transition-colors">
          <div className="flex flex-col items-start gap-1">
            <p className="text-sm font-semibold">
              Venda • {sale.products.length} itens
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(sale.date)}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              {sale.price.cash > 0 && (
                <span className="flex items-center gap-1">
                  <Banknote size={12} className="text-cash" />
                  {formatCurrency(sale.price.cash)}
                </span>
              )}
              {sale.price.pix > 0 && (
                <span className="flex items-center gap-1">
                  <Smartphone size={12} className="text-pix" />
                  {formatCurrency(sale.price.pix)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono font-bold">
              {formatCurrency(sale.price.total)}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="px-5 pb-4 space-y-2 border-t border-dashed">
        <div className="space-y-1 mt-3">
          {sale.products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="truncate">
                {p.name} ({p.unit === "litro" ? "L" : "un."})
              </span>
              <span className="flex-1 mx-2 border-b border-dotted border-muted-foreground/50 translate-y-1" />
              <span className="text-muted-foreground">{p.quantity}x</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-3 pt-3 border-t border-dashed">
          <Link
            to={`/vendas/${sale.id}/editar`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted transition-colors"
          >
            <Pencil size={12} /> Editar
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(sale.id)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 size={12} /> Excluir
            </button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
