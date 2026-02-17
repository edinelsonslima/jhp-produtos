import { authStore } from "@/hooks/useAuth";
import { themeStore } from "@/hooks/useTheme";
import { ComponentProps, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Mobile } from "./mobile";
import { Title } from "./title";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const params = useLocation();

  const user = authStore.useStore((state) => state.user);
  const theme = themeStore.useStore((state) => state.theme);

  const titleMap: Record<string, ComponentProps<typeof Title>> = {
    "/": {
      title: `${getGreeting()}, ${user?.name?.split(" ")[0] ?? ""}!`,
      subtitle: `Resumo do dia ${new Date().toLocaleDateString("pt-BR")}`,
    },
    "/vendas": {
      title: "Vendas",
      subtitle: "Adicione vendas ao caixa de hoje",
    },
    "/pagamentos": {
      title: "Pagamentos",
      subtitle: "Selecione um funcionário e registre a diária",
    },
    "/produtos": {
      title: "Produtos",
      subtitle: "Gerencie seu catálogo de produtos",
    },
    "/auditoria": {
      title: "Auditoria",
      subtitle: "Registro de todas as ações do sistema",
    },
  };

  return (
    <Mobile user={user} theme={theme}>
      <Title {...titleMap[params.pathname]} />
      {children}
    </Mobile>
  );
}
