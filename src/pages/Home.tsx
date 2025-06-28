import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import CryptoLogo from '@/components/CryptoLogos';
import { TrendingUp, Shield, BarChart3, Zap, Users, Globe } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Análise em Tempo Real',
    description: 'Acompanhe as variações do mercado cripto em tempo real com gráficos avançados e indicadores técnicos.'
  },
  {
    icon: Shield,
    title: 'Segurança Avançada',
    description: 'Seus dados e operações protegidos com criptografia de ponta e autenticação multifator.'
  },
  {
    icon: BarChart3,
    title: 'Dashboard Intuitivo',
    description: 'Interface clara e intuitiva para acompanhar seu portfólio e tomar decisões informadas.'
  },
  {
    icon: Zap,
    title: 'Execução Rápida',
    description: 'Execute suas operações com velocidade e precisão no mercado de criptomoedas.'
  },
  {
    icon: Users,
    title: 'Comunidade Ativa',
    description: 'Conecte-se com outros traders e compartilhe estratégias e análises de mercado.'
  },
  {
    icon: Globe,
    title: 'Acesso Global',
    description: 'Opere de qualquer lugar do mundo com nossa plataforma disponível 24/7.'
  }
];

const cryptos = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL'];

const Home = () => {
  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#2C2F33]/50 border-b border-[#24C3B5] backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <MultiTradingLogo size="md" />
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild className="border-[#24C3B5] text-white hover:bg-[#24C3B5]/20">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-[#24C3B5] hover:bg-[#3ED6C8] text-white">
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
        className="py-20 px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 layout className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            O Futuro do <span className="text-[#24C3B5]">Trading Cripto</span>
          </motion.h1>
          <motion.p layout className="text-xl text-[#A9B1B8] mb-8 max-w-3xl mx-auto">
            Plataforma completa para análise e trading de criptomoedas. Tome decisões inteligentes com dados em tempo real e ferramentas profissionais.
          </motion.p>
          <motion.div layout className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-[#24C3B5] hover:bg-[#3ED6C8] text-lg px-8 py-3">
              <Link to="/register">Começar Agora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-[#24C3B5] text-white hover:bg-[#24C3B5]/20 text-lg px-8 py-3">
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </motion.div>

          <motion.div
            className="flex justify-center items-center space-x-6 mt-12"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {cryptos.map((crypto) => (
              <motion.div
                key={crypto}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
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
        className="py-20 px-6 bg-[#2C2F33]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Por que escolher o Multi Trading?
            </h2>
            <p className="text-xl text-[#A9B1B8] max-w-2xl mx-auto">
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
                <Card className="bg-[#1E1E1E] border-[#24C3B5]/20 hover:border-[#24C3B5]/40 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-[#24C3B5] rounded-lg">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-[#A9B1B8]">{feature.description}</p>
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
              { value: '10K+', label: 'Traders Ativos', color: 'text-[#24C3B5]' },
              { value: '$2.5B', label: 'Volume Negociado', color: 'text-[#3ED6C8]' },
              { value: '99.9%', label: 'Uptime', color: 'text-[#A9B1B8]' },
            ].map(({ value, label, color }, index) => (
              <motion.div key={index} layout>
                <div className={`text-4xl font-bold ${color} mb-2`}>{value}</div>
                <div className="text-[#A9B1B8]">{label}</div>
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
        className="py-20 px-6 bg-gradient-to-r from-[#24C3B5] to-[#3ED6C8]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para começar a operar?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Junte-se a milhares de traders que já confiam no Multi Trading para suas operações.
          </p>
          <Button size="lg" asChild className="bg-white text-[#1E1E1E] hover:bg-gray-100 text-lg px-8 py-3">
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
        className="bg-[#1E1E1E] border-t border-[#24C3B5]/30 py-12 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <MultiTradingLogo size="sm" />
            <div className="text-[#A9B1B8] mt-4 md:mt-0">
              © 2024 Multi Trading. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
