import { cn } from "@/lib/utils";

const variantClasses = {
  default: "badge-primary",
  secondary: "badge-secondary",
  destructive: "badge-error",
  outline: "badge-outline",
} as const;

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantClasses;
}

function Badge({
  variant = "default",
  className,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn("badge", variantClasses[variant], className)}
      {...props}
    />
  );
}

export { Badge };
