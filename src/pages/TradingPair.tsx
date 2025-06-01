
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, RefreshCw, ExternalLink, Home, BarChart3, User } from 'lucide-react';
import CryptoLogo from '@/components/CryptoLogos';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import { useAuth } from '@/contexts/AuthContext';

type Signal = 'BUY' | 'SELL' | null;

const TradingPair = () => {
  const { pair } = useParams<{ pair: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [signal, setSignal] = useState<Signal>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const displayPair = pair?.replace('-', '/') || '';
  const cryptoSymbol = displayPair.split('/')[0];

  const generateSignal = () => {
    setIsAnalyzing(true);
    setIsWaiting(true);
    setSignal(null);

    // Simula análise por 30 segundos
    setTimeout(() => {
      const signals: Signal[] = ['BUY', 'SELL'];
      const randomSignal = signals[Math.floor(Math.random() * signals.length)];
      setSignal(randomSignal);
      setIsWaiting(false);
      setIsAnalyzing(false);
    }, 30000); // 30 segundos
  };

  const requestNewAnalysis = () => {
    generateSignal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <MultiTradingLogo size="md" />
            <nav className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-gray-300 hover:text-white hover:bg-gray-700 flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-gray-700 flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Análises</span>
              </Button>
            </nav>
            <div className="flex items-center space-x-3 border-l border-gray-600 pl-6">
              <CryptoLogo symbol={cryptoSymbol} size="md" />
              <h1 className="text-2xl font-bold text-white">{displayPair}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-gray-300">
              <User className="w-4 h-4" />
              <span>Olá, {user?.name}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={logout}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda - Sinais */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                {!isWaiting && !signal ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Pronto para análise
                    </h2>
                    <p className="text-gray-300">
                      Clique no botão abaixo para solicitar uma análise de câmbio
                    </p>
                  </div>
                ) : isWaiting ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Analisando câmbio...
                    </h2>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {signal === 'BUY' ? (
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <ArrowUp className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-green-400">
                          ✅ SINAL DE COMPRA
                        </h2>
                        <p className="text-gray-300">
                          Recomendação: Comprar {displayPair}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                          <ArrowDown className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-red-400">
                          🔻 SINAL DE VENDA
                        </h2>
                        <p className="text-gray-300">
                          Recomendação: Vender {displayPair}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Control Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Button 
                  onClick={requestNewAnalysis}
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  {isAnalyzing ? 'Analisando...' : 'Solicitar Nova Análise'}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Informações</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <span className="font-medium">Par:</span> {displayPair}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {isWaiting ? 'Analisando' : signal ? 'Sinal Ativo' : 'Aguardando'}
                  </div>
                  <div>
                    <span className="font-medium">Tempo de expiração:</span> 1 minuto
                  </div>
                  <div>
                    <span className="font-medium">Tipo de análise:</span> Manual
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Plataforma de Trading */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Plataforma de Trading</h3>
                  <a 
                    href="https://app.xofre.com/auth/register?affiliateId=01JW6Z7KB5J89BBA1J6YNR7D1W" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Abrir em nova aba <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
                <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  <iframe
                    src="https://app.xofre.com/auth/register?affiliateId=01JW6Z7KB5J89BBA1J6YNR7D1W"
                    className="w-full h-full border-0"
                    title="Plataforma de Trading Xofre"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TradingPair;
