import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn("input input-bordered w-full", className)}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
