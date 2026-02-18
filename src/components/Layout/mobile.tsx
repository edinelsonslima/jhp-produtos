import { AppUser, authStore } from "@/hooks/useAuth";
import { Theme, themeStore } from "@/hooks/useTheme";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Palette,
  Search,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { Brand } from "./brand";

interface MobileProps {
  theme: Theme;
  user: AppUser | null;
}

const dockerItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/historico", icon: CalendarDays, label: "Histórico" },
  { to: "/vendas", icon: ShoppingCart, label: "Vendas" },
  { to: "/pagamentos", icon: Users, label: "Diárias" },
  { to: "/produtos", icon: Package, label: "Produtos" },
];

export function Mobile({
  children,
  user,
  theme,
}: PropsWithChildren<MobileProps>) {
  return (
    <>
      <nav className="daisy-navbar daisy-glass w-full flex justify-between sticky top-0 z-50">
        <Brand />

        <div className="flex items-center gap-2">
          <Link
            to="/buscar"
            className={Button.style({ modifier: "circle", appearance: "ghost" })}
          >
            <Search size={18} />
          </Link>

          <div className="daisy-dropdown daisy-dropdown-end">
            <div
            role="button"
            tabIndex={0}
            className={Button.style({ modifier: "circle", variant: "primary" })}
          >
            {user?.initials}
          </div>

          <ul
            tabIndex={-1}
            className="daisy-dropdown-content daisy-menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-xl"
          >
            <li className="daisy-menu-title">
              <span className="truncate">{user?.name}</span>
              <span className="text-xs opacity-60 truncate">{user?.email}</span>
            </li>

            <li>
              <Link to="/auditoria">
                <ClipboardList size={14} /> Auditoria
              </Link>
            </li>

            <li>
              <Modal>
                <Modal.Trigger
                  as="button"
                  type="button"
                  title="Selecionar o tema do sistema"
                >
                  <Palette size={14} />
                  Tema
                </Modal.Trigger>

                <Modal.Title className="flex items-center justify-between sticky daisy-glass -top-6 h-14 px-6 -mx-6 -mt-6 z-10">
                  <div className="flex items-center gap-3">
                    <Palette size={20} />
                    <h3 className="font-bold text-lg">Escolha o tema</h3>
                  </div>

                  <Modal.Actions className="mt-0">
                    {({ close }) => (
                      <X
                        size={18}
                        onClick={close}
                        className="daisy-btn daisy-btn-xs daisy-btn-ghost"
                      />
                    )}
                  </Modal.Actions>
                </Modal.Title>

                <Modal.Content as="ul" className="mt-4 w-full max-h-1/2">
                  {themeStore.action.list().map((t) => (
                    <li key={t}>
                      <input
                        type="radio"
                        aria-label={t}
                        defaultChecked={theme === t}
                        name="theme-dropdown"
                        onChange={() => themeStore.action.set(t)}
                        className={
                          "daisy-theme-controller daisy-btn daisy-btn-md daisy-btn-block daisy-btn-ghost w-full justify-start"
                        }
                      />
                    </li>
                  ))}
                </Modal.Content>
              </Modal>
            </li>

            <li className="border-t border-black/15 pt-1 mt-1">
              <Button
                size="sm"
                variant="error"
                appearance="link"
                className="justify-start"
                onClick={() => authStore.action.logout()}
              >
                <LogOut size={14} /> Sair
              </Button>
            </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="min-h-full p-4 pb-20 max-w-2xl mx-auto space-y-8">
        {children}
      </div>

      <div className="daisy-dock daisy-dock-md border-t border-base-content/10">
        {dockerItems.map((item) => (
          <NavLink
            to={item.to}
            key={item.label}
            className={({ isActive }) => (isActive ? "daisy-dock-active" : "")}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  className={isActive ? "text-primary" : ""}
                />
                <span className="daisy-dock-label">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </>
  );
}
