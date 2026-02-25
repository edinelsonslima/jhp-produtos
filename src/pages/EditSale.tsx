import { Title } from "@/components/_layout/title";
import { Button } from "@/components/_ui/button";
import { Card } from "@/components/_ui/card";
import { ConfirmButton } from "@/components/_ui/confirm-button";
import { Label } from "@/components/_ui/label";
import { toast } from "@/components/_ui/toast";
import { CurrencyInput } from "@/components/currency/Input";
import { CurrencyMonitor } from "@/components/currency/monitor";
import { productStore } from "@/hooks/useProducts";
import { saleStore } from "@/hooks/useSales";
import { cn, formatCurrency, vibrate } from "@/lib/utils";
import { PaymentMethod, Sale } from "@/types";
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

export function Component() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const sale = saleStore.useStore((s) => s.sales.find((s) => s.id === id));

  const [products, setProducts] = useState<Sale["products"]>(
    sale?.products ?? { regular: [], custom: [] },
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

  const total =
    products.custom.reduce((acc, p) => acc + p.price * p.quantity, 0) +
    products.regular.reduce((acc, p) => {
      return acc + (productStore.action.get(p.id)?.price ?? 0) * p.quantity;
    }, 0);

  const updateQuantity = (productId: string, delta: number) => {
    vibrate(10);
    setProducts((prev) => {
      const isCustom = prev.custom.some((p) => p.id === productId);

      if (isCustom) {
        const updated = prev.custom.map((p) =>
          p.id === productId
            ? { ...p, quantity: Math.max(0, p.quantity + delta) }
            : p,
        );
        return { ...prev, custom: updated.filter((p) => p.quantity > 0) };
      }

      const updated = prev.regular.map((p) =>
        p.id === productId
          ? { ...p, quantity: Math.max(0, p.quantity + delta) }
          : p,
      );
      return { ...prev, regular: updated.filter((p) => p.quantity > 0) };
    });
  };

  const handleSave = () => {
    if (products.regular.length === 0 && products.custom.length === 0) {
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

  const getProducts = () => {
    return (products?.regular ?? [])
      .map((p) => {
        const product = productStore.action.get(p.id);
        return product ? { ...product, quantity: p.quantity } : null;
      })
      .concat(products?.custom ?? [])
      .filter((p) => !!p);
  };

  return (
    <>
      <Title
        title="Editar Venda"
        subtitle={new Date(sale.date).toLocaleString("pt-BR")}
        prefix={
          <Button
            modifier="square"
            appearance="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
        }
      />

      <Card>
        <p className="text-xs text-base-content/60 uppercase tracking-wide font-semibold">
          Total
        </p>

        <CurrencyMonitor className="text-3xl font-extrabold font-mono mt-1">
          {total}
        </CurrencyMonitor>
      </Card>

      <Card>
        <Card.Title>
          Produtos ({products.regular.length + products.custom.length})
        </Card.Title>

        {getProducts().map((product) => (
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
              <Button
                type="button"
                size="sm"
                modifier="square"
                onClick={() => updateQuantity(product.id, -1)}
              >
                <Minus size={14} />
              </Button>

              <span className="w-8 text-center font-mono font-bold">
                {product.quantity}
              </span>

              <Button
                type="button"
                size="sm"
                modifier="square"
                onClick={() => updateQuantity(product.id, 1)}
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
        ))}

        {getProducts().length === 0 && (
          <p className="text-sm text-base-content/60 text-center py-4">
            Todos os produtos foram removidos
          </p>
        )}
      </Card>

      <Card>
        <Card.Title>Forma de Pagamento</Card.Title>

        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            className="flex-1"
            appearance="outline"
            active={paymentMethod === "dinheiro"}
            variant={paymentMethod === "dinheiro" ? "warning" : undefined}
            onClick={() => setPaymentMethod("dinheiro")}
          >
            <Banknote size={16} /> Dinheiro
          </Button>

          <Button
            type="button"
            className="flex-1"
            appearance="outline"
            active={paymentMethod === "pix"}
            variant={paymentMethod === "pix" ? "success" : undefined}
            onClick={() => setPaymentMethod("pix")}
          >
            <Smartphone size={16} /> Pix
          </Button>

          <Button
            type="button"
            className="flex-1"
            appearance="outline"
            active={paymentMethod === "combinado"}
            variant={paymentMethod === "combinado" ? "primary" : undefined}
            onClick={() => setPaymentMethod("combinado")}
          >
            <Plus size={16} /> Combinado
          </Button>
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
      </Card>

      <div className="flex gap-3">
        <Button
          size="lg"
          variant="primary"
          className="flex-1"
          onClick={handleSave}
        >
          <Save size={20} /> Salvar Alterações
        </Button>

        <ConfirmButton
          size="lg"
          variant="error"
          appearance="soft"
          onConfirm={handleDelete}
        >
          <Trash2 size={20} />
        </ConfirmButton>
      </div>
    </>
  );
}
