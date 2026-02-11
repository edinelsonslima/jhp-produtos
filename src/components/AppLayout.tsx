import { cn } from "@/lib/utils";
import { authStore } from "@/hooks/useAuth";
import {
  Calculator,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Fragment, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNavItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/calculadora", icon: Calculator, label: "Troco" },
  { to: "/vendas", icon: ShoppingCart, label: "Vendas" },
  { to: "/diarias", icon: Users, label: "Diárias" },
  { to: "/produtos", icon: Package, label: "Produtos" },
];

const sidebarNavItems = [
  ...mainNavItems,
  { to: "/auditoria", icon: ClipboardList, label: "Auditoria" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const user = authStore.useStore((state) => state.user);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col md:flex-row h-dvh overflow-hidden overflow-y-auto">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground sticky top-0">
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              <span className="text-sidebar-primary">JHP</span> Produtos
            </h1>
            <p className="text-xs text-sidebar-foreground/60 mt-1">
              Gestão de Vendas
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuItem
                onClick={() => authStore.action.logout()}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <LogOut size={14} /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarNavItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar text-sidebar-foreground sticky top-0 z-40">
        <h1 className="text-lg font-extrabold">
          <span className="text-sidebar-primary">JHP</span> Produtos
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-xs font-bold">
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2 border-b">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
            <DropdownMenuItem asChild>
              <Link to="/auditoria" className="gap-2">
                <ClipboardList size={14} /> Auditoria
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => authStore.action.logout()}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <LogOut size={14} /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-1 p-4 md:p-8">{children}</main>

      {/* Mobile Bottom Nav */}
      <aside className="md:hidden sticky bottom-0 z-40">
        <nav className="flex flex-1 align-center justify-around gap-5 py-1 px-4 bg-sidebar">
          {mainNavItems.map((item) => {
            const active = location.pathname === item.to;

            if (item.to === "/vendas") {
              return (
                <Fragment key={item.to}>
                  <item.icon
                    size={20}
                    className="bg-transparent invisible"
                  />
                  <Link
                    to={item.to}
                    className={cn(
                      "absolute bottom-2 flex items-center justify-center gap-3 p-4 rounded-full text-sm font-medium transition-all border-b border-2 border-sidebar-foreground",
                      active
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "bg-sidebar text-sidebar-foreground",
                    )}
                  >
                    <item.icon size={20} />
                  </Link>
                </Fragment>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70",
                )}
              >
                <item.icon size={20} />
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
