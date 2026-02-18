import { cn, formatCurrency } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCurrencyProps {
  value: number;
  className?: string;
}

export function AnimatedCurrency({ value, className }: AnimatedCurrencyProps) {
  const formatted = formatCurrency(value);
  const prevFormatted = useRef(formatted);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (prevFormatted.current !== formatted) {
      prevFormatted.current = formatted;
      setKey((k) => k + 1);
    }
  }, [formatted]);

  return (
    <span
      className={cn("inline-flex overflow-hidden", className)}
      style={{ perspective: "400px" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={key}
          initial={{ y: "-100%", rotateX: -90, opacity: 0 }}
          animate={{ y: 0, rotateX: 0, opacity: 1 }}
          exit={{ y: "100%", rotateX: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="inline-block"
        >
          {formatted}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
