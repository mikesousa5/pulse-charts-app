import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Data from "./pages/Data";
import Auth from "./pages/Auth";
import Workouts from "./pages/Workouts";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Componente de debug para verificar se o app está carregando
const DebugWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    console.log("App carregado com sucesso!");
  }, []);

  return <>{children}</>;
};

const App = () => {
  console.log("App.tsx está sendo executado");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DebugWrapper>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/data" element={<ProtectedRoute><Data /></ProtectedRoute>} />
              <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DebugWrapper>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
