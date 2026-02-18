import { m } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  delay?: number;
  variant?: "default" | "success" | "warning" | "error";
}

const variantStyles = {
  default: "bg-base-100 border-base-300",
  success: "bg-success/10 border-success/30",
  warning: "bg-warning/10 border-warning/30",
  error: "bg-error/10 border-error/30",
};

const iconStyles = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  variant = "default",
  delay = 0,
}: StatCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`rounded-xl border p-5 ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-extrabold mt-1 font-mono truncate">
            {value}
          </p>
        </div>
        <div
          className={`p-3 rounded-xl ${variant === "default" ? "bg-primary/10" : ""}`}
        >
          <Icon size={22} className={iconStyles[variant]} />
        </div>
      </div>
    </m.div>
  );
}
