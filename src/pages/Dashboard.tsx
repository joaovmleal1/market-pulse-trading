import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import Xofre from '../assets/imgs/xofre.png';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const tradingBrokers = [
    { brokerage_id: 1, name: 'Xofre', route: 'xofre', img: Xofre },
    // Adicione mais corretoras se necessário
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Fundo fixo e sem animação */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span onClick={() => navigate('/dashboard')} className="cursor-pointer">
            <MultiTradingLogo size="md" />
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-white">Olá, {user?.complete_name}</span>
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

      <motion.main
        className="max-w-6xl mx-auto p-6"
        initial={{ opacity: 0, visibility: 'hidden', y: 10 }}
        animate={{ opacity: 1, visibility: 'visible', y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Corretoras Disponíveis</h2>
          <p className="text-gray-400">Escolha uma corretora para começar a operar</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tradingBrokers.map((broker, index) => (
            <motion.div
              key={broker.brokerage_id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 text-center">
                <div className="flex justify-center mt-6">
                  <img
                    src={broker.img}
                    alt={broker.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">{broker.name}</h3>
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    onClick={() => navigate(`/broker/${broker.brokerage_id}`)}
                  >
                    Operar na {broker.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;
