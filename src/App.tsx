import { Toaster } from "@/components/ui/toast";
import { authStore } from "@/hooks/useAuth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import AuditLog from "./pages/AuditLog";
import EditSale from "./pages/EditSale";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Payments from "./pages/Payments";
import Products from "./pages/Products";
import Sales from "./pages/Sales";

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
        <Route path="/auditoria" element={<AuditLog />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <AuthGate />
    </BrowserRouter>
  </>
);

export default App;
