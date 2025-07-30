import MultiTradingLogo from '@/components/MultiTradingLogo';
import { User, LogOut, Clock, BarChart3, Shield, HelpCircle, Menu, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const menuItems = (
        <nav className="space-y-6">
            {/* Seção principal */}
            <div>
                <p className="text-gray-500 uppercase text-xs font-semibold mb-2">Geral</p>
                <div className="space-y-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-200 ${
                            isActive('/dashboard') ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-200'
                        } hover:text-cyan-300`}
                    >
                        <BarChart3 className="w-5 h-5" /> Minhas Corretoras
                    </button>
                    <button
                        onClick={() => navigate('/history')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-200 ${
                            isActive('/history') ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-200'
                        } hover:text-cyan-300`}
                    >
                        <Clock className="w-5 h-5" /> Histórico
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-200 ${
                            isActive('/profile') ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-200'
                        } hover:text-cyan-300`}
                    >
                        <User className="w-5 h-5" /> Perfil
                    </button>
                </div>
            </div>

            {/* Seção de Suporte */}
            <div>
                <p className="text-gray-500 uppercase text-xs font-semibold mb-2">Suporte</p>
                <div className="space-y-2">
                    <button
                        disabled
                        className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-gray-400 cursor-not-allowed"
                    >
                        <HelpCircle className="w-5 h-5" /> Central de Ajuda
                    </button>
                    <a
                        href="https://t.me/+b4uPhME4zSw1MWFh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-gray-200 hover:text-cyan-300 transition-all duration-200"
                    >
                        <Send className="w-5 h-5" /> Canal no Telegram
                    </a>
                </div>
            </div>

            {/* Seção Admin */}
            {user?.is_superuser && (
                <div>
                    <p className="text-gray-500 uppercase text-xs font-semibold mb-2">Admin</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate('/admin')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-200 ${
                                isActive('/admin') ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-200'
                            } hover:text-cyan-300`}
                        >
                            <Shield className="w-5 h-5" /> Administração
                        </button>
                    </div>
                </div>
            )}

            {/* Logout */}
            <div className="pt-4 border-t border-gray-700">
                <button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center gap-3 text-gray-400 hover:text-red-500 px-3 py-2 w-full"
                >
                    <LogOut className="w-5 h-5" /> Sair
                </button>

                {showConfirm && (
                    <div className="mt-4 bg-[#1E1E1E] p-3 border border-red-500 rounded-lg text-center animate-fade-in">
                        <p className="text-sm text-red-400 mb-2">Deseja realmente sair?</p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={logout}
                                className="text-sm text-white bg-red-600 px-4 py-1.5 rounded hover:bg-red-700"
                            >
                                Sim
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="text-sm text-gray-300 border border-gray-600 px-4 py-1.5 rounded hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );

    return (
        <>
            {/* Botão flutuante para abrir menu no mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1E293B] text-cyan-400 rounded-lg shadow-md"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar para desktop */}
            <aside className="hidden lg:block fixed top-4 left-4 w-64 bg-[#111827] p-6 rounded-2xl shadow-xl border border-cyan-500/20 z-40 text-sm">
                <div className="mb-8 flex justify-center">
                    <MultiTradingLogo size="sm" />
                </div>
                {menuItems}
            </aside>

            {/* Sidebar mobile */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween' }}
                            className="fixed top-0 left-0 h-full w-64 bg-[#111827] p-6 rounded-r-2xl shadow-2xl border-r border-cyan-500/20 z-50 text-sm overflow-y-auto"
                        >
                            <div className="mb-8 flex justify-center">
                                <MultiTradingLogo size="sm" />
                            </div>
                            {menuItems}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default SidebarMenu;
