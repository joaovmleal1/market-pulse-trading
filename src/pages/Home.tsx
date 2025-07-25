import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart3, Shield, Zap, TrendingUp, Users, Smartphone, ArrowRight } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import TradingStats from '@/components/TradingStats';
import AnimatedCounter from '@/components/AnimatedCounter';
import NewsSection from '@/components/NewsSection';
import TradingViewChart from '@/components/TradingViewChart';
import MultiTradingLogo from '@/components/MultiTradingLogo';

const features = [
    { icon: BarChart3, title: 'Análise Avançada', description: 'Ferramentas profissionais de análise técnica com indicadores em tempo real para decisões inteligentes.' },
    { icon: Shield, title: 'Segurança Total', description: 'Criptografia de nível bancário e autenticação multi-fator para proteger seus investimentos.' },
    { icon: Zap, title: 'Execução Rápida', description: 'Orders executadas em milissegundos com conexão direta às principais exchanges globais.' },
    { icon: TrendingUp, title: 'Trading Automatizado', description: 'Bots inteligentes e estratégias automatizadas para maximizar seus lucros 24/7.' },
    { icon: Users, title: 'Comunidade Ativa', description: 'Conecte-se com traders experientes e aprenda com os melhores do mercado.' },
    { icon: Smartphone, title: 'App Mobile', description: 'Trade em qualquer lugar com nosso aplicativo otimizado para dispositivos móveis.' },
];

const stats = [
    { value: 50000, prefix: '+', suffix: '', label: 'Usuários Ativos' },
    { value: 2500000, prefix: 'R$ ', suffix: '+', label: 'Volume Negociado' },
    { value: 98, prefix: '', suffix: '%', label: 'Uptime da Plataforma' },
    { value: 150, prefix: '+', suffix: '', label: 'Países Atendidos' },
];

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen font-inter">
            <header className="relative z-50 px-4 sm:px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <MultiTradingLogo size="md" />
                    <nav className="hidden md:flex items-center space-x-6 sm:space-x-8">
                        <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">Recursos</a>
                        <a href="#stats" className="text-muted-foreground hover:text-primary transition-smooth">Estatísticas</a>
                        <a href="#contact" className="text-muted-foreground hover:text-primary transition-smooth">Contato</a>
                    </nav>
                    <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
                        <Button variant="default" size="sm" onClick={() => navigate('/register')}>Começar Agora</Button>
                    </div>
                </div>
            </header>

            <section className="relative gradient-hero min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6">
                <div className="absolute inset-0 bg-gradient-to-br from-background to-muted opacity-10" />
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <div className="slide-up">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                            Sua Porta de Entrada no
                            <span className="gradient-primary bg-clip-text text-transparent"> Mercado Financeiro</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                            Negocie criptomoedas e dólar com tecnologia de ponta, análises avançadas e segurança total. Comece sua jornada no trading hoje mesmo.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <Button variant="default" size="lg" className="group w-full sm:w-auto" onClick={() => navigate('/register')}>
                                Começar a Negociar
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
                                Assistir Demo
                            </Button>
                        </div>
                    </div>
                    <div className="fade-in-scale">
                        <TradingStats />
                    </div>
                </div>
            </section>

            <section id="stats" className="py-20 px-4 sm:px-6 bg-card/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Números que Impressionam</h2>
                        <p className="text-lg sm:text-xl text-muted-foreground">Mais de 50.000 traders confiam na nossa plataforma diariamente</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                        {stats.map((stat, index) => (
                            <div key={stat.label} className="text-center fade-in-scale" style={{ animationDelay: `${index * 0.2}s` }}>
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
                                    <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={2000 + index * 300} />
                                </div>
                                <p className="text-muted-foreground font-medium text-sm sm:text-base">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Tecnologia de Ponta para Seus Investimentos</h2>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Desenvolvemos as ferramentas mais avançadas para que você possa negociar com confiança e precisão no mercado financeiro global.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={feature.title} className="slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <FeatureCard {...feature} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <TradingViewChart />
            <NewsSection />

            <section className="py-20 px-4 sm:px-6 gradient-hero">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Pronto para Começar a Negociar?</h2>
                    <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                        Junte-se a milhares de traders que já transformaram suas vidas com nossa plataforma.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button variant="default" size="lg" className="group w-full sm:w-auto pulse-glow" onClick={() => navigate('/register')}>
                            Criar Conta Gratuita
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
                            Baixar App
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-6">
                        Sem taxas de cadastro • Suporte 24/7 • Comece com apenas R$ 50
                    </p>
                </div>
            </section>

            <footer id="contact" className="py-12 px-4 sm:px-6 border-t border-border/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <MultiTradingLogo size="sm" />
                        <div className="flex flex-wrap justify-center md:justify-start items-center space-x-4 text-sm text-muted-foreground">
                            <span>© {new Date().getFullYear()} Multi Trading OB</span>
                            <a href="#" className="hover:text-primary transition-smooth">Termos</a>
                            <a href="#" className="hover:text-primary transition-smooth">Privacidade</a>
                            <a href="#" className="hover:text-primary transition-smooth">Suporte</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
