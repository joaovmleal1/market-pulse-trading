
import { Button } from '@/components/ui/button';
import { Home, BarChart3, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CryptoLogo from '@/components/CryptoLogos';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import { useAuth } from '@/contexts/AuthContext';

interface TradingHeaderProps {
  displayPair: string;
  cryptoSymbol: string;
}

const TradingHeader = ({ displayPair, cryptoSymbol }: TradingHeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
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
  );
};

export default TradingHeader;
