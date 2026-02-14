import { CurrencyInput } from "@/components/CurrencyInput";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { productStore } from "@/hooks/useProducts";
import { saleStore } from "@/hooks/useSales";
import { cn, formatCurrency } from "@/lib/utils";
import { PaymentMethod, Sale } from "@/types";
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

export default function EditSale() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const sale = saleStore.action.get(id!);

  const [products, setProducts] = useState<Sale["products"]>(
    sale?.products ?? [],
  );
  const [cashAmount, setCashAmount] = useState(sale?.price.cash ?? 0);
  const [pixAmount, setPixAmount] = useState(sale?.price.pix ?? 0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    sale?.paymentMethod ?? "dinheiro",
  );

  if (!sale) {
    return (
      <div className="text-center py-20">
        <p className="text-base-content/60">Venda não encontrada</p>
        <Link to="/" className="text-primary underline mt-4 inline-block">
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  const mixedTotal = cashAmount + pixAmount;
  const total = products.reduce((sum, p) => {
    const price = productStore.action.get(p.productId)?.price ?? 0;
    return sum + price * p.quantity;
  }, 0);

  const updateQuantity = (productId: string, delta: number) => {
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.productId === productId
          ? { ...p, quantity: Math.max(0, p.quantity + delta) }
          : p,
      );

      return updated.filter((p) => p.quantity > 0);
    });
  };

  const handleSave = () => {
    if (products.length === 0) {
      toast.error("A venda precisa ter pelo menos um produto");
      return;
    }

    if (paymentMethod === "combinado" && Math.abs(mixedTotal - total) > 0.01) {
      toast.error("Valores em dinheiro e PIX devem ser igual ao total");
      return;
    }

    saleStore.action.update(sale.id, {
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
    saleStore.action.delete(sale.id);
    toast.success("Venda excluída");
    navigate(-1);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-base-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Editar Venda
          </h2>

          <p className="text-base-content/60 text-sm mt-1">
            {new Date(sale.date).toLocaleString("pt-BR")}
          </p>
        </div>
      </motion.div>

      <div className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider">
          Produtos ({products.length})
        </h3>

        {products.map((p) => {
          const product = productStore.action.get(p.productId);

          if (!product) {
            return null;
          }

          return (
            <div
              key={product.id}
              className="flex items-center justify-between py-2 border-b border-base-300 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{product.name}</p>
                <p className="text-xs text-base-content/60 font-mono">
                  {formatCurrency(product.price ?? 0)} /{" "}
                  {product.unit === "litro" ? "L" : "un."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, -1)}
                  className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center hover:bg-error/20 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-mono font-bold">
                  {p.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, 1)}
                  className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {products.length === 0 && (
          <p className="text-sm text-base-content/60 text-center py-4">
            Todos os produtos foram removidos
          </p>
        )}
      </div>

      <div className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider">
          Forma de Pagamento
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("dinheiro")}
            className={cn(
              "daisy-btn flex-1 gap-2",
              paymentMethod === "dinheiro"
                ? "bg-warning text-base-content hover:bg-warning/90 border-0"
                : "daisy-btn-outline",
            )}
          >
            <Banknote size={16} /> Dinheiro
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("pix")}
            className={cn(
              "daisy-btn flex-1 gap-2",
              paymentMethod === "pix"
                ? "bg-success text-base-content hover:bg-success/90 border-0"
                : "daisy-btn-outline",
            )}
          >
            <Smartphone size={16} /> Pix
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("combinado")}
            className={cn(
              "daisy-btn flex-1 gap-2",
              paymentMethod === "combinado"
                ? "daisy-btn-primary"
                : "daisy-btn-outline",
            )}
          >
            <Plus size={16} /> Combinado
          </button>
        </div>

        {paymentMethod === "combinado" && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="space-y-1">
              <Label className="flex items-center gap-2 text-xs">
                <Banknote size={12} className="text-warning" /> Dinheiro
              </Label>
              <CurrencyInput value={cashAmount} onValueChange={setCashAmount} />
            </div>
            <div className="space-y-1">
              <Label className="flex items-center gap-2 text-xs">
                <Smartphone size={12} className="text-success" /> PIX
              </Label>
              <CurrencyInput value={pixAmount} onValueChange={setPixAmount} />
            </div>
            {mixedTotal > 0 && Math.abs(mixedTotal - total) > 0.01 && (
              <div className="col-span-full text-center p-2 rounded-lg bg-base-200/50">
                <span className="text-sm text-base-content/60">
                  Total combinado:{" "}
                </span>
                <span className="font-mono font-bold">
                  {formatCurrency(mixedTotal)}
                </span>
                <span
                  className={cn(
                    "text-xs ml-2",
                    mixedTotal < total ? "text-error" : "text-success",
                  )}
                >
                  (diferença de {formatCurrency(Math.abs(total - mixedTotal))})
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-base-300 bg-base-100 p-5">
        <p className="text-xs text-base-content/60 uppercase tracking-wide font-semibold">
          Total
        </p>
        <p className="text-3xl font-extrabold font-mono text-success mt-1">
          {formatCurrency(total)}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="daisy-btn daisy-btn-primary daisy-btn-lg flex-1 gap-2"
        >
          <Save size={18} /> Salvar Alterações
        </button>

        <button
          onClick={handleDelete}
          className="daisy-btn daisy-btn-error daisy-btn-lg gap-2"
        >
          <Trash2 size={18} /> Excluir
        </button>
      </div>
    </>
  );
}
