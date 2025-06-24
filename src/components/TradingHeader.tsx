import { Button } from '@/components/ui/button';
import { Home, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import { useAuth } from '@/contexts/AuthContext';

interface TradingHeaderProps {
  displayName: string;
  brokerName: string;
  logo: string;
  brokerId?: number;
}

const TradingHeader = ({ displayName, brokerName, logo, brokerId }: TradingHeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
          <span onClick={() => navigate('/dashboard')} className="cursor-pointer">
            <MultiTradingLogo size="md" />
          </span>

          {/* Botões sempre visíveis agora */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-gray-300 hover:text-white hover:bg-gray-700 flex items-center space-x-2 w-full md:w-auto"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate(`/settings/${brokerId}`)}
              className="text-gray-300 hover:text-white hover:bg-gray-700 flex items-center space-x-2 w-full md:w-auto"
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </Button>
          </div>

          <div className="flex items-center space-x-3 border-t md:border-t-0 md:border-l border-gray-600 pt-3 md:pt-0 md:pl-6 w-full md:w-auto">
            <img
              src={logo}
              alt={brokerName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <h1 className="text-xl md:text-2xl font-bold text-white text-center md:text-left">{displayName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 text-gray-300 text-sm md:text-base">
            <User className="w-4 h-4" />
            <span>Olá, {user?.complete_name}</span>
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
