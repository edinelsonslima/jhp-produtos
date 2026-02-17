import { ChangeCalculatorModal } from "@/components/ChangeCalculatorModal";
import { CurrencyInput } from "@/components/CurrencyInput";
import { ProductCard } from "@/components/ProductCard";
import { SaleItem } from "@/components/SaleItem";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { productStore } from "@/hooks/useProducts";
import { saleStore } from "@/hooks/useSales";
import { cn, formatCurrency, generateUUID, vibrate } from "@/lib/utils";
import { PaymentMethod, Product, SaleProducts } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Plus, Smartphone, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";

export default function Sales() {
  const sales = saleStore.useStore((state) => state.sales);
  const products = productStore.useStore((state) => state.products);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("dinheiro");
  const [selected, setSelected] = useState<SaleProducts>({
    custom: [],
    regular: [],
  });

  const [cashAmount, setCashAmount] = useState(0);
  const [pixAmount, setPixAmount] = useState(0);

  const handleAddProduct = (product: Product, quantity: number) => {
    setSelected((prev) => {
      const list = [...prev.regular];

      const idx = list.findIndex((p) => p.id === product.id);

      if (idx === -1) {
        const found = products.find((p) => p.id === product.id);

        if (!found) {
          toast.error("Produto não encontrado");
          return prev;
        }

        return { ...prev, regular: [...list, { id: found.id, quantity: 1 }] };
      }

      if (quantity === 0) {
        list.splice(idx, 1);
        return { ...prev, regular: list };
      }

      list[idx] = { ...list[idx], quantity };
      return { ...prev, regular: [...list] };
    });
  };

  const handleDeleteSale = (id: string) => {
    saleStore.action.delete(id);
    toast.success("Venda excluída");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selected.regular.length && !selected.custom.length) {
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

    let cash = 0;
    let pix = 0;

    if (paymentMethod === "dinheiro") {
      cash = total;
    }

    if (paymentMethod === "pix") {
      pix = total;
    }

    if (paymentMethod === "combinado") {
      cash = cashAmount;
      pix = pixAmount;
    }

    saleStore.action.add({
      paymentMethod,
      products: selected,
      price: { total, cash, pix },
      date: new Date().toISOString(),
    });

    setCashAmount(0);
    setPixAmount(0);
    setPaymentMethod("dinheiro");
    setSelected({ custom: [], regular: [] });
    toast.success("Venda registrada!");
  };

  const handleAddCustomItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const brutPrice = formData.get("price")?.toString().replace(/\D/g, "");
    const price = parseInt(brutPrice || "0", 10) / 100;

    const name = formData.get("name")?.toString().trim() || "";
    const quantity = formData.get("quantity")?.toString().trim() || "1";

    if (price <= 0) {
      toast.warn("Informe um preço válido para o item personalizado");
      return;
    }

    const qty = parseInt(quantity) || 1;

    if (qty <= 0) {
      toast.warn("Quantidade deve ser maior que zero");
      return;
    }

    const customProductItem: SaleProducts["custom"][number] = {
      name: name || `Item Personalizado (${formatCurrency(price)})`,
      id: generateUUID(),
      unit: "unidade",
      quantity: qty,
      price: price,
    };

    setSelected((prev) => ({
      ...prev,
      custom: [...prev.custom, customProductItem],
    }));

    toast.success(`Item ${customProductItem.name} adicionado`);
  };

  const handleDeleteCustomItem = (id: string) => {
    setSelected((prev) => ({
      ...prev,
      custom: prev.custom.filter((c) => c.id !== id),
    }));
  };

  const totalPaymentCombined = cashAmount + pixAmount;

  const total =
    selected.custom.reduce((acc, p) => acc + p.price * p.quantity, 0) +
    selected.regular.reduce((acc, p) => {
      return acc + (productStore.action.get(p.id)?.price ?? 0) * p.quantity;
    }, 0);

  return (
    <>
      <p
        className={cn(
          "text-3xl font-extrabold font-mono fixed top-20 right-2 bg-base-100 shadow-sm p-2 pr-4 rounded-lg z-10",
          total > 0 ? "text-success" : "text-error",
        )}
      >
        {formatCurrency(total)}
      </p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-base-300 bg-base-100 p-3"
      >
        {products.length ? (
          <>
            <h3 className="text-sm font-semibold text-base-content/80 uppercase tracking-wider mb-3">
              Selecione um Produto
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto overflow-x-hidden p-1">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={handleAddProduct}
                  quantity={
                    selected.regular.find((s) => s.id === p.id)?.quantity
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-base-content/60 text-sm">
            Nenhum produto cadastrado
          </div>
        )}
      </motion.div>

      <motion.form
        className="rounded-xl border border-base-300 bg-base-100 p-3"
        onSubmit={handleAddCustomItem}
      >
        <h3 className="text-sm font-semibold text-base-content/80 uppercase tracking-wider mb-3">
          Item Personalizado
        </h3>

        <CurrencyInput name="price" label="Preço" />

        <div className="flex gap-4 items-end">
          <div className="flex-2">
            <Label className="daisy-label">Produto</Label>
            <input
              name="name"
              type="text"
              placeholder="Descrição do item personalizado"
              maxLength={100}
              className="daisy-input w-full font-mono"
            />
          </div>

          <div className="flex-1">
            <Label className="daisy-label mt-4 mb-1">Quantidade</Label>
            <input
              name="quantity"
              type="number"
              step="1"
              min="1"
              placeholder="1"
              className="daisy-input w-full font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="daisy-btn daisy-btn-soft mt-6 w-full gap-2"
          onClick={() => vibrate(10)}
        >
          <Plus size={16} /> Adicionar Item Personalizado
        </button>
      </motion.form>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="rounded-xl border border-base-300 bg-base-100 p-3"
        >
          <h3 className="text-sm font-semibold text-base-content/80 uppercase tracking-wider mb-3">
            Itens
          </h3>

          {selected.regular.length === 0 && selected.custom.length === 0 && (
            <div className="p-4 text-center text-base-content/60 text-sm">
              Nenhum item adicionado
            </div>
          )}

          <div className="space-y-2 max-h-80 overflow-y-auto overflow-x-hidden py-2">
            {selected.regular
              .map((prd) => ({
                ...productStore.action.get(prd.id)!,
                quantity: prd.quantity,
                type: "regular",
              }))
              .concat(selected.custom.map((c) => ({ ...c, type: "custom" })))
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-end justify-between gap-2"
                >
                  <div className="w-full">
                    <div className="flex justify-between items-end">
                      <p className="font-semibold">{product?.name}</p>
                    </div>

                    <div className="flex items-center">
                      <p className="text-sm text-base-content/60">
                        {formatCurrency(product?.price ?? 0)} x{" "}
                        {product?.quantity}
                      </p>
                      <span className="flex-1 mx-2 border-b border-dotted border-base-content/20 translate-y-1" />
                      <span className="font-mono font-bold">
                        {formatCurrency(
                          (product?.price ?? 0) * (product?.quantity ?? 0),
                        )}
                      </span>
                    </div>
                  </div>

                  <Trash2
                    size={22}
                    className="text-error cursor-pointer daisy-btn daisy-btn-xs p-1"
                    onClick={() => (
                      vibrate(10),
                      product.type === "regular"
                        ? handleAddProduct(product, 0)
                        : handleDeleteCustomItem(product.id)
                    )}
                  />
                </div>
              ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-36"
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
        className="daisy-glass fixed bottom-16 space-y-3 p-4 border-t border-base-300 right-0 left-0"
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
    </>
  );
}
