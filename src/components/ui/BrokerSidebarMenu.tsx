// src/components/ui/BrokerSidebarMenu.tsx
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import { BarChart3, Settings, Clock, LogOut, LayoutDashboard, Shield } from 'lucide-react';

const BrokerSidebarMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { id: brokerId } = useParams(); // pega o :id da rota atual

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="fixed top-4 left-4 w-56 bg-[#2C2F33] p-6 rounded-xl shadow-lg border border-[#24C3B5]/30 z-50">
            <div className="mb-8">
                <MultiTradingLogo size="sm" />
            </div>
            <nav className="space-y-4">

                <button
                    onClick={() => navigate(`/broker/${brokerId}`)}
                    className={`flex items-center gap-3 ${
                        isActive(`/broker/${brokerId}`) ? 'text-[#24C3B5]' : 'text-white'
                    } hover:text-[#24C3B5]`}
                >
                    <BarChart3 className="w-5 h-5" /> Resumo
                </button>

                <button
                    onClick={() => navigate(`/broker/${brokerId}/history`)}
                    className={`flex items-center gap-3 ${
                        isActive(`/broker/${brokerId}/history`) ? 'text-[#24C3B5]' : 'text-white'
                    } hover:text-[#24C3B5]`}
                >
                    <Clock className="w-5 h-5" /> Histórico
                </button>

                <button
                    onClick={() => navigate(`/broker/${brokerId}/settings`)}
                    className={`flex items-center gap-3 ${
                        isActive(`/broker/${brokerId}/settings`) ? 'text-[#24C3B5]' : 'text-white'
                    } hover:text-[#24C3B5]`}
                >
                    <Settings className="w-5 h-5" /> Configurações
                </button>

                <button
                    onClick={() => navigate('/dashboard')}
                    className={`flex items-center gap-3 ${
                        isActive('/dashboard') ? 'text-[#24C3B5]' : 'text-white'
                    } hover:text-[#24C3B5]`}
                >
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                </button>

                {user?.is_superuser && (
                    <button
                        onClick={() => navigate('/admin')}
                        className={`flex items-center gap-3 ${
                            isActive('/admin') ? 'text-[#24C3B5]' : 'text-white'
                        } hover:text-[#24C3B5]`}
                    >
                        <Shield className="w-5 h-5" /> Admin
                    </button>
                )}

                <button
                    onClick={logout}
                    className="flex items-center gap-3 text-gray-400 hover:text-red-400"
                >
                    <LogOut className="w-5 h-5" /> Sair
                </button>
            </nav>
        </aside>
    );
};

export default BrokerSidebarMenu;