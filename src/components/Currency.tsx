import { cn, formatCurrency } from "@/lib/utils";
import { animate, motion, useMotionValue } from "framer-motion";
import { ComponentProps, useEffect, useRef, useState } from "react";

type Status = "up" | "down" | "idle";

interface Props extends ComponentProps<typeof motion.div> {
  children: number;
  duration?: number;
}

export function Currency({ children, className, duration = 0.6, ...props }: Props) {
  const prevValue = useRef<number | null>(null);
  const motionValue = useMotionValue(children);

  const [display, setDisplay] = useState(children);
  const [color, setColor] = useState<Status>("idle");

  useEffect(() => {
    if (prevValue.current === null) {
      prevValue.current = children;
      motionValue.set(children);
      return;
    }

    const from = prevValue.current;
    const to = children;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColor(to > from ? "up" : to < from ? "down" : "idle");

    const controls = animate(motionValue, to, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(latest),
      onComplete: () => setColor("idle"),
    });

    prevValue.current = to;

    return () => {
      controls.stop();
    };
  }, [children, duration, motionValue]);

  return (
    <motion.div
      className={cn("inline-block transition-colors", className)}
      transition={{ duration: 0.4 }}
      animate={{
        scale: color === "idle" ? 1 : [1.05, 1],
        color: (() => {
          if (color === "up") return "var(--color-success)";
          if (color === "down") return "var(--color-error)";
          return "var(--color-success)";
        })(),
      }}
      {...props}
    >
      {formatCurrency(display)}
    </motion.div>
  );
}
