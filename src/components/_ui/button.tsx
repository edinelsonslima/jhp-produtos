import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const variants = {
  neutral: "daisy-btn-neutral",
  primary: "daisy-btn-primary",
  secondary: "daisy-btn-secondary",
  accent: "daisy-btn-accent",
  info: "daisy-btn-info",
  success: "daisy-btn-success",
  warning: "daisy-btn-warning",
  error: "daisy-btn-error",
} as const;

const sizes = {
  xs: "daisy-btn-xs",
  sm: "daisy-btn-sm",
  md: "daisy-btn-md",
  lg: "daisy-btn-lg",
  xl: "daisy-btn-xl",
} as const;

const appearances = {
  outline: "daisy-btn-outline",
  dash: "daisy-btn-dash",
  soft: "daisy-btn-soft",
  ghost: "daisy-btn-ghost",
  link: "daisy-btn-link",
} as const;

const modifiers = {
  wide: "daisy-btn-wide",
  block: "daisy-btn-block",
  square: "daisy-btn-square",
  circle: "daisy-btn-circle",
} as const;

interface StylesProps {
  disabled?: boolean;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  appearance?: keyof typeof appearances;
  modifier?: keyof typeof modifiers;
}

interface ButtonProps extends ComponentProps<"button">, StylesProps {
  disableDefaultStyles?: boolean;
  active?: boolean;
}

export function Button({
  variant,
  size,
  appearance,
  modifier,
  className,
  active = false,
  disableDefaultStyles = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        !disableDefaultStyles && "daisy-btn",
        !disableDefaultStyles && size && sizes[size],
        !disableDefaultStyles && variant && variants[variant],
        !disableDefaultStyles && appearance && appearances[appearance],
        !disableDefaultStyles && modifier && modifiers[modifier],
        !disableDefaultStyles && props.disabled && "daisy-btn-disabled",
        active && "daisy-btn-active",
        className,
      )}
      {...props}
    />
  );
}

function getButtonStyle(props?: StylesProps): string;
function getButtonStyle(className?: string): string;
function getButtonStyle(className: string, props?: StylesProps): string;
function getButtonStyle(first?: string | StylesProps, second?: StylesProps) {
  let className: string = "";
  let styles: StylesProps = {};

  if (typeof first === "object") {
    styles = first;
  }

  if (typeof second === "object") {
    styles = second;
  }

  if (typeof first === "string") {
    className = first;
  }

  return cn(
    "daisy-btn",
    styles?.size && sizes[styles.size],
    styles?.variant && variants[styles.variant],
    styles?.appearance && appearances[styles.appearance],
    styles?.modifier && modifiers[styles.modifier],
    styles?.disabled && "daisy-btn-disabled",
    className,
  );
}

Button.style = getButtonStyle;
