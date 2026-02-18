import { cn, formatCurrency } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import { ComponentProps, useRef } from "react";

interface Props extends ComponentProps<"span"> {
  value: number;
}

export function Currency({ value, className, ...props }: Props) {
  const formatted = formatCurrency(value);
  const previousValue = useRef(value);

  const isDecreasing = value < previousValue.current;
  const isIncreasing = value > previousValue.current;

  previousValue.current = value;

  // Direção do flip 3D
  const initial = isDecreasing
    ? { rotateX: 90, y: "40%", opacity: 0, scale: 0.96, filter: "blur(2px)" } // baixo → cima
    : { rotateX: -90, y: "-40%", opacity: 0, scale: 0.96, filter: "blur(2px)" }; // cima → baixo

  const exit = isDecreasing
    ? { rotateX: -90, y: "-40%", opacity: 0, scale: 0.96, filter: "blur(2px)" }
    : { rotateX: 90, y: "40%", opacity: 0, scale: 0.96, filter: "blur(2px)" };

  const animate = {
    rotateX: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    color: isDecreasing
      ? ["inherit", "#ef4444", "#ef4444", "inherit"] // vermelho
      : isIncreasing
      ? ["inherit", "#22c55e", "#22c55e", "inherit"] // verde
      : "inherit",
  };

  const transition = {
    rotateX: { type: "spring", stiffness: 140, damping: 18, mass: 0.6 },
    y: { type: "spring", stiffness: 140, damping: 18, mass: 0.6 },
    scale: { duration: 0.35, ease: "easeOut" },
    opacity: { duration: 0.25 },
    filter: { duration: 0.25 },
    color: { duration: 0.9, times: [0, 0.2, 0.7, 1], ease: "easeInOut" },
  };

  return (
    <span
      className={cn(
        "inline-flex overflow-hidden [perspective:600px]",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={formatted}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
          className="inline-block will-change-transform"
          style={{ transformOrigin: "50% 50%" }}
        >
          {formatted}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
