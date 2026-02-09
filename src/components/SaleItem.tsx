import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Sale } from "@/types";
import { Banknote, ChevronDown, Smartphone } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface SaleItemProps {
  sale: Sale;
}

export function SaleItem({ sale }: SaleItemProps) {
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
      </CollapsibleContent>
    </Collapsible>
  );
}
