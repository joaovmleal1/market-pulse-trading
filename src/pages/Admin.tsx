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
        <div className="min-h-screen bg-[#1E1E1E] text-white">
            <SidebarMenu />
            <main className="pl-72 max-w-6xl mx-auto p-6">
                <h1 className="text-4xl font-bold mb-4">Painel Administrativo</h1>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            onClick={() => setStatusFilter('all')}
                            className={`text-sm ${
                                statusFilter === 'all'
                                    ? 'bg-[#24C3B5] text-black'
                                    : 'bg-[#2C2F33] text-white border border-[#24C3B5]/30 hover:bg-[#24C3B5]/20'
                            }`}
                        >
                            Todos
                        </Button>
                        <Button
                            onClick={() => setStatusFilter('active')}
                            className={`text-sm ${
                                statusFilter === 'active'
                                    ? 'bg-[#24C3B5] text-black'
                                    : 'bg-[#2C2F33] text-white border border-[#24C3B5]/30 hover:bg-[#24C3B5]/20'
                            }`}
                        >
                            Ativos
                        </Button>
                        <Button
                            onClick={() => setStatusFilter('inactive')}
                            className={`text-sm ${
                                statusFilter === 'inactive'
                                    ? 'bg-[#24C3B5] text-black'
                                    : 'bg-[#2C2F33] text-white border border-[#24C3B5]/30 hover:bg-[#24C3B5]/20'
                            }`}
                        >
                            Inativos
                        </Button>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 px-3 py-2 rounded-md bg-[#2C2F33] text-white placeholder-gray-400 border border-[#24C3B5]/20 focus:outline-none focus:ring focus:border-[#24C3B5]"
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
                                    className="bg-[#2C2F33] border border-[#24C3B5]/20 text-white p-4"
                                >
                                    <CardContent className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                        <div>
                                            <p className="font-bold text-lg text-white">{u.complete_name}</p>
                                            <p className="text-sm text-gray-400">Id: {u.id}</p>
                                            <p className="text-sm text-gray-400">{u.email}</p>
                                            <p className="text-sm">
                                                Último login:{' '}
                                                <span className="text-gray-300">
                          {u.last_login ? new Date(u.last_login).toLocaleString() : 'Nunca'}
                        </span>
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Superuser: {u.is_superuser ? 'Sim' : 'Não'} | Ativo: {u.is_active ? 'Sim' : 'Não'}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Ativado em:{' '}
                                                {u.activated_at ? new Date(u.activated_at).toLocaleString() : 'Não ativado'}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
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
