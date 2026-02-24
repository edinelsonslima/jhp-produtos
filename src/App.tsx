import { Toaster } from "@/components/_ui/toast";
import { authStore } from "@/hooks/useAuth";
import { domMax, LazyMotion } from "framer-motion";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./components/_layout";
import { Authenticated } from "./components/auth/authenticated";
import { Unauthenticated } from "./components/auth/unauthenticated";

function AuthGate() {
  const user = authStore.useStore((state) => state.user);
  const logged = user !== null;

  return createRoutesFromElements(
    <Route errorElement={<div>Ops... Página não encontrada</div>}>
      <Route element={<Unauthenticated logged={logged} />}>
        <Route
          path="*"
          lazy={() => import("@/pages/Login")}
          hydrateFallbackElement={<div>carregando...</div>}
        />
      </Route>

      <Route element={<Authenticated logged={logged} />}>
        <Route element={<AppLayout />}>
          <Route
            index
            path="/"
            lazy={() => import("@/pages/Index")}
            hydrateFallbackElement={<div>carregando...</div>}
          />
          <Route
            path="/vendas"
            lazy={() => import("@/pages/Sales")}
            hydrateFallbackElement={<div>carregando...</div>}
          />
          <Route
            path="/vendas/:id/editar"
            lazy={() => import("@/pages/EditSale")}
            hydrateFallbackElement={<div>carregando...</div>}
          />
          <Route
            path="/pagamentos"
            lazy={() => import("@/pages/Payments")}
            hydrateFallbackElement={<div>carregando...</div>}
          />
          <Route
            path="/produtos"
            lazy={() => import("@/pages/Products")}
            hydrateFallbackElement={<div>carregando...</div>}
          />
          <Route
            path="/auditoria"
            lazy={() => import("@/pages/Audit")}
            hydrateFallbackElement={<div>carregando...</div>}
          />
          <Route
            path="/sobre"
            lazy={() => import("@/pages/About")}
            hydrateFallbackElement={<div>carregando...</div>}
          />
          <Route
            path="/historico"
            lazy={() => import("@/pages/History")}
            hydrateFallbackElement={<div>carregando...</div>}
          />
          <Route
            path="/buscar"
            lazy={() => import("@/pages/Search")}
            hydrateFallbackElement={<div>carregando...</div>}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>,
  );
}

const App = () => {
  const router = createBrowserRouter(AuthGate());

  return (
    <LazyMotion features={domMax}>
      <Toaster />
      <RouterProvider router={router} />
    </LazyMotion>
  );
};

export default App;
