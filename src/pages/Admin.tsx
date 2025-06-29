import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

interface User {
    id: number;
    complete_name: string;
    email: string;
    last_login: string | null;
    is_superuser: boolean;
    is_active: boolean;
    activated_at: string | null;
}

const Admin = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'users'>('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const { accessToken } = useSelector((state: any) => state.token);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch('https://api.multitradingob.com/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error('Erro ao buscar usuários:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = async (
        userId: number,
        action: 'activate' | 'deactivate',
        days?: number
    ) => {
        try {
            const url =
                action === 'activate'
                    ? `https://api.multitradingob.com/user/activate/${userId}/${days}`
                    : `https://api.multitradingob.com/user/deactivate/${userId}`;

            await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            fetchUsers();
        } catch (err) {
            console.error(`Erro ao ${action} usuário:`, err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((u) => {
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && u.is_active) ||
            (statusFilter === 'inactive' && !u.is_active);

        const matchesSearch = u.complete_name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <header className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span onClick={() => navigate('/dashboard')} className="cursor-pointer">
            <MultiTradingLogo size="md" />
          </span>
                    <div className="flex items-center space-x-4">
                        <span className="text-white">Olá, {user?.complete_name}</span>
                        <Button
                            onClick={() => navigate('/admin')}
                            className="bg-blue-700 hover:bg-blue-800 text-white"
                        >
                            Painel Admin
                        </Button>
                        <Button
                            variant="outline"
                            onClick={logout}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            Sair
                        </Button>
                    </div>
                </div>
            </header>

            <motion.main
                className="max-w-6xl mx-auto p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl font-bold text-white mb-4">Painel Administrativo</h1>

                <div className="flex space-x-4 mb-6 border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-2 px-4 text-sm font-medium ${
                            activeTab === 'users'
                                ? 'border-b-2 border-blue-500 text-white'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Usuários
                    </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setStatusFilter('all')}
                            variant={statusFilter === 'all' ? 'default' : 'outline'}
                            className="text-sm"
                        >
                            Todos
                        </Button>
                        <Button
                            onClick={() => setStatusFilter('active')}
                            variant={statusFilter === 'active' ? 'default' : 'outline'}
                            className="text-sm"
                        >
                            Ativos
                        </Button>
                        <Button
                            onClick={() => setStatusFilter('inactive')}
                            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                            className="text-sm"
                        >
                            Inativos
                        </Button>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 px-3 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Lista de Usuários</h2>

                    {loading ? (
                        <p className="text-gray-400">Carregando usuários...</p>
                    ) : filteredUsers.length === 0 ? (
                        <p className="text-gray-400">Nenhum usuário encontrado.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredUsers.map((u) => (
                                <Card
                                    key={u.id}
                                    className="bg-gray-800 border-gray-700 text-white p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                                >
                                    <CardContent className="w-full space-y-2 md:space-y-0 md:flex md:justify-between md:items-center">
                                        <div>
                                            <p className="font-bold text-lg">{u.complete_name}</p>
                                            <p className="text-sm text-gray-400">Id: {u.id}</p>
                                            <p className="text-sm text-gray-400">{u.email}</p>
                                            <p className="text-sm">
                                                Último login:{' '}
                                                <span className="text-gray-300">
                          {u.last_login ? new Date(u.last_login).toLocaleString() : 'Nunca'}
                        </span>
                                            </p>
                                            <p className="text-sm">
                                                Superuser: {u.is_superuser ? 'Sim' : 'Não'} | Ativo:{' '}
                                                {u.is_active ? 'Sim' : 'Não'}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Ativado em:{' '}
                                                {u.activated_at ? new Date(u.activated_at).toLocaleString() : 'Não ativado'}
                                            </p>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                                            <Button
                                                variant="default"
                                                onClick={() => handleUserAction(u.id, 'activate', 1)}
                                                disabled={u.is_active}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                Ativar 1d
                                            </Button>
                                            <Button
                                                variant="default"
                                                onClick={() => handleUserAction(u.id, 'activate', 7)}
                                                disabled={u.is_active}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                Ativar 7d
                                            </Button>
                                            <Button
                                                variant="default"
                                                onClick={() => handleUserAction(u.id, 'activate', 30)}
                                                disabled={u.is_active}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                Ativar 30d
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleUserAction(u.id, 'deactivate')}
                                                disabled={!u.is_active}
                                            >
                                                Desativar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </motion.main>
        </div>
    );
};

export default Admin;
