import {Provider} from "react-redux";
import store from "./store"; // seu store Redux
import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route, Navigate, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import {Broker} from "./pages/Broker";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import {AuthProvider, useAuth} from "./contexts/AuthContext";
import Admin from "./pages/Admin";
import Signature from "./pages/Signature";
import DashHistory from "./pages/DashHistory";
import UserProfile from "@/pages/UserProfile.tsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({children}: { children: React.ReactNode }) => {
    const {isAuthenticated, isLoading, user} = useAuth();
    const location = useLocation();

    // Se não estiver autenticado, redireciona para login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{from: location}}/>;
    }

    // Se não for superuser, e estiver inativo ou sem data de ativação, redireciona
    if (
        user &&
        !user.is_superuser &&
        (!user.is_active || !user.activated_at) && // ← aqui validamos os dois critérios
        location.pathname !== '/signature'
    ) {
        return <Navigate to="/signature" replace/>;
    }

    // Tudo certo, renderiza a rota protegida
    return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard/>
                </ProtectedRoute>
            }/>
            <Route path="/broker/:id" element={
                <ProtectedRoute>
                    <Broker/>
                </ProtectedRoute>
            }/>
            <Route path="/settings/:id" element={
                <ProtectedRoute>
                    <SettingsPage/>
                </ProtectedRoute>
            }/>
            <Route path="/admin" element={
                <ProtectedRoute>
                    <Admin/>
                </ProtectedRoute>
            }/>
            <Route path="/signature" element={
                <ProtectedRoute>
                    <Signature/>
                </ProtectedRoute>
            }/>
            <Route path="/history" element={
                <ProtectedRoute>
                    <DashHistory/>
                </ProtectedRoute>
            }/>
            <Route path="/profile" element={
                <ProtectedRoute>
                    <UserProfile/>
                </ProtectedRoute>
            }/>

            {/* Rota de fallback para páginas não encontradas */}
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
};

const App = () => (
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster/>
                <Sonner/>
                <BrowserRouter> {/* ← mover BrowserRouter pra fora do AuthProvider */}
                    <AuthProvider>
                        <AppRoutes/>
                    </AuthProvider>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    </Provider>
);

export default App;
