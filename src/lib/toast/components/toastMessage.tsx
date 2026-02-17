import { AnimationEvent, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { IToastMessageProps } from "../@types";

export function ToastMessage({
  duration = 1000 * 7,
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

  const handleActiveAnimationUnmount = () => {
    setAnimationUnmount(animationUnmountProp || "animate-pulse");
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      return handleActiveAnimationUnmount();
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [duration]);

  return (
    <span
      tabIndex={0}
      onAnimationEnd={handleRemoveMessage}
      onClick={handleActiveAnimationUnmount}
      className={cn(className, animationUnmount)}
      {...props}
    >
      {children}
    </span>
  );
}
