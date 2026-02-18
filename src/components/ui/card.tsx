import { cn } from "@/lib/utils";
import { ComponentProps, PropsWithChildren } from "react";

interface CardProps extends ComponentProps<"div"> {
  variant?: "default" | "success" | "warning" | "error";
}

const variantStyles = {
  default: "bg-base-100 border-base-300",
  success: "bg-success/10 border-success/30",
  warning: "bg-warning/10 border-warning/30",
  error: "bg-error/10 border-error/30",
};

export function Card({
  children,
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Title = function Title({
  children,
  className,
  ...props
}: PropsWithChildren<ComponentProps<"h3">>) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold text-base-content/60 uppercase tracking-wider",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

Card.Body = function Body({
  children,
  className,
  ...props
}: PropsWithChildren<ComponentProps<"div">>) {
  return (
    <div className={cn("mt-3", className)} {...props}>
      {children}
    </div>
  );
};
