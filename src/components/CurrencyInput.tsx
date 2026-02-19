import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface CurrencyInputProps {
  name?: string;
  value?: number;
  defaultValue?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  label?: string;
  onValueChange?: (value: number) => void;
}

export function CurrencyInput({
  name,
  value,
  defaultValue,
  label,
  className,
  disabled,
  autoFocus,
  placeholder = "0,00",
  onValueChange,
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const cents = parseInt(raw || "0", 10);
    onValueChange?.(cents / 100);
  };

  let display;

  if (defaultValue) {
    display = defaultValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (value) {
    display = value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <>
      {label && <Label>{label}</Label>}

      <label className={cn("daisy-input w-full", className)}>
        <span className="daisy-label">R$</span>
        <input
          name={name}
          type="text"
          autoFocus={autoFocus}
          className="grow font-mono w-full"
          placeholder={placeholder}
          inputMode="numeric"
          disabled={disabled}
          defaultValue={defaultValue ? display : undefined}
          value={value ? display : undefined}
          onChange={onValueChange ? handleChange : undefined}
          onInput={(e) => {
            const input = e.currentTarget;
            const raw = input.value.replace(/\D/g, "");
            const cents = parseInt(raw || "0", 10);

            const formatted = (cents / 100).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

            input.value = formatted;

            return e;
          }}
        />
      </label>
    </>
  );
}
