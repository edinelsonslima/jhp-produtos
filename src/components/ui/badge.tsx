import { cn } from "@/lib/utils";

const variantClasses = {
  default: "daisy-badge-primary",
  secondary: "daisy-badge-secondary",
  destructive: "daisy-badge-error",
  outline: "daisy-badge-outline",
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
      className={cn("daisy-badge", variantClasses[variant], className)}
      {...props}
    />
  );
}

export { Badge };
