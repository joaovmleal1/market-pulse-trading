import { useNavigate } from 'react-router-dom';
import { Disclosure, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Home, Settings, User, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
    <Disclosure as="header" className="bg-gray-800 border-b border-gray-700">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            {/* Left - Navegação */}
            <div className="flex items-center space-x-4">
              <span onClick={() => navigate('/dashboard')} className="cursor-pointer">
                <MultiTradingLogo size="md" />
              </span>

              <div className="hidden md:flex items-center space-x-4">
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
              </div>
            </div>

            {/* Right - Nome, Admin e Sair */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <User className="w-4 h-4" />
                <span>Olá, {user?.complete_name}</span>

                {user?.is_superuser && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/admin')}
                    className="text-purple-300 hover:text-white hover:bg-gray-700 flex items-center space-x-1 ml-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Sair
              </Button>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <Disclosure.Button className="text-gray-300 hover:text-white focus:outline-none">
                {open ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </Disclosure.Button>
            </div>
          </div>

          {/* Mobile Panel */}
          <Transition
            show={open}
            enter="transition duration-300 ease-out"
            enterFrom="transform -translate-y-10 opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-200 ease-in"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform -translate-y-10 opacity-0"
          >
            <Disclosure.Panel className="md:hidden px-4 pb-4 py-4 space-y-4 bg-gray-800 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <img
                  src={logo}
                  alt={brokerName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h1 className="text-xl font-bold text-white">{displayName}</h1>
              </div>

              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="w-full text-gray-300 justify-start"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate(`/settings/${brokerId}`)}
                className="w-full text-gray-300 justify-start"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>

              {/* Admin (Mobile) */}
              {user?.is_superuser && (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin')}
                  className="w-full text-purple-300 hover:text-white justify-start"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Painel Admin
                </Button>
              )}

              <div className="text-gray-300 flex items-center space-x-2 mt-4">
                <User className="w-4 h-4" />
                <span>Olá, {user?.complete_name}</span>
              </div>

              <Button
                variant="outline"
                onClick={logout}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full mt-2"
              >
                Sair
              </Button>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default TradingHeader;
