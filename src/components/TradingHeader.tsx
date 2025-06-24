import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Settings, User, Menu } from 'lucide-react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Esquerda */}
        <div className="flex items-center space-x-6">
          <span onClick={() => navigate('/dashboard')} className="cursor-pointer">
            <MultiTradingLogo size="md" />
          </span>

          {/* Navegação Desktop */}
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
              onClick={() => navigate(`/settings/${brokerId}`)}
              className="text-gray-300 hover:text-white hover:bg-gray-700 flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </Button>
          </nav>

          {/* Nome e logo da corretora */}
          <div className="flex items-center space-x-3 border-l border-gray-600 pl-6">
            <img src={logo} alt={brokerName} className="w-10 h-10 rounded-full object-cover" />
            <h1 className="text-2xl font-bold text-white">{displayName}</h1>
          </div>
        </div>

        {/* Direita */}
        <div className="flex items-center space-x-4">
          {/* Saudação no desktop */}
          <div className="hidden md:flex items-center space-x-2 text-gray-300">
            <User className="w-4 h-4" />
            <span>Olá, {user?.complete_name}</span>
          </div>

          {/* Botão Sair */}
          <Button
            variant="outline"
            onClick={logout}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Sair
          </Button>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Menu mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            onClick={() => {
              navigate('/dashboard');
              setMenuOpen(false);
            }}
            className="text-gray-300 hover:text-white hover:bg-gray-700 w-full"
          >
            <Home className="w-4 h-4 mr-2" /> Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              navigate(`/settings/${brokerId}`);
              setMenuOpen(false);
            }}
            className="text-gray-300 hover:text-white hover:bg-gray-700 w-full"
          >
            <Settings className="w-4 h-4 mr-2" /> Configurações
          </Button>
        </div>
      )}
    </header>
  );
};

export default TradingHeader;
