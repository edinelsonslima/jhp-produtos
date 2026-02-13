import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface CurrencyInputProps {
  value: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  onValueChange: (value: number) => void;
}

export function CurrencyInput({
  value,
  label,
  className,
  disabled,
  placeholder = "0,00",
  onValueChange,
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const cents = parseInt(raw || "0", 10);
    onValueChange(cents / 100);
  };

  const display =
    value > 0
      ? value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "";

  return (
    <>
      {label && <Label>{label}</Label>}

      <label className={cn("daisy-input w-full", className)}>
        <span className="daisy-label">R$</span>
        <input
          type="text"
          className="grow font-mono w-full"
          placeholder={placeholder}
          inputMode="numeric"
          value={display}
          disabled={disabled}
          onChange={handleChange}
        />
      </label>
    </>
  );
}
