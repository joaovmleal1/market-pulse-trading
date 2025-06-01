
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <MultiTradingLogo size="md" />
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                <Link to="/register">Cadastrar</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            O Futuro do <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Trading Cripto</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Plataforma completa para análise e trading de criptomoedas. Tome decisões inteligentes com dados em tempo real e ferramentas profissionais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg px-8 py-3">
              <Link to="/register">Começar Agora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-gray-600 text-gray-300 hover:bg-gray-700 text-lg px-8 py-3">
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </div>
          
          {/* Crypto Icons */}
          <div className="flex justify-center items-center space-x-6 mt-12">
            {cryptos.map((crypto) => (
              <div key={crypto} className="animate-fade-in">
                <CryptoLogo symbol={crypto} size="lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Por que escolher o Multi Trading?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Desenvolvido para traders que buscam precisão, velocidade e segurança em suas operações.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-gray-400">Traders Ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">$2.5B</div>
              <div className="text-gray-400">Volume Negociado</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para começar a operar?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Junte-se a milhares de traders que já confiam no Multi Trading para suas operações.
          </p>
          <Button size="lg" asChild className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-3">
            <Link to="/register">Criar Conta Gratuita</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <MultiTradingLogo size="sm" />
            <div className="text-gray-400 mt-4 md:mt-0">
              © 2024 Multi Trading. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
