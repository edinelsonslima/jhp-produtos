import { Toaster as Sonner } from "@/components/ui/sonner";
import { authStore } from "@/hooks/useAuth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import AuditLog from "./pages/AuditLog";
import DailyPayments from "./pages/DailyPayments";
import EditSale from "./pages/EditSale";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
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
        <Route path="/diarias" element={<DailyPayments />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/auditoria" element={<AuditLog />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <>
    <Sonner />
    <BrowserRouter>
      <AuthGate />
    </BrowserRouter>
  </>
);

export default App;
