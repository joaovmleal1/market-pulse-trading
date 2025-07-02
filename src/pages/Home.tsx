import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import CryptoLogo from '@/components/CryptoLogos';
import { TrendingUp, Shield, BarChart3, Zap, Users, Globe, Loader2, Cpu } from 'lucide-react';
import CountUp from 'react-countup';

const features = [
    {
        icon: TrendingUp,
        title: 'Análise em Tempo Real',
        description: 'Acompanhe o mercado com dados e gráficos ao vivo para decisões precisas.'
    },
    {
        icon: Shield,
        title: 'Segurança Avançada',
        description: 'Criptografia de ponta e autenticação 2FA para máxima proteção.'
    },
    {
        icon: BarChart3,
        title: 'Dashboard Inteligente',
        description: 'Visualize seus ganhos, perdas e histórico com facilidade.'
    },
    {
        icon: Zap,
        title: 'Execução Instantânea',
        description: 'Entradas e saídas de operações com máxima agilidade.'
    },
    {
        icon: Users,
        title: 'Networking de Traders',
        description: 'Troque experiências com outros usuários da comunidade.'
    },
    {
        icon: Globe,
        title: 'Acesso Ilimitado',
        description: 'Plataforma sempre online — use em qualquer lugar do mundo.'
    }
];

const cryptos = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL'];

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0D1117] text-white relative overflow-hidden">
            {/* Animação de fundo com brilho semelhante à logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#111B24] to-[#0D1117] animate-pulse-slow opacity-10 z-0" />

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#161B22]/70 border-b border-[#00E0FF]/40 backdrop-blur z-10 relative"
            >
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <MultiTradingLogo size="md" />
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" asChild className="border-[#00E0FF] text-[#00E0FF] hover:bg-[#00E0FF]/10">
                                <Link to="/login">Entrar</Link>
                            </Button>
                            <Button asChild className="bg-[#00E0FF] hover:bg-[#33EDFF] text-white">
                                <Link to="/register">Cadastrar</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.header>



            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="py-24 px-6 relative z-10"
            >
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h1 layout className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-md">
                        O Futuro do <span className="text-[#00E0FF]">Trading Cripto</span>
                    </motion.h1>
                    <motion.p layout className="text-xl text-[#9CA3AF] mb-10 max-w-3xl mx-auto">
                        Plataforma de trading com IA e análise em tempo real para decisões inteligentes no mercado cripto.
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.2 } }
                        }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <Button
                                size="lg"
                                onClick={() => navigate('/register')}
                                className="bg-[#00E0FF] hover:bg-[#33EDFF] text-lg px-8 py-3 text-white"
                            >
                                Começar Agora
                            </Button>
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/login')}
                                className="border-[#00E0FF] text-[#00E0FF] hover:bg-[#00E0FF]/10 text-lg px-8 py-3"
                            >
                                Já tenho conta
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Spinner decorativo */}
                    <motion.div
                        className="flex justify-center mt-12"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    >
                        <Loader2 className="w-12 h-12 text-[#00E0FF] opacity-20" />
                    </motion.div>

                    {/* Crypto Logos */}
                    <motion.div
                        className="flex justify-center items-center space-x-6 mt-12 flex-wrap gap-4"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.2 } }
                        }}
                    >
                        {cryptos.map((crypto) => (
                            <motion.div
                                key={crypto}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                whileHover={{ rotate: 10 }}
                            >
                                <CryptoLogo symbol={crypto} size="lg" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-20 px-6 bg-[#161B22]"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Por que escolher o Multi Trading?
                        </h2>
                        <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto">
                            Desenvolvido para traders que buscam precisão, velocidade e segurança em suas operações.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <Card className="bg-[#0D1117] border border-[#00E0FF]/10 hover:border-[#00E0FF]/30 hover:shadow-xl transition duration-300 hover:scale-[1.03]">
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="p-3 bg-[#00E0FF] rounded-lg">
                                                <feature.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                                        </div>
                                        <p className="text-[#9CA3AF]">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>



            {/* Statistics Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="py-20 px-6"
            >
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {[
                            { value: 10000, suffix: '+', label: 'Traders Ativos', color: 'text-[#00E0FF]' },
                            { value: 2.5, suffix: 'B', label: 'Volume Negociado', color: 'text-[#33EDFF]' },
                            { value: 99.9, suffix: '%', label: 'Uptime', color: 'text-[#9CA3AF]' },
                        ].map(({ value, suffix, label, color }, index) => (
                            <motion.div key={index} layout>
                                <div className={`text-4xl font-bold ${color} mb-2`}>
                                    <CountUp end={value} duration={2.5} suffix={suffix} />
                                </div>
                                <div className="text-[#9CA3AF]">{label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="py-20 px-6 bg-gradient-to-r from-[#00E0FF] to-[#33EDFF]"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Pronto para começar a operar?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Junte-se a milhares de traders que já confiam no Multi Trading para suas operações.
                    </p>
                    <Button size="lg" asChild className="bg-white text-[#0D1117] hover:bg-gray-100 text-lg px-8 py-3">
                        <Link to="/register">Criar Conta Gratuita</Link>
                    </Button>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-[#0D1117] border-t border-[#00E0FF]/20 py-12 px-6"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <MultiTradingLogo size="sm" />
                        <div className="text-[#9CA3AF] mt-4 md:mt-0 text-sm">
                            © {new Date().getFullYear()} Multi Trading. Todos os direitos reservados.
                        </div>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
};

export default Home;
