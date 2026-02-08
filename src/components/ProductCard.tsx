import { cn, formatCurrency } from "@/lib/utils";
import { Product, SaleProduct } from "@/types";
import { motion, useDragControls } from "framer-motion";
import { Package, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { buttonVariants } from "./ui/button";

interface Props {
  product: Product;
  quantity: number;
  onSelect: (product: SaleProduct) => void;
}

export function ProductCard({ product, quantity, onSelect }: Props) {
  const dragControls = useDragControls();
  const [longPressActive, setLongPressActive] = useState(false);

  const longPressTimer = useRef<number | null>(null);
  const isDragging = useRef(false);
  const selected = quantity > 0;

  const updateProductByQuantity = (quantity: number = 0) => {
    const newQuantity = Math.max(quantity, 0);
    onSelect({ ...product, quantity: newQuantity });
    feedbackVibrate(30);
  };

  const feedbackVibrate = (pattern: number | number[]) => {
    window?.navigator?.vibrate(pattern);
  };

  const handlePointerDown = () => {
    if (!selected || longPressActive) return;

    longPressTimer.current = window.setTimeout(() => {
      setLongPressActive(true);
      feedbackVibrate(10);
    }, 500);
  };

  const handlePointerUp = () => {
    if (!longPressTimer.current) {
      return;
    }

    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    isDragging.current = false;

    if (info.offset.x < -80) {
      updateProductByQuantity(quantity + 1);
    }

    if (info.offset.x > 80) {
      updateProductByQuantity(quantity - 1);
    }
  };

  const handleClick = () => {
    if (isDragging.current) return;
    updateProductByQuantity(quantity + 1);
  };

  return (
    <motion.button
      type="button"
      drag={!longPressActive ? "x" : false}
      dragControls={dragControls}
      dragTransition={{ bounceStiffness: 100, bounceDamping: 9999 }}
      dragElastic={1}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex flex-col items-start p-4 rounded-xl border transition-all text-left select-none touch-pan-y",
        selected
          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
          : "border-border bg-card md:hover:border-primary/50 md:hover:bg-accent/50",
      )}
    >
      <div className="flex items-center gap-2 mb-2 w-full">
        <Package size={16} className="text-primary" />
        <span className="font-semibold text-sm truncate w-full">
          {product.name}
        </span>
      </div>

      {longPressActive && (
        <span
          className={buttonVariants({
            variant: "destructive",
            className: "w-full",
          })}
          onClick={(e) => {
            if (longPressTimer.current) {
              return;
            }

            e.stopPropagation();
            updateProductByQuantity(0);
            setLongPressActive(false);
          }}
        >
          <Trash2 size={14} />
          Limpar
        </span>
      )}

      {!longPressActive && (
        <div className="flex items-center justify-between w-full">
          <span className="font-mono font-bold text-sm text-primary">
            {formatCurrency(product.price)}
          </span>

          <span
            className={cn(
              "text-xs text-muted-foreground",
              quantity && "font-bold text-primary",
            )}
          >
            {!quantity
              ? product.unit === "litro"
                ? "litro"
                : "uni"
              : `${quantity}x`}
          </span>
        </div>
      )}
    </motion.button>
  );
}
