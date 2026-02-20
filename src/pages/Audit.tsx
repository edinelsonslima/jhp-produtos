import { Title } from "@/components/_layout/title";
import { Badge } from "@/components/_ui/badge";
import { getAuditLog } from "@/lib/audit";
import { ClipboardList } from "lucide-react";
import { ComponentProps } from "react";

interface ActionConfig extends ComponentProps<typeof Badge> {
  label: string;
}

const ACTION_LABELS: Record<string, ActionConfig> = {
  login: { label: "Login", variant: "accent" },
  logout: { label: "Logout", variant: "secondary" },
  user_registered: { label: "Cadastro", variant: "accent" },
  sale_created: { label: "Venda", variant: "success" },
  sale_edited: { label: "Edição Venda", variant: "warning" },
  sale_deleted: { label: "Exclusão Venda", variant: "error" },
  sale_updated: { label: "Atualização Venda", variant: "warning" },
  payment_created: { label: "Diária", variant: "accent" },
  payment_deleted: { label: "Exclusão Diária", variant: "error" },
  employee_created: { label: "Func. Cadastrado", variant: "accent" },
  employee_deleted: { label: "Func. Excluído", variant: "error" },
  product_created: { label: "Produto Criado", variant: "accent" },
  custom_product_created: { label: "Produto Criado", variant: "accent" },
};

export default function Audit() {
  const entries = getAuditLog();

  return (
    <>
      <Title
        title="Auditoria"
        subtitle="Registro de todas as ações do sistema"
      />

      {entries.length === 0 ? (
        <div className="rounded-xl border border-base-300 bg-base-100 p-8 text-center text-base-content/60">
          <ClipboardList size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Nenhum registro de auditoria</p>
        </div>
      ) : (
        <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden divide-y divide-base-300">
          {entries.map((entry) => {
            const config = ACTION_LABELS[entry.action] ?? {
              label: entry.action,
              variant: "outline" as const,
            };

            return (
              <div
                key={entry.id}
                className="px-4 py-3 flex flex-col items-start gap-3"
              >
                <Badge variant={config.variant} className="text-xs">
                  {config.label}
                </Badge>

                <div className="min-w-0 max-w-full overflow-x-auto">
                  <p className="text-sm whitespace-nowrap">{entry.details}</p>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    {entry.userName} •{" "}
                    {new Date(entry.timestamp).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
