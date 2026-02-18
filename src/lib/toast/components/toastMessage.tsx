import { AnimationEvent, useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { IToastMessageProps } from "../@types";

export function ToastMessage({
  duration = 7000,
  id,
  children,
  className,
  animationUnmount: animationUnmountProp,
  onRemoveMessage,
  ...props
}: IToastMessageProps) {
  const [animationUnmount, setAnimationUnmount] = useState<string>("");

  const handleRemoveMessage = (event: AnimationEvent<HTMLSpanElement>) => {
    if (!event.currentTarget.classList?.contains(animationUnmount!)) {
      return;
    }

    onRemoveMessage(id);
  };

  const handleActiveAnimationUnmount = useCallback(() => {
    setAnimationUnmount(animationUnmountProp || "animate-pulse");
  }, [animationUnmountProp]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      return handleActiveAnimationUnmount();
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [duration, handleActiveAnimationUnmount]);

  return (
    <span
      role="button"
      tabIndex={0}
      onAnimationEnd={handleRemoveMessage}
      onClick={handleActiveAnimationUnmount}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleActiveAnimationUnmount();
      }}
      className={cn(className, animationUnmount)}
      {...props}
    >
      {children}
    </span>
  );
}
