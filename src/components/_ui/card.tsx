import { cn, createStyle, GetStyleConfig } from "@/lib/utils";
import { ComponentProps } from "react";

const styled = createStyle({
  variant: {
    neutral: "bg-neutral/10 border-neutral/30",
    primary: "bg-primary/10 border-primary/30",
    secondary: "bg-secondary/10 border-secondary/30",
    accent: "bg-accent/10 border-accent/30",
    info: "bg-info/10 border-info/30",
    success: "bg-success/10 border-success/30",
    warning: "bg-warning/10 border-warning/30",
    error: "bg-error/10 border-error/30",
  },
  size: {
    xs: "daisy-card-xs",
    sm: "daisy-card-sm",
    md: "daisy-card-md",
    lg: "daisy-card-lg",
    xl: "daisy-card-xl",
  },
  modifier: {
    wide: "daisy-btn-wide",
    block: "daisy-btn-block",
    square: "daisy-btn-square",
    circle: "daisy-btn-circle",
    figureSide: "daisy-card-side",
    figureFull: "daisy-image-full",
  },
  appearance: {
    ghost: "border-0",
    border: "daisy-card-border",
    dash: "daisy-card-dash",
  },
});

interface Props extends ComponentProps<"div"> {
  variant?: GetStyleConfig<typeof styled, "variant">;
  size?: GetStyleConfig<typeof styled, "size">;
  modifier?: GetStyleConfig<typeof styled, "modifier">;
  appearance?: GetStyleConfig<typeof styled, "appearance">;
}

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
      className={Card.getStyle(className, {
        variant,
        size,
        modifier,
        appearance,
      })}
      {...props}
    >
      <div className={cn("daisy-card-body", appearance === "ghost" && "p-0")}>
        {children}
      </div>
    </div>
  );
}

Card.getStyle = styled((className, props, style) => {
  return cn(
    "daisy-card daisy-card-border border border-base-300 bg-base-100",
    props?.variant && style.variant[props.variant],
    props?.size && style.size[props.size],
    props?.modifier && style.modifier[props.modifier],
    props?.appearance && style.appearance[props.appearance],
    className,
  );
});

function Title({ children, className, ...props }: ComponentProps<"h3">) {
  return (
    <h3 className={Title.getStyle(className)} {...props}>
      {children}
    </h3>
  );
}

Title.getStyle = styled((className) => {
  return cn(
    "daisy-card-title text-sm text-base-content/60 tracking-wider",
    className,
  );
});

function Actions({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div className={Actions.getStyle(className)} {...props}>
      {children}
    </div>
  );
}

Actions.getStyle = styled((className) => {
  return cn("daisy-card-actions", className);
});

Card.Title = Title;
Card.Actions = Actions;
