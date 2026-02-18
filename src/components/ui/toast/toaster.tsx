import { ToastContainer, ToastMessage } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  return (
    <ToastContainer
      defaultDuration={3000}
      className="daisy-toast daisy-toast-top daisy-toast-end z-50"
    >
      {({ content, id, type, duration, remove }) => (
        <ToastMessage
          key={id}
          id={id}
          duration={duration}
          onRemoveMessage={remove}
          animationUnmount="animate-fade-out"
          className={cn(
            "daisy-alert cursor-pointer",
            type === "ghost" && "daisy-alert-soft daisy-alert-outline",
            type === "error" && "daisy-alert-error",
            type === "info" && "daisy-alert-info",
            type === "success" && "daisy-alert-success",
            type === "warn" && "daisy-alert-warning",
          )}
        >
          {content}
        </ToastMessage>
      )}
    </ToastContainer>
  );
}