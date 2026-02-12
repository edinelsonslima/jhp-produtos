import { cn } from "@/lib/utils";
import { authStore } from "@/hooks/useAuth";
import { THEMES, themeStore, Theme } from "@/hooks/useTheme";
import {
  Circle,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Palette,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Fragment, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const mainNavItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "", icon: Circle, label: "" },
  { to: "/vendas", icon: ShoppingCart, label: "Vendas" },
  { to: "/diarias", icon: Users, label: "Diárias" },
  { to: "/produtos", icon: Package, label: "Produtos" },
];

const sidebarNavItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/vendas", icon: ShoppingCart, label: "Vendas" },
  { to: "/diarias", icon: Users, label: "Diárias" },
  { to: "/produtos", icon: Package, label: "Produtos" },
  { to: "/auditoria", icon: ClipboardList, label: "Auditoria" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const user = authStore.useStore((state) => state.user);
  const theme = themeStore.useStore((state) => state.theme);

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
      <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground sticky top-0 border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              <span className="text-sidebar-primary">JHP</span> Produtos
            </h1>
            <p className="text-xs text-sidebar-foreground/60 mt-1">
              Gestão de Vendas
            </p>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="w-9 h-9 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 cursor-pointer"
            >
              {initials}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-200 rounded-box z-50 w-48 p-2 shadow-lg"
            >
              <li className="menu-title">
                <span className="truncate">{user?.name}</span>
                <span className="text-xs opacity-60 truncate">
                  {user?.email}
                </span>
              </li>
              <li>
                <button
                  onClick={() => authStore.action.logout()}
                  className="text-error"
                >
                  <LogOut size={14} /> Sair
                </button>
              </li>
            </ul>
          </div>
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

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 mb-2">
            <Palette size={14} className="text-sidebar-foreground/60" />
            <label className="text-xs text-sidebar-foreground/60 uppercase tracking-wider font-semibold">
              Tema
            </label>
          </div>
          <select
            className="select select-sm w-full bg-sidebar-accent text-sidebar-foreground border-sidebar-border"
            value={theme}
            onChange={(e) =>
              themeStore.action.setTheme(e.target.value as Theme)
            }
          >
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar text-sidebar-foreground sticky top-0 z-40">
        <h1 className="text-lg font-extrabold">
          <span className="text-sidebar-primary">JHP</span> Produtos
        </h1>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="w-8 h-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            {initials}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-200 rounded-box z-50 w-52 p-2 shadow-lg"
          >
            <li className="menu-title">
              <span className="truncate">{user?.name}</span>
              <span className="text-xs opacity-60 truncate">
                {user?.email}
              </span>
            </li>
            <li>
              <Link to="/auditoria">
                <ClipboardList size={14} /> Auditoria
              </Link>
            </li>
            <li>
              <div className="flex items-center gap-2">
                <Palette size={14} />
                <select
                  className="select select-xs flex-1 bg-transparent border-0 p-0"
                  value={theme}
                  onChange={(e) =>
                    themeStore.action.setTheme(e.target.value as Theme)
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  {THEMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </li>
            <li>
              <button
                onClick={() => authStore.action.logout()}
                className="text-error"
              >
                <LogOut size={14} /> Sair
              </button>
            </li>
          </ul>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">{children}</main>

      {/* Mobile Bottom Nav */}
      <aside className="md:hidden sticky bottom-0 z-40">
        <nav className="flex flex-1 items-center justify-around gap-5 py-1 px-4 bg-sidebar">
          {mainNavItems.map((item, idx) => {
            if (!item.to) {
              return (
                <div key={`placeholder-${idx}`} className="px-4 py-2.5">
                  <item.icon
                    size={20}
                    className="text-sidebar-foreground/20"
                  />
                </div>
              );
            }

            const active = location.pathname === item.to;

            if (item.to === "/vendas") {
              return (
                <Fragment key={item.to}>
                  <item.icon size={20} className="invisible" />
                  <Link
                    to={item.to}
                    className={cn(
                      "absolute bottom-2 flex items-center justify-center p-4 rounded-full text-sm font-medium transition-all border-2 border-sidebar-foreground",
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
