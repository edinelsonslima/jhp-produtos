import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/hooks/useStore";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Package, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Products() {
  const { products, addProduct, deleteProduct } = useStore();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState<"unidade" | "litro">("litro");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(price);
    if (!name.trim() || !val || val <= 0) {
      toast.error("Preencha todos os campos");
      return;
    }
    addProduct({ name: name.trim(), unit, price: val });
    toast.success("Produto adicionado!");
    setName("");
    setPrice("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-extrabold tracking-tight">Produtos</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie seu catálogo de produtos
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="rounded-xl border bg-card p-6 space-y-4"
      >
        <div className="space-y-2">
          <Label>Nome do Produto</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Metazil"
            maxLength={100}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Unidade</Label>
            <Select
              value={unit}
              onValueChange={(v) => setUnit(v as "unidade" | "litro")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="litro">Por Litro</SelectItem>
                <SelectItem value="unidade">Por Unidade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Preço (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0,00"
              className="font-mono"
            />
          </div>
        </div>
        <Button type="submit" className="w-full gap-2">
          <Plus size={18} /> Adicionar Produto
        </Button>
      </motion.form>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Catálogo ({products.length})
        </h3>
        <div className="rounded-xl border bg-card overflow-hidden divide-y divide-border">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <div className="flex items-center gap-3">
                <Package size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.unit === "litro" ? "Por litro" : "Por unidade"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold font-mono">
                  {formatCurrency(p.price)}
                </p>
                <button
                  onClick={() => {
                    deleteProduct(p.id);
                    toast.info("Produto removido");
                  }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
