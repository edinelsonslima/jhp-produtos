import { CurrencyInput } from "@/components/CurrencyInput";
import { ProductCard } from "@/components/ProductCard";
import { SaleItem } from "@/components/SaleItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useStore } from "@/hooks/useSales";
import { cn, formatCurrency } from "@/lib/utils";
import { PaymentMethod, SaleProduct } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Plus, Smartphone } from "lucide-react";
import { FormEvent, useState } from "react";

export default function Sales() {
  const { products, sales, addSale, deleteSale } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("dinheiro");
  const [selectedProducts, setSelectedProducts] = useState<SaleProduct[]>([]);

  const [cashAmount, setCashAmount] = useState(0);
  const [pixAmount, setPixAmount] = useState(0);

  const [customPrice, setCustomPrice] = useState(0);
  const [customQuantity, setCustomQuantity] = useState("");
  const [customProduct, setCustomProduct] = useState("");

  const total = selectedProducts.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0,
  );

  const mixedTotal = cashAmount + pixAmount;

  const addProduct = (product: SaleProduct) => {
    setSelectedProducts((prev) => {
      const list = [...prev];
      const idx = list.findIndex((p) => p.id === product.id);

      if (idx === -1) {
        const found = products.find((p) => p.id === product.id);
        if (!found) {
          toast.error("Produto não encontrado");
          return prev;
        }
        return [...list, { ...found, selected: true, quantity: 1 }];
      }

      if (product.quantity === 0) {
        list.splice(idx, 1);
        return list;
      }

      list[idx] = product;
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

    const customProductItem: SaleProduct = {
      id: `custom-${Date.now()}`,
      name: customProduct.trim() || "Item Personalizado",
      price: customPrice,
      unit: "unidade",
      quantity: qty,
    };

    setSelectedProducts((prev) => [...prev, customProductItem]);
    setCustomPrice(0);
    setCustomQuantity("");
    setCustomProduct("");
    toast.success("Item personalizado adicionado");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProducts.length) {
      toast.error("Adicione pelo menos um produto à venda");
      return;
    }

    if (paymentMethod === "combinado" && mixedTotal <= 0) {
      toast.error("Informe os valores em dinheiro e/ou PIX");
      return;
    }

    if (paymentMethod === "combinado" && Math.abs(mixedTotal - total) > 0.01) {
      toast.error(
        "Valores em dinheiro e PIX devem ser igual ao total da venda",
      );
      return;
    }

    addSale({
      id: crypto.randomUUID(),
      products: selectedProducts,
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

    setSelectedProducts([]);
    setCustomQuantity("");
    setCustomPrice(0);
    setCashAmount(0);
    setPixAmount(0);
    setPaymentMethod("dinheiro");
    toast.success("Venda registrada!");
  };

  const handleDeleteSale = (id: string) => {
    deleteSale(id);
    toast.success("Venda excluída");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8 mb-8">
        <p
          className={cn(
            "text-2xl font-extrabold font-mono fixed top-16 md:top-4 right-2 bg-card shadow-sm p-2 pr-4 rounded-lg z-50",
            total > 0 ? "text-success" : "text-destructive",
          )}
        >
          {formatCurrency(total)}
        </p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Registrar Venda
          </h2>
          <p className="text-muted-foreground text-md mt-1">
            Adicione vendas ao caixa de hoje
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border bg-card p-3"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Selecione um Produto
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto overflow-x-hidden p-1">
            {products.map((p) => {
              const config = selectedProducts.find((sp) => sp.id === p.id);
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={(product) => addProduct(product)}
                  quantity={config?.quantity ?? 0}
                />
              );
            })}
          </div>
        </motion.div>

        <motion.form
          className="rounded-xl border bg-card p-3"
          onSubmit={handleSubmitCustomItem}
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Item Personalizado
          </h3>

          <Label className="mb-1">Preço</Label>
          <CurrencyInput
            value={customPrice}
            onValueChange={setCustomPrice}
            className="w-full mb-3"
          />

          <div className="flex gap-2">
            <div className="flex-2 min-w-[60%]">
              <Label>Produto</Label>
              <Input
                type="text"
                value={customProduct}
                onChange={(e) => setCustomProduct(e.target.value)}
                placeholder="Descrição do item personalizado"
                maxLength={100}
                className="font-mono w-full"
              />
            </div>

            <div className="flex-1 min-w-[40%]">
              <Label className="mt-4 mb-1">Quantidade</Label>
              <Input
                type="number"
                step="1"
                min="1"
                value={customQuantity}
                onChange={(e) => setCustomQuantity(e.target.value)}
                placeholder="1"
                className="font-mono w-full"
              />
            </div>
          </div>

          <Button type="submit" variant="outline" className="mt-6 w-full">
            <Plus size={16} /> Adicionar Item Personalizado
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Últimas Vendas
          </h3>
          <div className="rounded-xl border bg-card overflow-hidden">
            {sales.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Nenhuma venda registrada
              </div>
            ) : (
              <div>
                {sales.slice(0, 20).map((sale) => (
                  <SaleItem
                    key={sale.id}
                    sale={sale}
                    onDelete={handleDeleteSale}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-3 sticky bottom-12 md:bottom-0 pt-2 pb-4 bg-background border-t border-border md:max-w-4xl md:mx-auto"
      >
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
                  <Banknote size={14} className="text-cash" />
                  Valor em Dinheiro
                </Label>
                <CurrencyInput
                  value={cashAmount}
                  onValueChange={setCashAmount}
                  className="border-cash/30 focus-visible:ring-cash"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Smartphone size={14} className="text-pix" />
                  Valor em PIX
                </Label>
                <CurrencyInput
                  value={pixAmount}
                  onValueChange={setPixAmount}
                  className="border-pix/30 focus-visible:ring-pix"
                />
              </div>

              {mixedTotal > 0 && (
                <div className="col-span-full text-center p-2 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">
                    Total combinado:{" "}
                  </span>
                  <span className="font-mono font-bold">
                    {formatCurrency(mixedTotal)}
                  </span>
                  {total > 0 && Math.abs(mixedTotal - total) > 0.01 && (
                    <span
                      className={cn(
                        "text-xs ml-2",
                        mixedTotal < total
                          ? "text-destructive"
                          : "text-success",
                      )}
                    >
                      (diferença de{" "}
                      {formatCurrency(Math.abs(total - mixedTotal))})
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" size="lg" className="w-full gap-2">
          <Plus size={18} /> Registrar Venda
        </Button>
      </motion.form>
    </>
  );
}
