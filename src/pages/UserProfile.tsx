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
                <h2 className="text-3xl font-bold mb-6">Editar Perfil</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Nome completo</label>
                        <Input
                            name="complete_name"
                            value={form.complete_name}
                            onChange={handleChange}
                            className="bg-[#2C2F33] text-white border border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <Input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="bg-[#2C2F33] text-white border border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Telefone</label>
                        <Input
                            name="phone_number"
                            value={form.phone_number}
                            onChange={handleChange}
                            className="bg-[#2C2F33] text-white border border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Nova senha</label>
                        <Input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Deixe em branco se não quiser alterar"
                            className="bg-[#2C2F33] text-white border border-gray-600"
                        />
                    </div>

                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar alterações'}
                    </Button>

                    {success && <p className="text-sm mt-2 text-cyan-400">{success}</p>}
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
