import { cn, formatCurrency } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import { ComponentProps, useEffect, useRef, useState } from "react";

interface Props extends ComponentProps<"span"> {
  value: number;
  className?: string;
}

export function Currency({ value, className, ...props }: Props) {
  const formatted = formatCurrency(value);

  const [key, setKey] = useState(0);
  const prevFormatted = useRef(formatted);

  useEffect(() => {
    if (prevFormatted.current !== formatted) {
      prevFormatted.current = formatted;
      setKey((k) => k + 1);
    }
  }, [formatted]);

  return (
    <span
      className={cn(
        "inline-flex overflow-hidden perspective-[400px]",
        className,
      )}
      {...props}
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
