import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SidebarMenu from '@/components/ui/SidebarMenu';

const UserProfile = () => {
    const { accessToken } = useSelector((state: any) => state.token);

    const [form, setForm] = useState({
        complete_name: '',
        email: '',
        phone_number: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const fetchUser = async () => {
        try {
            const res = await fetch('https://api.multitradingob.com/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            setForm({
                complete_name: data.complete_name || '',
                email: data.email || '',
                phone_number: data.phone_number || '',
                password: '',
            });
        } catch (err) {
            console.error('Erro ao buscar usuário:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSuccess('');
        try {
            const res = await fetch('https://api.multitradingob.com/user/me', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Erro ao atualizar perfil');
            setSuccess('Perfil atualizado com sucesso!');
        } catch (err) {
            console.error(err);
            setSuccess('Erro ao atualizar perfil.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) fetchUser();
    }, [accessToken]);

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white">
            <SidebarMenu />
            <main className="pl-72 pr-8 py-10 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-white">Editar Perfil</h2>

                <div className="space-y-6 bg-[#2C2F33] p-8 rounded-xl shadow-lg border border-[#24C3B5]/20">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm text-gray-400">Nome completo</label>
                            <Input
                                name="complete_name"
                                value={form.complete_name}
                                onChange={handleChange}
                                className="bg-[#1E1E1E] border border-[#3B3B3B] focus:border-[#24C3B5] text-white rounded-md px-4 py-2 transition duration-200"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-gray-400">Email</label>
                            <Input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className="bg-[#1E1E1E] border border-[#3B3B3B] focus:border-[#24C3B5] text-white rounded-md px-4 py-2 transition duration-200"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-gray-400">Telefone</label>
                            <Input
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                className="bg-[#1E1E1E] border border-[#3B3B3B] focus:border-[#24C3B5] text-white rounded-md px-4 py-2 transition duration-200"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-gray-400">Nova senha</label>
                            <Input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Deixe em branco se não quiser alterar"
                                className="bg-[#1E1E1E] border border-[#3B3B3B] focus:border-[#24C3B5] text-white rounded-md px-4 py-2 transition duration-200"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[#24C3B5] hover:bg-[#1DA89D] text-white px-6 py-2 rounded-md transition duration-200"
                        >
                            {loading ? 'Salvando...' : 'Salvar alterações'}
                        </Button>

                        {success && (
                            <p className="mt-4 text-sm text-cyan-400">
                                {success}
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
