import { CurrencyInput } from "@/components/CurrencyInput";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { productStore } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Package, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Products() {
  const products = productStore.useStore((state) => state.products);

  const [name, setName] = useState("");
  const [unit, setUnit] = useState<"unidade" | "litro">("litro");
  const [price, setPrice] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Nome do produto deve ter ao menos 2 caracteres");
      return;
    }

    if (price <= 0) {
      toast.error("Informe um preço válido");
      return;
    }

    productStore.action.add({ name: name.trim(), unit, price });
    toast.success("Produto adicionado!");
    setName("");
    setPrice(0);
  };

  return (
    <>
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="rounded-xl border border-base-300 bg-base-100 p-3 space-y-4"
      >
        <div className="space-y-2">
          <Label>Nome do Produto</Label>
          <input
            className="daisy-input w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Água Mineral, Gasolina, etc."
            maxLength={100}
            minLength={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Unidade</Label>
            <select
              className="daisy-select w-full"
              value={unit}
              onChange={(e) => setUnit(e.target.value as "unidade" | "litro")}
            >
              <option value="litro">Por Litro</option>
              <option value="unidade">Por Unidade</option>
            </select>
          </div>
          <div className="space-y-2">
            <CurrencyInput
              value={price}
              label="Preço (R$)"
              onValueChange={setPrice}
              placeholder="0,00"
            />
          </div>
        </div>
        <button
          type="submit"
          className="daisy-btn daisy-btn-primary w-full gap-2"
        >
          <Plus size={18} /> Adicionar Produto
        </button>
      </motion.form>

      <div>
        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
          Catálogo ({products.length})
        </h3>
        <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden divide-y divide-base-300">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <div className="flex items-center gap-3">
                <Package size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-base-content/60">
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
                    productStore.action.delete(p.id);
                    toast.info("Produto removido");
                  }}
                  className="p-2 rounded-lg text-base-content/60 hover:text-error hover:bg-error/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
