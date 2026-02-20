import { Title } from "@/components/_layout/title";
import { Button } from "@/components/_ui/button";
import { Card } from "@/components/_ui/card";
import { ConfirmButton } from "@/components/_ui/confirm-button";
import { Label } from "@/components/_ui/label";
import { toast } from "@/components/_ui/toast";
import { CurrencyInput } from "@/components/currency/Input";
import { productStore } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/utils";
import { m } from "framer-motion";
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
      <Title title="Produtos" subtitle="Gerencie seu catálogo de produtos" />

      <m.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className={Card.getStyle("p-3 space-y-4")}
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
        <Button type="submit" variant="primary" modifier="block">
          <Plus size={18} /> Adicionar Produto
        </Button>
      </m.form>

      <div>
        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
          Catálogo ({products.length})
        </h3>
        <Card className="overflow-hidden divide-y divide-base-300 p-0">
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
                <ConfirmButton
                  size="xs"
                  variant="error"
                  appearance="soft"
                  onConfirm={() => {
                    productStore.action.delete(p.id);
                    toast.info("Produto removido");
                  }}
                >
                  <Trash2 size={14} />
                </ConfirmButton>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
