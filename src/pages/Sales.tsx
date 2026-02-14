import { ChangeCalculatorModal } from "@/components/ChangeCalculatorModal";
import { CurrencyInput } from "@/components/CurrencyInput";
import { ProductCard } from "@/components/ProductCard";
import { SaleItem } from "@/components/SaleItem";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { productStore } from "@/hooks/useProducts";
import { saleStore } from "@/hooks/useSales";
import { cn, formatCurrency } from "@/lib/utils";
import { PaymentMethod, Product, Sale } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Plus, Smartphone } from "lucide-react";
import { FormEvent, useState } from "react";

export default function Sales() {
  const sales = saleStore.useStore((state) => state.sales);
  const products = productStore.useStore((state) => state.products);

  const [selected, setSelected] = useState<Sale["products"]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("dinheiro");

  const [cashAmount, setCashAmount] = useState(0);
  const [pixAmount, setPixAmount] = useState(0);

  const [customPrice, setCustomPrice] = useState(0);
  const [customQuantity, setCustomQuantity] = useState("");
  const [customProduct, setCustomProduct] = useState("");

  const totalPaymentCombined = cashAmount + pixAmount;

  const total = selected.reduce((acc, p) => {
    const price = productStore.action.get(p.productId)?.price ?? 0;
    return acc + price * p.quantity;
  }, 0);

  const addProduct = (product: Product, quantity: number) => {
    setSelected((prev) => {
      const list = [...prev];
      const idx = list.findIndex((p) => p.productId === product.id);

      if (idx === -1) {
        const found = products.find((p) => p.id === product.id);
        if (!found) {
          toast.error("Produto não encontrado");
          return prev;
        }
        return [...list, { productId: found.id, quantity: 1 }];
      }

      if (quantity === 0) {
        list.splice(idx, 1);
        return list;
      }

      list[idx] = { productId: product.id, quantity };
      return [...list];
    });
  };

  const handleSubmitCustomItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (customPrice <= 0) {
      toast.error("Informe um preço válido para o item personalizado");
      return;
    }
    const qty = parseInt(customQuantity) || 1;
    if (qty <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }
    const customProductItem: Sale["products"][number] = {
      productId: `custom-${Date.now()}`,
      quantity: qty,
    };
    setSelected((prev) => [...prev, customProductItem]);
    setCustomPrice(0);
    setCustomQuantity("");
    setCustomProduct("");
    toast.success("Item personalizado adicionado");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected.length) {
      toast.error("Adicione pelo menos um produto à venda");
      return;
    }
    const isCombined = paymentMethod === "combinado";
    if (isCombined && totalPaymentCombined <= 0) {
      toast.error("Informe os valores em dinheiro e/ou PIX");
      return;
    }
    if (isCombined && Math.abs(totalPaymentCombined - total) > 0.01) {
      toast.error(
        "Valores em Dinheiro e PIX devem ser igual ao total da venda",
      );
      return;
    }

    saleStore.action.add({
      products: selected,
      date: new Date().toISOString(),
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

    setSelected([]);
    setCustomQuantity("");
    setCustomPrice(0);
    setCashAmount(0);
    setPixAmount(0);
    setPaymentMethod("dinheiro");
    toast.success("Venda registrada!");
  };

  const handleDeleteSale = (id: string) => {
    saleStore.action.delete(id);
    toast.success("Venda excluída");
  };

  return (
    <div className="min-h-full relative max-w-4xl mx-auto space-y-8 pb-28 ">
      <p
        className={cn(
          "text-3xl font-extrabold font-mono fixed top-20 right-2 bg-base-100 shadow-sm p-2 pr-4 rounded-lg z-10",
          total > 0 ? "text-success" : "text-error",
        )}
      >
        {formatCurrency(total)}
      </p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-extrabold tracking-tight">
          Registrar Venda
        </h2>
        <p className="text-base-content/60 text-md mt-1">
          Adicione vendas ao caixa de hoje
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-base-300 bg-base-100 p-3"
      >
        <h3 className="text-sm font-semibold text-base-content/80 uppercase tracking-wider mb-3">
          Selecione um Produto
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto overflow-x-hidden p-1">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={addProduct}
              quantity={selected.find((sp) => sp.productId === p.id)?.quantity}
            />
          ))}
        </div>
      </motion.div>

      <motion.form
        className="rounded-xl border border-base-300 bg-base-100 p-3"
        onSubmit={handleSubmitCustomItem}
      >
        <h3 className="text-sm font-semibold text-base-content/80 uppercase tracking-wider mb-3">
          Item Personalizado
        </h3>

        <CurrencyInput
          label="Preço"
          value={customPrice}
          onValueChange={setCustomPrice}
        />

        <div className="flex gap-4 items-end">
          <div className="flex-2">
            <Label className="daisy-label">Produto</Label>
            <input
              type="text"
              value={customProduct}
              onChange={(e) => setCustomProduct(e.target.value)}
              placeholder="Descrição do item personalizado"
              maxLength={100}
              className="daisy-input w-full font-mono"
            />
          </div>

          <div className="flex-1">
            <Label className="daisy-label mt-4 mb-1">Quantidade</Label>
            <input
              type="number"
              step="1"
              min="1"
              value={customQuantity}
              onChange={(e) => setCustomQuantity(e.target.value)}
              placeholder="1"
              className="daisy-input w-full font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="daisy-btn daisy-btn-soft mt-6 w-full gap-2"
        >
          <Plus size={16} /> Adicionar Item Personalizado
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-sm font-semibold text-base-content/80 uppercase tracking-wider mb-3">
          Últimas Vendas
        </h3>
        <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden">
          {sales.length === 0 ? (
            <div className="p-8 text-center text-base-content/60 text-sm">
              Nenhuma venda registrada
            </div>
          ) : (
            <div>
              {sales.slice(0, 20).map((sale) => (
                <SaleItem
                  key={sale.id}
                  saleId={sale.id}
                  onDelete={handleDeleteSale}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="daisy-glass fixed bottom-16 border-t border-base-300 right-0 left-0 space-y-3 p-4"
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("dinheiro")}
            className={cn(
              "daisy-btn flex-1 gap-2",
              paymentMethod === "dinheiro"
                ? "daisy-btn-warning"
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
                ? "daisy-btn-success"
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

        <AnimatePresence>
          {paymentMethod === "combinado" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden p-1"
            >
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Banknote size={14} className="text-warning" />
                  Valor em Dinheiro
                </Label>
                <CurrencyInput
                  value={cashAmount}
                  onValueChange={setCashAmount}
                  className="border-warning/30 focus:border-warning"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Smartphone size={14} className="text-success" />
                  Valor em PIX
                </Label>
                <CurrencyInput
                  value={pixAmount}
                  onValueChange={setPixAmount}
                  className="border-success/30 focus:border-success"
                />
              </div>
              {totalPaymentCombined > 0 && (
                <div className="col-span-full text-center p-2 rounded-lg bg-base-200/50">
                  <span className="text-sm text-base-content/60">
                    Total combinado:{" "}
                  </span>
                  <span className="font-mono font-bold">
                    {formatCurrency(totalPaymentCombined)}
                  </span>
                  {total > 0 &&
                    Math.abs(totalPaymentCombined - total) > 0.01 && (
                      <span
                        className={cn(
                          "text-xs ml-2",
                          totalPaymentCombined < total
                            ? "text-error"
                            : "text-success",
                        )}
                      >
                        (diferença de{" "}
                        {formatCurrency(Math.abs(total - totalPaymentCombined))}
                        )
                      </span>
                    )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={total <= 0}
            className="daisy-btn daisy-btn-primary daisy-btn-lg flex-1 min-w-0 gap-2"
          >
            <Plus size={18} /> Registrar Venda
          </button>

          <ChangeCalculatorModal saleTotal={total} />
        </div>
      </motion.form>
    </div>
  );
}
