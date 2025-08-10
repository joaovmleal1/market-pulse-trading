import { Provider } from "react-redux";
import store from "./store";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Broker from "./pages/Broker";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Admin from "./pages/Admin";
import Signature from "./pages/Signature";
import DashHistory from "./pages/DashHistory";
import UserProfile from "@/pages/UserProfile";
import BrokerHistory from "@/pages/BrokerHistory";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="text-white p-6">
                Carregando sessão...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (
        user &&
        !user.is_superuser &&
        (!user.is_active || !user.activated_at) &&
        location.pathname !== "/signature"
    ) {
        return <Navigate to="/signature" replace />;
    }

    return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/broker/:id"
                element={
                    <ProtectedRoute>
                        <Broker />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings/:id"
                element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/signature"
                element={
                    <ProtectedRoute>
                        <Signature />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/history"
                element={
                    <ProtectedRoute>
                        <DashHistory />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/broker/:id/history"
                element={
                    <ProtectedRoute>
                        <BrokerHistory />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

const App = () => (
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    </Provider>
);

export default App;
