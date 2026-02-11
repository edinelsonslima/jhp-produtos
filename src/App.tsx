import { Toaster as Sonner } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import AuditLog from "./pages/AuditLog";
import ChangeCalculator from "./pages/ChangeCalculator";
import DailyPayments from "./pages/DailyPayments";
import EditSale from "./pages/EditSale";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import Sales from "./pages/Sales";

function AuthGate() {
  const { user } = useAuth();

  if (!user) return <Login />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/vendas" element={<Sales />} />
        <Route path="/vendas/:id/editar" element={<EditSale />} />
        <Route path="/calculadora" element={<ChangeCalculator />} />
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
