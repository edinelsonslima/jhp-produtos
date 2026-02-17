import { motion } from "framer-motion";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof motion.div>{
  title: string;
  subtitle: string;
}

export function Title({ title, subtitle, ...props }: Props) {
  if (!title && !subtitle) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} {...props}>
      <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
      <p className="text-base-content/60 text-sm mt-1">{subtitle}</p>
    </motion.div>
  );
}
