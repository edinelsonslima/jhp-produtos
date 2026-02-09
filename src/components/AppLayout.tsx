import { cn } from "@/lib/utils";
import {
  Calculator,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Fragment, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/calculadora", icon: Calculator, label: "Troco" },
  { to: "/vendas", icon: ShoppingCart, label: "Vendas" },
  { to: "/diarias", icon: Users, label: "Diárias" },
  { to: "/produtos", icon: Package, label: "Produtos" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex flex-col md:flex-row h-dvh overflow-hidden overflow-y-auto">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-extrabold tracking-tight">
            <span className="text-sidebar-primary">JHP</span> Produtos
          </h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">
            Gestão de Vendas
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar text-sidebar-foreground sticky top-0">
        <h1 className="text-lg font-extrabold">
          <span className="text-sidebar-primary">JHP</span> Produtos
        </h1>
      </header>

      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>

      {/* Mobile Header */}
      <aside className="md:hidden sticky bottom-0">
        <nav className="flex flex-1 align-center justify-around gap-5 py-1 px-4 bg-sidebar">
          {navItems.map((item) => {
            const active = location.pathname === item.to;

            if (item.to === "/vendas") {
              return (
                <Fragment key={item.to}>
                  <item.icon size={20} className="bg-transparent invisible" />
                  <Link
                    key={item.to}
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
