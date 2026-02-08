import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Banknote, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
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

  const product = products.find(p => p.id === selectedProduct);
  const qty = parseFloat(quantity) || 0;
  const total = customPrice ? parseFloat(customPrice) || 0 : (product ? product.price * qty : 0);

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-extrabold tracking-tight">Registrar Venda</h2>
        <p className="text-muted-foreground text-sm mt-1">Adicione vendas ao caixa de hoje</p>
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
