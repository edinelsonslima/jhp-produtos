import { cn, formatCurrency } from "@/lib/utils";
import { Product, SaleProduct } from "@/types";
import { motion, useDragControls } from "framer-motion";
import { Package, Trash2 } from "lucide-react";
import { PointerEvent, useRef, useState } from "react";
import { Button } from "./ui/button";

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
  };

  function handlePointerDown(e: PointerEvent<HTMLButtonElement>) {
    const isDrag = e.pointerType === "mouse" && e.button !== 0;
    if (isDrag) {
      return;
    }

    if (!selected || longPressActive) return;

    longPressTimer.current = window.setTimeout(() => {
      setLongPressActive(true);
    }, 500);
  }

  function handlePointerUp() {
    if (!longPressTimer.current) {
      return;
    }

    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  }

  function handleDragStart() {
    isDragging.current = true;
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    isDragging.current = false;

    if (info.offset.x < -80) {
      updateProductByQuantity(quantity - 1);
    }

    if (info.offset.x > 80) {
      updateProductByQuantity(quantity + 1);
    }
  }

  function handleClick() {
    if (isDragging.current) return;
    updateProductByQuantity(quantity + 1);
  }

  return (
    <motion.button
      type="button"
      drag={!longPressActive ? "x" : false}
      dragControls={dragControls}
      animate={false}
      dragElastic={1}
      dragMomentum={false}
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
        <Button
          type="button"
          variant="destructive"
          className="flex gap-2 w-full"
          onClick={(e) => {
            e.stopPropagation();
            updateProductByQuantity(0);
            setLongPressActive(false);
          }}
        >
          <Trash2 size={14} />
          Limpar
        </Button>
      )}

      {!longPressActive && (
        <div className="flex items-center justify-between w-full">
          <span className="font-mono font-bold text-sm text-primary">
            {formatCurrency(product.price)}
          </span>

          <span className="text-xs text-muted-foreground">
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
