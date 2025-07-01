import MultiTradingLogo from '@/components/MultiTradingLogo';
import { User, LogOut, Clock, BarChart3, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const SidebarMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="fixed top-4 left-4 w-56 bg-[#2C2F33] p-6 rounded-xl shadow-lg border border-[#24C3B5]/30 z-50">
            <div className="mb-8">
                <MultiTradingLogo size="sm" />
            </div>
            <nav className="space-y-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className={`flex items-center gap-3 px-2 py-1 rounded-md transition-all duration-300 ${
                        isActive('/dashboard') ? 'bg-[#24C3B5]/10 text-[#24C3B5]' : 'text-white'
                    } hover:text-[#24C3B5]`}
                >
                    <BarChart3 className="w-5 h-5" /> Minhas Corretoras
                </button>

                <button
                    onClick={() => navigate('/history')}
                    className={`flex items-center gap-3 px-2 py-1 rounded-md transition-all duration-300 ${
                        isActive('/history') ? 'bg-[#24C3B5]/10 text-[#24C3B5]' : 'text-white'
                    } hover:text-[#24C3B5]`}
                >
                    <Clock className="w-5 h-5" /> Histórico
                </button>

                <button
                    onClick={() => navigate('/profile')}
                    className={`flex items-center gap-3 px-2 py-1 rounded-md transition-all duration-300 ${
                        isActive('/profile') ? 'bg-[#24C3B5]/10 text-[#24C3B5]' : 'text-white'
                    } hover:text-[#24C3B5]`}
                >
                    <User className="w-5 h-5" /> Perfil
                </button>

                {user?.is_superuser && (
                    <button
                        onClick={() => navigate('/admin')}
                        className={`flex items-center gap-3 px-2 py-1 rounded-md transition-all duration-300 ${
                            isActive('/admin') ? 'bg-[#24C3B5]/10 text-[#24C3B5]' : 'text-white'
                        } hover:text-[#24C3B5]`}
                    >
                        <Shield className="w-5 h-5" /> Administração
                    </button>
                )}

                <button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center gap-3 text-gray-400 hover:text-red-400"
                >
                    <LogOut className="w-5 h-5" /> Sair
                </button>

                {showConfirm && (
                    <div className="mt-4 bg-[#1E1E1E] p-3 border border-red-500 rounded-md text-center">
                        <p className="text-sm text-red-400 mb-2">Deseja realmente sair?</p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={logout}
                                className="text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                            >
                                Sim
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="text-sm text-gray-300 border border-gray-600 px-3 py-1 rounded hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default SidebarMenu;