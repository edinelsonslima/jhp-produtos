import { cn } from "@/lib/utils";

const variantClasses = {
  default: "daisy-btn-primary",
  destructive: "daisy-btn-error",
  outline: "daisy-btn-outline",
  secondary: "daisy-btn-secondary",
  ghost: "daisy-btn-ghost",
  link: "daisy-btn-link",
} as const;

const sizeClasses = {
  default: "daisy-btn-md",
  sm: "daisy-btn-sm",
  lg: "daisy-btn-lg",
  icon: "daisy-btn-square daisy-btn-sm",
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
        "daisy-btn",
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
    "daisy-btn",
    variantClasses[variant as keyof typeof variantClasses] ??
      "daisy-btn-primary",
    className,
  );
}

export { Button, buttonVariants };
