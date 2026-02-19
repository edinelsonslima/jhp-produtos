import { Toaster } from "@/components/_ui/toast";
import { authStore } from "@/hooks/useAuth";
import { domMax, LazyMotion } from "framer-motion";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/_layout";
import Audit from "./pages/Audit";
import EditSale from "./pages/EditSale";
import History from "./pages/History";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Payments from "./pages/Payments";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Search from "./pages/Search";

function AuthGate() {
  const user = authStore.useStore((state) => state.user);

  if (!user) {
    return <Login />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/vendas" element={<Sales />} />
        <Route path="/vendas/:id/editar" element={<EditSale />} />
        <Route path="/pagamentos" element={<Payments />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/auditoria" element={<Audit />} />
        <Route path="/historico" element={<History />} />
        <Route path="/buscar" element={<Search />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <LazyMotion features={domMax}>
    <Toaster />
    <BrowserRouter>
      <AuthGate />
    </BrowserRouter>
  </LazyMotion>
);

export default App;
