import { ProductCard } from "@/components/ProductCard";
import { SaleItem } from "@/components/SaleItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks/useStore";
import { cn, formatCurrency } from "@/lib/utils";
import { PaymentMethod, SaleProduct } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Plus, Smartphone } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function Sales() {
  const { products, sales, addSale } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("dinheiro");
  const [selectedProducts, setSelectedProducts] = useState<SaleProduct[]>([]);

  const [cashAmount, setCashAmount] = useState("");
  const [pixAmount, setPixAmount] = useState("");

  const [customPrice, setCustomPrice] = useState("");
  const [customQuantity, setCustomQuantity] = useState("");
  const [customProduct, setCustomProduct] = useState("");

  const total = selectedProducts.reduce((acc, p) => {
    const price = parseFloat(customPrice) || p.price;
    return acc + price * p.quantity;
  }, 0);

  const cashValue = parseFloat(cashAmount) || 0;
  const pixValue = parseFloat(pixAmount) || 0;
  const mixedTotal = cashValue + pixValue;

  const addProduct = (product: SaleProduct) => {
    setSelectedProducts((prev) => {
      const selectedProducts = [...prev];

      const currentProductIndex = selectedProducts.findIndex(
        (p) => p.id === product.id,
      );

      if (currentProductIndex === -1) {
        const productToAdd = products.find((p) => p.id === product.id);

        if (!productToAdd) {
          toast.error("Produto não encontrado");
          return prev;
        }

        return [
          ...selectedProducts,
          { ...productToAdd, selected: true, quantity: 1 },
        ];
      }

      if (product.quantity === 0) {
        selectedProducts.splice(currentProductIndex, 1);
        return selectedProducts;
      }

      selectedProducts[currentProductIndex] = product;

      return [...selectedProducts];
    });
  };

  const handleSubmitCustomItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!customPrice || parseFloat(customPrice) <= 0) {
      toast.error("Informe um preço válido para o item personalizado");
      return;
    }

    const customProductItem: SaleProduct = {
      id: `custom-${Date.now()}`,
      name: customProduct || "Item Personalizado",
      price: parseFloat(customPrice),
      unit: "unidade",
      quantity: parseInt(customQuantity) || 1,
    };

    setSelectedProducts((prev) => [...prev, customProductItem]);
    setCustomPrice("");
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

    if (paymentMethod === "misto" && mixedTotal <= 0) {
      toast.error("Informe os valores em dinheiro e/ou PIX");
      return;
    }

    if (paymentMethod === "misto" && mixedTotal !== total) {
      toast.error("Valores em dinheiro e PIX deve ser igual ao total da venda");
      return;
    }

    addSale({
      id: window.crypto?.randomUUID(),
      products: selectedProducts,
      date: new Date().toISOString(),
      paymentMethod,
      price: {
        total: total,
        cash: cashValue || (paymentMethod === "dinheiro" ? total : 0),
        pix: pixValue || (paymentMethod === "pix" ? total : 0),
      },
    });

    setSelectedProducts([]);
    setCustomQuantity("");
    setCustomPrice("");
    setCashAmount("");
    setPixAmount("");
    setPaymentMethod("dinheiro");
    toast.success("Venda registrada!");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8 mb-8">
        <p
          className={cn(
            "text-2xl font-extrabold font-mono fixed top-7 -right-2 bg-card shadow-sm p-2 pr-10 rounded-lg z-50",
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
          <Input
            type="number"
            step="0.01"
            min="0"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            placeholder="R$ 0,00"
            className="font-mono w-full mb-3"
          />

          <div className="flex gap-2">
            <div className="flex-2 min-w-[60%]">
              <Label>Produto</Label>
              <Input
                type="text"
                value={customProduct}
                onChange={(e) => setCustomProduct(e.target.value)}
                placeholder="Descrição do item personalizado"
                className="font-mono w-full"
              />
            </div>

            <div className="flex-1 min-w-[40%]">
              <Label className="mt-4 mb-1">Quantidade</Label>
              <Input
                type="number"
                step="1"
                min="0"
                value={customQuantity}
                onChange={(e) => setCustomQuantity(e.target.value)}
                placeholder="0"
                className="font-mono w-full"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="outline"
            className="mt-6 w-full"
            onClick={() => {}}
          >
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
                  <SaleItem key={sale.id} sale={sale} />
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
            className={`flex-1 gap-2 ${paymentMethod === "dinheiro" ? "bg-cash text-cash-foreground hover:bg-cash/90" : ""}`}
            onClick={() => setPaymentMethod("dinheiro")}
          >
            <Banknote size={16} /> Dinheiro
          </Button>
          <Button
            type="button"
            variant={paymentMethod === "pix" ? "default" : "outline"}
            className={`flex-1 gap-2 ${paymentMethod === "pix" ? "bg-pix text-pix-foreground hover:bg-pix/90" : ""}`}
            onClick={() => setPaymentMethod("pix")}
          >
            <Smartphone size={16} /> Pix
          </Button>
          <Button
            type="button"
            variant={paymentMethod === "misto" ? "default" : "outline"}
            className={`flex-1 gap-2 ${paymentMethod === "misto" ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
            onClick={() => setPaymentMethod("misto")}
          >
            <Plus size={16} /> Misto
          </Button>
        </div>

        {/* Mixed payment inputs */}
        <AnimatePresence>
          {paymentMethod === "misto" && (
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
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="R$ 0,00"
                  className="border-cash/30 focus-visible:ring-cash"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Smartphone size={14} className="text-pix" />
                  Valor em PIX
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={pixAmount}
                  onChange={(e) => setPixAmount(e.target.value)}
                  placeholder="R$ 0,00"
                  className="border-pix/30 focus-visible:ring-pix"
                />
              </div>

              {mixedTotal > 0 && (
                <div className="col-span-full text-center p-2 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">
                    Total misto:{" "}
                  </span>
                  <span className="font-mono font-bold">
                    {formatCurrency(mixedTotal)}
                  </span>
                  {total > 0 && mixedTotal !== total && (
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
