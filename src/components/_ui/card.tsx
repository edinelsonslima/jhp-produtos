import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const variants = {
  neutral: "bg-neutral/10 border-neutral/30",
  primary: "bg-primary/10 border-primary/30",
  secondary: "bg-secondary/10 border-secondary/30",
  accent: "bg-accent/10 border-accent/30",
  info: "bg-info/10 border-info/30",
  success: "bg-success/10 border-success/30",
  warning: "bg-warning/10 border-warning/30",
  error: "bg-error/10 border-error/30",
} as const;

const sizes = {
  xs: "daisy-card-xs",
  sm: "daisy-card-sm",
  md: "daisy-card-md",
  lg: "daisy-card-lg",
  xl: "daisy-card-xl",
} as const;

const modifiers = {
  side: "daisy-card-side",
  imageFull: "daisy-image-full",
} as const;

const appearances = {
  border: "daisy-card-border",
  dash: "daisy-card-dash",
} as const;

interface StylesProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  modifier?: keyof typeof modifiers;
  appearance?: keyof typeof appearances;
}

interface Props extends ComponentProps<"div">, StylesProps {}

export function Card({
  children,
  className,
  variant,
  size = "sm",
  modifier,
  appearance,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "daisy-card daisy-card-border border border-base-300 bg-base-100",
        variant && variants[variant],
        size && sizes[size],
        modifier && modifiers[modifier],
        appearance && appearances[appearance],
        className,
      )}
      {...props}
    >
      <div className="daisy-card-body">{children}</div>
    </div>
  );
}

Card.Title = function Title({
  children,
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "daisy-card-title text-sm font-semibold text-base-content/80 tracking-wider",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

Card.Actions = function Actions({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("daisy-card-actions", className)} {...props}>
      {children}
    </div>
  );
};
