import { cn } from "@/lib/utils";

const variantClasses = {
  default: "btn-primary",
  destructive: "btn-error",
  outline: "btn-outline",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  link: "btn-link",
} as const;

const sizeClasses = {
  default: "",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "btn-square btn-sm",
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
}

function Button({
  variant = "default",
  size = "default",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "btn",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}

function buttonVariants({
  variant = "default",
  className = "",
}: {
  variant?: string;
  className?: string;
}) {
  return cn(
    "btn",
    variantClasses[variant as keyof typeof variantClasses] ?? "btn-primary",
    className,
  );
}

export { Button, buttonVariants };
