import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InputMask from 'react-input-mask';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SidebarMenu from '@/components/ui/SidebarMenu';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const UserProfile = () => {
    const { accessToken } = useSelector((state: any) => state.token);

    const [form, setForm] = useState({
        complete_name: '',
        email: '',
        phone_number: '',
        old_password: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);

    const fetchUser = async () => {
        try {
            const res = await fetch('https://api.multitradingob.com/user/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            setForm((prev) => ({
                ...prev,
                complete_name: data.complete_name || '',
                email: data.email || '',
                phone_number: data.phone_number || '',
            }));
        } catch (err) {
            console.error('Erro ao buscar usuário:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setSuccess('');

        if ((form.password && !form.old_password) || (!form.password && form.old_password)) {
            setSuccess('Preencha os dois campos de senha para alterar sua senha.');
            return;
        }

        setLoading(true);
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
            setForm((prev) => ({ ...prev, password: '', old_password: '' }));
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

                <motion.div
                    className="space-y-6 bg-[#2C2F33] p-6 rounded-xl border border-[#24C3B5]/20 shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Nome */}
                    <div>
                        <label className="text-sm text-gray-400">Nome completo</label>
                        <Input
                            name="complete_name"
                            value={form.complete_name}
                            onChange={handleChange}
                            className="transition-all duration-300 bg-[#1E1E1E] text-white border border-gray-600 mt-1 focus:ring-2 focus:ring-[#24C3B5] focus:outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <Input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="transition-all duration-300 bg-[#1E1E1E] text-white border border-gray-600 mt-1 focus:ring-2 focus:ring-[#24C3B5] focus:outline-none"
                        />
                    </div>

                    {/* Telefone */}
                    <div>
                        <label className="text-sm text-gray-400">Telefone</label>
                        <InputMask
                            mask="(99) 99999-9999"
                            value={form.phone_number}
                            onChange={(e) => setForm((prev) => ({ ...prev, phone_number: e.target.value }))}
                        >
                            {(inputProps: any) => (
                                <Input
                                    {...inputProps}
                                    name="phone_number"
                                    className="transition-all duration-300 bg-[#1E1E1E] text-white border border-gray-600 mt-1 focus:ring-2 focus:ring-[#24C3B5] focus:outline-none"
                                />
                            )}
                        </InputMask>
                    </div>

                    {/* Senhas */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Senha atual */}
                        <div className="relative">
                            <label className="text-sm text-gray-400">Senha atual</label>
                            <Input
                                name="old_password"
                                type={showOldPassword ? 'text' : 'password'}
                                value={form.old_password}
                                onChange={handleChange}
                                placeholder="Obrigatória para alterar senha"
                                className="transition-all duration-300 bg-[#1E1E1E] text-white border border-gray-600 mt-1 pr-10 focus:ring-2 focus:ring-[#24C3B5] focus:outline-none"
                            />
                            <button
                                type="button"
                                className="absolute top-9 right-3 text-gray-400 hover:text-white transition"
                                onClick={() => setShowOldPassword((prev) => !prev)}
                            >
                                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Nova senha */}
                        <div className="relative">
                            <label className="text-sm text-gray-400">Nova senha</label>
                            <Input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Deixe em branco para manter a senha"
                                className="transition-all duration-300 bg-[#1E1E1E] text-white border border-gray-600 mt-1 pr-10 focus:ring-2 focus:ring-[#24C3B5] focus:outline-none"
                            />
                            <button
                                type="button"
                                className="absolute top-9 right-3 text-gray-400 hover:text-white transition"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.03 }}>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="mt-2 bg-[#24C3B5] hover:bg-[#1ca79c] transition-all duration-300"
                        >
                            {loading ? 'Salvando...' : 'Salvar alterações'}
                        </Button>
                    </motion.div>

                    {success && <p className="text-sm mt-2 text-cyan-400">{success}</p>}
                </motion.div>
            </main>
        </div>
    );
};

export default UserProfile;
