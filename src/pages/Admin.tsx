import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import SidebarMenu from '@/components/ui/SidebarMenu';

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
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
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

    const activateUser = async (userId: number, days: number) => {
        try {
            await fetch(`https://api.multitradingob.com/user/activate/${userId}/${days}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            fetchUsers();
        } catch (err) {
            console.error(`Erro ao ativar usuário:`, err);
        }
    };

    const deactivateUser = async (userId: number) => {
        try {
            await fetch(`https://api.multitradingob.com/user/deactivate/${userId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            fetchUsers();
        } catch (err) {
            console.error(`Erro ao desativar usuário:`, err);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <SidebarMenu />
            <main className="pl-72 max-w-6xl mx-auto p-6">
                <h1 className="text-4xl font-bold mb-4">Painel Administrativo</h1>

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

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {loading ? (
                        <p className="text-gray-400">Carregando usuários...</p>
                    ) : filteredUsers.length === 0 ? (
                        <p className="text-gray-400">Nenhum usuário encontrado.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredUsers.map((u) => (
                                <Card
                                    key={u.id}
                                    className="bg-gray-800 border border-gray-700 p-4 flex flex-col md:flex-row md:items-center md:justify-between"
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
                                        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
                                            {!u.is_active && (
                                                <>
                                                    <Button
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => activateUser(u.id, 1)}
                                                    >
                                                        Ativar 1 dia
                                                    </Button>
                                                    <Button
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => activateUser(u.id, 7)}
                                                    >
                                                        Ativar 7 dias
                                                    </Button>
                                                    <Button
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => activateUser(u.id, 30)}
                                                    >
                                                        Ativar 30 dias
                                                    </Button>
                                                </>
                                            )}
                                            {u.is_active && (
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => deactivateUser(u.id)}
                                                >
                                                    Desativar
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default Admin;
