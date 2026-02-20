import { cn, createStyle, GetStyleConfig } from "@/lib/utils";
import { ComponentProps } from "react";

const styled = createStyle({
  variant: {
    neutral: "daisy-badge-neutral",
    primary: "daisy-badge-primary",
    secondary: "daisy-badge-secondary",
    accent: "daisy-badge-accent",
    info: "daisy-badge-info",
    success: "daisy-badge-success",
    warning: "daisy-badge-warning",
    error: "daisy-badge-error",
  },
  appearance: {
    outline: "daisy-badge-outline",
    dash: "daisy-badge-dash",
    soft: "daisy-badge-soft",
    ghost: "daisy-badge-ghost",
  },
  size: {
    xs: "daisy-badge-xs",
    sm: "daisy-badge-sm",
    md: "daisy-badge-md",
    lg: "daisy-badge-lg",
    xl: "daisy-badge-xl",
  },
});

interface BadgeProps extends ComponentProps<"div"> {
  variant?: GetStyleConfig<typeof styled, "variant">;
  appearance?: GetStyleConfig<typeof styled, "appearance">;
  size?: GetStyleConfig<typeof styled, "size">;
}

export function Badge({
  variant,
  appearance,
  size,
  className,
  ...props
}: BadgeProps) {
  return (
    <div
      className={Badge.getStyles(className, { variant, appearance, size })}
      {...props}
    />
  );
}

Badge.getStyles = styled((className, props, styles) => {
  const { variant, appearance, size } = props || {};

  return cn(
    "daisy-badge",
    variant && styles.variant[variant],
    appearance && styles.appearance[appearance],
    size && styles.size[size],
    className,
  );
});
