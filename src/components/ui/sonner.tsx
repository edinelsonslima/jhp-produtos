import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-base-100 group-[.toaster]:text-base-content group-[.toaster]:border-base-300 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-base-content/60",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-content",
          cancelButton:
            "group-[.toast]:bg-base-200 group-[.toast]:text-base-content/60",
        },
      }}
      {...props}
    />
  );
};

export { toast, Toaster };
