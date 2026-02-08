import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  variant?: 'default' | 'pix' | 'cash' | 'destructive';
  delay?: number;
}

const variantStyles = {
  default: 'bg-card border-border',
  pix: 'bg-pix/10 border-pix/30',
  cash: 'bg-cash/10 border-cash/30',
  destructive: 'bg-destructive/10 border-destructive/30',
};

const iconStyles = {
  default: 'text-primary',
  pix: 'text-pix',
  cash: 'text-cash',
  destructive: 'text-destructive',
};

export default function StatCard({ label, value, icon: Icon, variant = 'default', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`rounded-xl border p-5 ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-extrabold mt-1 font-mono">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${variant === 'default' ? 'bg-primary/10' : ''}`}>
          <Icon size={22} className={iconStyles[variant]} />
        </div>
      </div>
    </motion.div>
  );
}
