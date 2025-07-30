// src/components/ui/BrokerSidebarMenu.tsx
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import { BarChart3, Settings, Clock, LogOut, LayoutDashboard, Shield, Menu, Send } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BrokerSidebarMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { id: brokerId } = useParams();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const menuItems = (
        <nav className="space-y-6">
            <div>
                <p className="text-gray-500 uppercase text-xs font-semibold mb-2">Corretora</p>
                <div className="space-y-2">
                    <button
                        onClick={() => navigate(`/broker/${brokerId}`)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-200 ${
                            isActive(`/broker/${brokerId}`) ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-200'
                        } hover:text-cyan-300`}
                    >
                        <BarChart3 className="w-5 h-5" /> Resumo
                    </button>
                    <button
                        onClick={() => navigate(`/broker/${brokerId}/history`)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-200 ${
                            isActive(`/broker/${brokerId}/history`) ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-200'
                        } hover:text-cyan-300`}
                    >
                        <Clock className="w-5 h-5" /> Histórico
                    </button>
                    <button
                        onClick={() => navigate(`/settings/${brokerId}`)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-200 ${
                            isActive(`/settings/${brokerId}`) ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-200'
                        } hover:text-cyan-300`}
                    >
                        <Settings className="w-5 h-5" /> Configurações
                    </button>
                </div>
            </div>

            <div>
                <p className="text-gray-500 uppercase text-xs font-semibold mb-2">Geral</p>
                <div className="space-y-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-200 ${
                            isActive('/dashboard') ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-200'
                        } hover:text-cyan-300`}
                    >
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </button>

                    {/* Link externo para o grupo do Telegram */}
                    <a
                        href="https://t.me/+b4uPhME4zSw1MWFh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-gray-200 hover:text-cyan-300 transition-all duration-200"
                    >
                        <Send className="w-5 h-5" /> Canal Telegram
                    </a>

                    {user?.is_superuser && (
                        <button
                            onClick={() => navigate('/admin')}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-200 ${
                                isActive('/admin') ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-200'
                            } hover:text-cyan-300`}
                        >
                            <Shield className="w-5 h-5" /> Admin
                        </button>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 text-gray-400 hover:text-red-500 px-3 py-2 w-full"
                >
                    <LogOut className="w-5 h-5" /> Sair
                </button>
            </div>
        </nav>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1E293B] text-cyan-400 rounded-lg shadow-md"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar desktop */}
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

export default BrokerSidebarMenu;
