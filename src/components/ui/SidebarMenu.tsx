import MultiTradingLogo from '@/components/MultiTradingLogo';
import { User, LogOut, Clock, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SidebarMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="fixed top-4 left-4 w-56 bg-[#2C2F33] p-6 rounded-xl shadow-lg border border-[#24C3B5]/30 z-50">
            <div className="mb-8">
                <MultiTradingLogo size="sm" />
            </div>
            <nav className="space-y-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className={`flex items-center gap-3 ${
                        isActive('/dashboard') ? 'text-[#24C3B5]' : 'text-white'
                    } hover:text-[#24C3B5]`}
                >
                    <BarChart3 className="w-5 h-5" /> Minhas Corretoras
                </button>

                <button
                    onClick={() => navigate('/history')}
                    className={`flex items-center gap-3 ${
                        isActive('/history') ? 'text-[#24C3B5]' : 'text-white'
                    } hover:text-[#24C3B5]`}
                >
                    <Clock className="w-5 h-5" /> Histórico
                </button>

                <button
                    onClick={() => navigate('/profile')}
                    className={`flex items-center gap-3 ${
                        isActive('/profile') ? 'text-[#24C3B5]' : 'text-white'
                    } hover:text-[#24C3B5]`}
                >
                    <User className="w-5 h-5" /> Perfil
                </button>

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

export default SidebarMenu;
