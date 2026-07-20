import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";

// Landing & Auth
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import NotFound from "./pages/NotFound";
import OAuthCallback from "./pages/OAuthCallback";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

// SMM Dashboard
import SMMDashboard from "./pages/smm/SMMDashboard";

// GD Dashboard
import GDDashboard from "./pages/gd/GDDashboard";

// Client Dashboard
import ClientDashboard from "./pages/client/ClientDashboard";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Entry */}
            <Route path="/" element={<Landing />} />

            {/* Admin Auth */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* User Auth */}
            <Route path="/user-login" element={<UserLogin />} />

            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* SMM Dashboard */}
            <Route path="/smm-dashboard" element={<SMMDashboard />} />

            {/* GD Dashboard */}
            <Route path="/gd-dashboard" element={<GDDashboard />} />

            {/* Client Dashboard */}
            <Route path="/client-dashboard" element={<ClientDashboard />} />

            {/* OAuth Callback */}
            <Route path="/auth/callback" element={<OAuthCallback />} />

            {/* Redirect /dashboard/accounts → SMM Dashboard channels view */}
            <Route path="/dashboard/accounts" element={<Navigate to="/smm-dashboard" state={{ view: "channels" }} replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
