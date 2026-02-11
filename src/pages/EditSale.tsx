import { CurrencyInput } from "@/components/CurrencyInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks/useStore";
import { cn, formatCurrency } from "@/lib/utils";
import { PaymentMethod, SaleProduct } from "@/types";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  Minus,
  Plus,
  Save,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function EditSale() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sales, updateSale, deleteSale } = useStore();

  const sale = sales.find((s) => s.id === id);

  const [products, setProducts] = useState<SaleProduct[]>(
    sale?.products ?? [],
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    sale?.paymentMethod ?? "dinheiro",
  );
  const [cashAmount, setCashAmount] = useState(sale?.price.cash ?? 0);
  const [pixAmount, setPixAmount] = useState(sale?.price.pix ?? 0);

  if (!sale) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Venda não encontrada</p>
        <Link to="/" className="text-primary underline mt-4 inline-block">
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const mixedTotal = cashAmount + pixAmount;

  const updateQuantity = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev
        .map((p) =>
          p.id === productId
            ? { ...p, quantity: Math.max(0, p.quantity + delta) }
            : p,
        )
        .filter((p) => p.quantity > 0),
    );
  };

  const handleSave = () => {
    if (products.length === 0) {
      toast.error("A venda precisa ter pelo menos um produto");
      return;
    }

    if (
      paymentMethod === "combinado" &&
      Math.abs(mixedTotal - total) > 0.01
    ) {
      toast.error("Valores em dinheiro e PIX devem ser igual ao total");
      return;
    }

    updateSale(sale.id, {
      products,
      paymentMethod,
      price: {
        total,
        cash:
          paymentMethod === "dinheiro"
            ? total
            : paymentMethod === "combinado"
              ? cashAmount
              : 0,
        pix:
          paymentMethod === "pix"
            ? total
            : paymentMethod === "combinado"
              ? pixAmount
              : 0,
      },
    });

    toast.success("Venda atualizada!");
    navigate(-1);
  };

  const handleDelete = () => {
    deleteSale(sale.id);
    toast.success("Venda excluída");
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Editar Venda
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date(sale.date).toLocaleString("pt-BR")}
          </p>
        </div>
      </motion.div>

      <div className="rounded-xl border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Produtos ({products.length})
        </h3>
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {formatCurrency(p.price)} /{" "}
                {p.unit === "litro" ? "L" : "un."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(p.id, -1)}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-destructive/20 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-mono font-bold">
                {p.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(p.id, 1)}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Todos os produtos foram removidos
          </p>
        )}
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Forma de Pagamento
        </h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={paymentMethod === "dinheiro" ? "default" : "outline"}
            className={cn(
              "flex-1 gap-2",
              paymentMethod === "dinheiro" &&
                "bg-cash text-cash-foreground hover:bg-cash/90",
            )}
            onClick={() => setPaymentMethod("dinheiro")}
          >
            <Banknote size={16} /> Dinheiro
          </Button>
          <Button
            type="button"
            variant={paymentMethod === "pix" ? "default" : "outline"}
            className={cn(
              "flex-1 gap-2",
              paymentMethod === "pix" &&
                "bg-pix text-pix-foreground hover:bg-pix/90",
            )}
            onClick={() => setPaymentMethod("pix")}
          >
            <Smartphone size={16} /> Pix
          </Button>
          <Button
            type="button"
            variant={paymentMethod === "combinado" ? "default" : "outline"}
            className={cn(
              "flex-1 gap-2",
              paymentMethod === "combinado" &&
                "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            onClick={() => setPaymentMethod("combinado")}
          >
            <Plus size={16} /> Combinado
          </Button>
        </div>

        {paymentMethod === "combinado" && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="space-y-1">
              <Label className="flex items-center gap-2 text-xs">
                <Banknote size={12} className="text-cash" /> Dinheiro
              </Label>
              <CurrencyInput value={cashAmount} onValueChange={setCashAmount} />
            </div>
            <div className="space-y-1">
              <Label className="flex items-center gap-2 text-xs">
                <Smartphone size={12} className="text-pix" /> PIX
              </Label>
              <CurrencyInput value={pixAmount} onValueChange={setPixAmount} />
            </div>
            {mixedTotal > 0 && Math.abs(mixedTotal - total) > 0.01 && (
              <div className="col-span-full text-center p-2 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Total combinado:{" "}
                </span>
                <span className="font-mono font-bold">
                  {formatCurrency(mixedTotal)}
                </span>
                <span
                  className={cn(
                    "text-xs ml-2",
                    mixedTotal < total ? "text-destructive" : "text-success",
                  )}
                >
                  (diferença de {formatCurrency(Math.abs(total - mixedTotal))})
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
          Total
        </p>
        <p className="text-3xl font-extrabold font-mono text-success mt-1">
          {formatCurrency(total)}
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1 gap-2" size="lg">
          <Save size={18} /> Salvar Alterações
        </Button>
        <Button
          onClick={handleDelete}
          variant="destructive"
          size="lg"
          className="gap-2"
        >
          <Trash2 size={18} /> Excluir
        </Button>
      </div>
    </div>
  );
}
