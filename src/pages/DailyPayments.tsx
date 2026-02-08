import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

export default function DailyPayments() {
  const { dailyPayments, addDailyPayment, deleteDailyPayment, todayPaymentsTotal } = useStore();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!name.trim() || !val || val <= 0) {
      toast.error('Preencha nome e valor');
      return;
    }
    addDailyPayment({
      employeeName: name.trim(),
      amount: val,
      date: new Date().toISOString().split('T')[0],
    });
    toast.success('Diária registrada!');
    setName('');
    setAmount('');
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayPayments = dailyPayments.filter(p => p.date === todayStr);
  const otherPayments = dailyPayments.filter(p => p.date !== todayStr);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-extrabold tracking-tight">Diárias</h2>
        <p className="text-muted-foreground text-sm mt-1">Registre os pagamentos de diárias dos funcionários</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="rounded-xl border bg-card p-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome do Funcionário</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: João" maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label>Valor da Diária (R$)</Label>
            <Input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0,00" className="font-mono" />
          </div>
        </div>
        <Button type="submit" className="w-full gap-2"><Plus size={18} /> Registrar Diária</Button>
      </motion.form>

      {/* Today total */}
      <div className="rounded-xl border bg-destructive/10 border-destructive/30 p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Diárias Hoje</p>
        <p className="text-2xl font-extrabold font-mono text-destructive mt-1">{formatCurrency(todayPaymentsTotal)}</p>
      </div>

      {/* Today */}
      {todayPayments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Hoje</h3>
          <div className="rounded-xl border bg-card overflow-hidden divide-y divide-border">
            {todayPayments.map(p => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-semibold">{p.employeeName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold font-mono">{formatCurrency(p.amount)}</p>
                  <button
                    onClick={() => { deleteDailyPayment(p.id); toast.info('Diária removida'); }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previous */}
      {otherPayments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Anteriores</h3>
          <div className="rounded-xl border bg-card overflow-hidden divide-y divide-border">
            {otherPayments.slice(0, 20).map(p => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-semibold">{p.employeeName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <p className="text-sm font-bold font-mono">{formatCurrency(p.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
