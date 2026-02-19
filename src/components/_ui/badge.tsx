import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const variants = {
  default: "daisy-badge-primary",
  secondary: "daisy-badge-secondary",
  destructive: "daisy-badge-error",
  outline: "daisy-badge-outline",
} as const;

interface BadgeProps extends ComponentProps<"div"> {
  variant?: keyof typeof variants;
}

function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <div
      className={cn("daisy-badge", variants[variant], className)}
      {...props}
    />
  );
}

export { Badge };
