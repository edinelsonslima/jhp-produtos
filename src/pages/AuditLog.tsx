import { Badge } from "@/components/ui/badge";
import { getAuditLog } from "@/lib/audit";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";

const ACTION_LABELS: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  login: { label: "Login", variant: "default" },
  logout: { label: "Logout", variant: "secondary" },
  user_registered: { label: "Cadastro", variant: "default" },
  sale_created: { label: "Venda", variant: "default" },
  sale_edited: { label: "Edição Venda", variant: "secondary" },
  sale_deleted: { label: "Exclusão Venda", variant: "destructive" },
  payment_created: { label: "Diária", variant: "default" },
  payment_deleted: { label: "Exclusão Diária", variant: "destructive" },
  employee_created: { label: "Func. Cadastrado", variant: "default" },
  employee_deleted: { label: "Func. Excluído", variant: "destructive" },
  product_created: { label: "Produto Criado", variant: "default" },
  product_deleted: { label: "Produto Excluído", variant: "destructive" },
};

export default function AuditLog() {
  const entries = getAuditLog();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-extrabold tracking-tight">Auditoria</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Registro de todas as ações do sistema
        </p>
      </motion.div>

      {entries.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          <ClipboardList size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Nenhum registro de auditoria</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden divide-y divide-border">
          {entries.map((entry) => {
            const config = ACTION_LABELS[entry.action] ?? {
              label: entry.action,
              variant: "outline" as const,
            };
            return (
              <div
                key={entry.id}
                className="px-4 py-3 flex items-start gap-3"
              >
                <Badge
                  variant={config.variant}
                  className="mt-0.5 shrink-0 text-xs"
                >
                  {config.label}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{entry.details}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {entry.userName} •{" "}
                    {new Date(entry.timestamp).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
