import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {Eye, EyeOff} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {useAuth} from '@/contexts/AuthContext';
import {useToast} from '@/hooks/use-toast';
import MultiTradingLogo from '@/components/MultiTradingLogo';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const {register, isAuthenticated, isLoading} = useAuth();
    const {toast} = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: 'Erro no cadastro',
                description: 'As senhas não coincidem',
                variant: 'destructive',
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: 'Erro no cadastro',
                description: 'A senha deve ter pelo menos 6 caracteres',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            const result = await register(name, email, password);
            if (result.success) {
                toast({
                    title: 'Conta criada com sucesso!',
                    description: 'Bem-vindo ao Multi Trading',
                });
                navigate('/dashboard');
            } else {
                toast({
                    title: 'Erro no cadastro',
                    description: result.message || 'Este email já está em uso',
                    variant: 'destructive',
                });
            }
        } catch {
            toast({
                title: 'Erro no cadastro',
                description: 'Tente novamente mais tarde',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <motion.div
                    className="w-12 h-12 border-4 border-t-cyan-400 border-cyan-800 rounded-full animate-spin"
                    initial={{scale: 0.5}}
                    animate={{scale: 1}}
                    transition={{duration: 0.3}}
                />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111827] to-[#0A0A0A] flex items-center justify-center px-4 py-6">
            <motion.div
                initial={{opacity: 0, y: 40, scale: 0.95}}
                animate={{opacity: 1, y: 0, scale: 1}}
                transition={{duration: 0.6, ease: 'easeOut'}}
                className="w-full max-w-md sm:max-w-lg lg:max-w-xl"
            >
                <Card className="bg-[#1F2937]/80 backdrop-blur border border-cyan-700/30 shadow-2xl rounded-xl">
                    <CardHeader className="text-center">
                        <div className="flex justify-start mb-2">
                            <motion.button
                                whileHover={{scale: 1.05}}
                                onClick={() => navigate('/')}
                                className="text-cyan-300 hover:text-white text-sm flex items-center gap-1"
                            >
                                ← Voltar ao Início
                            </motion.button>
                        </div>
                        <div className="flex justify-center mb-4">
                            <MultiTradingLogo size="lg" showText={false}/>
                        </div>
                        <motion.h2
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2}}
                            className="text-2xl text-white font-bold"
                        >
                            Criar Conta
                        </motion.h2>
                        <CardDescription className="text-cyan-100">
                            Junte-se ao Multi Trading
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-white">Nome</Label>
                                <motion.input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Seu nome completo"
                                    required
                                    className="w-full rounded-lg px-4 py-2 bg-[#111827] border border-cyan-700/20 text-white placeholder-cyan-400 outline-none focus:ring-2 focus:ring-cyan-500"
                                    whileFocus={{scale: 1.01}}
                                    transition={{type: 'spring', stiffness: 300}}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">Email</Label>
                                <motion.input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Seu email"
                                    required
                                    className="w-full rounded-lg px-4 py-2 bg-[#111827] border border-cyan-700/20 text-white placeholder-cyan-400 outline-none focus:ring-2 focus:ring-cyan-500"
                                    whileFocus={{scale: 1.01}}
                                    transition={{type: 'spring', stiffness: 300}}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">Senha</Label>
                                <div className="relative">
                                    <motion.input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Digite sua senha"
                                        required
                                        className="w-full rounded-lg px-4 py-2 bg-[#111827] border border-cyan-700/20 text-white placeholder-cyan-400 outline-none focus:ring-2 focus:ring-cyan-500"
                                        whileFocus={{scale: 1.01}}
                                        transition={{type: 'spring', stiffness: 300}}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-white"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
                                <div className="relative">
                                    <motion.input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirme sua senha"
                                        required
                                        className="w-full rounded-lg px-4 py-2 bg-[#111827] border border-cyan-700/20 text-white placeholder-cyan-400 outline-none focus:ring-2 focus:ring-cyan-500"
                                        whileFocus={{scale: 1.01}}
                                        transition={{type: 'spring', stiffness: 300}}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-white"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full mt-2 rounded-lg px-4 py-2 font-semibold text-white bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-600 shadow-lg"
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                                disabled={loading}
                            >
                                {loading ? (
                                    <motion.div
                                        className="flex items-center justify-center gap-2"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{duration: 0.3}}
                                    >
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 100 20v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                            ></path>
                                        </svg>
                                        Criando conta...
                                    </motion.div>
                                ) : (
                                    'Criar Conta'
                                )}
                            </motion.button>
                        </form>

                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.4}}
                            className="mt-6 text-center"
                        >
                            <p className="text-cyan-100">
                                Já tem uma conta?{' '}
                                <Link to="/login" className="text-cyan-400 hover:text-white font-medium">
                                    Entrar
                                </Link>
                            </p>
                        </motion.div>
                    </CardContent>

                </Card>

            </motion.div>
        </div>
    );
};

export default Register;
