
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import CryptoLogo from '@/components/CryptoLogos';

const tradingPairs = [
  { symbol: 'ETH/USDT', name: 'Ethereum', cryptoSymbol: 'ETH' },
  { symbol: 'XRP/USDT', name: 'Ripple', cryptoSymbol: 'XRP' },
  { symbol: 'ADA/USDT', name: 'Cardano', cryptoSymbol: 'ADA' },
  { symbol: 'BTC/USDT', name: 'Bitcoin', cryptoSymbol: 'BTC' },
  { symbol: 'SOL/USDT', name: 'Solana', cryptoSymbol: 'SOL' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handlePairClick = (pair: string) => {
    navigate(`/trading/${pair.replace('/', '-')}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <MultiTradingLogo size="md" />
          <div className="flex items-center space-x-4">
            <span className="text-white">Olá, {user?.name}</span>
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

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Pares de Trading</h2>
          <p className="text-gray-400">Selecione um par para começar a operar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tradingPairs.map((pair) => (
            <Card 
              key={pair.symbol}
              className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => handlePairClick(pair.symbol)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <CryptoLogo symbol={pair.cryptoSymbol} size="lg" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{pair.symbol}</h3>
                    <p className="text-gray-400">{pair.name}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                    Operar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
