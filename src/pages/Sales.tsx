import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Smartphone, Banknote, Trash2, Plus, ChevronDown, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Sales() {
  const { products, sales, addSale, deleteSale } = useStore();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'dinheiro'>('dinheiro');
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const product = products.find(p => p.id === selectedProduct);
  const qty = parseFloat(quantity) || 0;
  const total = customPrice ? parseFloat(customPrice) || 0 : (product ? product.price * qty : 0);

  const visibleProducts = products.slice(0, 3);
  const hiddenProducts = products.slice(3);
  const hasMoreProducts = hiddenProducts.length > 0;

  const handleProductClick = (productId: string) => {
    setSelectedProduct(productId);
    setQuantity('1');
    setCustomPrice('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || qty <= 0) {
      toast.error('Selecione um produto e quantidade válida');
      return;
    }
    addSale({
      productName: product.name,
      quantity: qty,
      unit: product.unit,
      totalPrice: total,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
    });
    toast.success('Venda registrada!');
    setSelectedProduct('');
    setQuantity('');
    setCustomPrice('');
  };

  const ProductCard = ({ p }: { p: typeof products[0] }) => (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleProductClick(p.id)}
      className={`flex flex-col items-start p-4 rounded-xl border transition-all text-left ${
        selectedProduct === p.id
          ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
          : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Package size={16} className="text-primary" />
        <span className="font-semibold text-sm truncate">{p.name}</span>
      </div>
      <div className="flex items-center justify-between w-full">
        <span className="text-xs text-muted-foreground">
          {p.unit === 'litro' ? 'por litro' : 'unidade'}
        </span>
        <span className="font-mono font-bold text-sm text-primary">
          {formatCurrency(p.price)}
        </span>
      </div>
    </motion.button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-extrabold tracking-tight">Registrar Venda</h2>
        <p className="text-muted-foreground text-sm mt-1">Adicione vendas ao caixa de hoje</p>
      </motion.div>

      {/* Product Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border bg-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Selecione um Produto
          </h3>
          {selectedProduct && (
            <span className="text-xs text-primary font-medium">
              Produto selecionado ✓
            </span>
          )}
        </div>

        {/* Visible Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {visibleProducts.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        {/* Collapsible Hidden Products */}
        {hasMoreProducts && (
          <Collapsible open={isProductsOpen} onOpenChange={setIsProductsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 gap-2 text-muted-foreground hover:text-foreground"
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`}
                />
                {isProductsOpen ? 'Mostrar menos' : `Ver mais ${hiddenProducts.length} produtos`}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <AnimatePresence>
                {isProductsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ScrollArea className="mt-3 max-h-[60vh]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pr-4">
                        {hiddenProducts.map(p => (
                          <ProductCard key={p.id} p={p} />
                        ))}
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        )}
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="rounded-xl border bg-card p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Produto</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.unit === 'litro' ? 'por litro' : 'unidade'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Quantidade {product ? `(${product.unit === 'litro' ? 'litros' : 'unidades'})` : ''}</Label>
            <Input
              type="number"
              step="0.5"
              min="0.5"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="Ex: 2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Valor Total (ou deixe em branco para calcular)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={customPrice}
              onChange={e => setCustomPrice(e.target.value)}
              placeholder={product ? formatCurrency(product.price * qty) : 'R$ 0,00'}
            />
          </div>
          <div className="space-y-2">
            <Label>Pagamento</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={paymentMethod === 'dinheiro' ? 'default' : 'outline'}
                className={`flex-1 gap-2 ${paymentMethod === 'dinheiro' ? 'bg-cash text-cash-foreground hover:bg-cash/90' : ''}`}
                onClick={() => setPaymentMethod('dinheiro')}
              >
                <Banknote size={16} /> Dinheiro
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                className={`flex-1 gap-2 ${paymentMethod === 'pix' ? 'bg-pix text-pix-foreground hover:bg-pix/90' : ''}`}
                onClick={() => setPaymentMethod('pix')}
              >
                <Smartphone size={16} /> Pix
              </Button>
            </div>
          </div>
        </div>

        {total > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total da venda</p>
            <p className="text-2xl font-extrabold font-mono">{formatCurrency(total)}</p>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full gap-2">
          <Plus size={18} /> Registrar Venda
        </Button>
      </motion.form>

      {/* Sales list */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Últimas Vendas
        </h3>
        <div className="rounded-xl border bg-card overflow-hidden">
          {sales.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Nenhuma venda registrada</div>
          ) : (
            <div className="divide-y divide-border">
              {sales.slice(0, 20).map(sale => (
                <div key={sale.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-semibold">{sale.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.quantity} {sale.unit === 'litro' ? 'L' : 'un.'} · {new Date(sale.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold font-mono">{formatCurrency(sale.totalPrice)}</p>
                      <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        sale.paymentMethod === 'pix' ? 'bg-pix/15 text-pix' : 'bg-cash/15 text-cash'
                      }`}>
                        {sale.paymentMethod}
                      </span>
                    </div>
                    <button
                      onClick={() => { deleteSale(sale.id); toast.info('Venda removida'); }}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
