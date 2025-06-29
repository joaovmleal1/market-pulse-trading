import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import SidebarMenu from '@/components/ui/SidebarMenu';
import { motion } from 'framer-motion';

// Imagens locais
import Xofre from '@/assets/imgs/xofre.png';
// Você pode importar mais se tiver outras corretoras
// import Quotex from '@/assets/imgs/quotex.png';

type Brokerage = {
  id: number;
  brokerage_name: string;
  brokerage_route: string;
  brokerage_icon: string; // Vem da API, mas usamos para identificar a imagem local
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accessToken } = useSelector((state: any) => state.token);
  const [brokerages, setBrokerages] = useState<Brokerage[]>([]);

  // Mapeia rota da corretora para imagem local
  const getBrokerIcon = (route: string) => {
    switch (route) {
      case 'xofre':
        return Xofre;
        // Adicione mais mapeamentos se necessário
      default:
        return Xofre; // fallback genérico
    }
  };

  const fetchBrokerages = async () => {
    try {
      const res = await fetch('https://api.multitradingob.com/brokerages', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Erro ao buscar corretoras');
      const data = await res.json();
      setBrokerages(data);
    } catch (err) {
      console.error(err);
      setBrokerages([]);
    }
  };

  useEffect(() => {
    if (accessToken) fetchBrokerages();
  }, [accessToken]);

  return (
      <div className="min-h-screen bg-[#1E1E1E] text-white">
        <SidebarMenu />

        <div className="pl-72 p-6">
          <div className="flex justify-end mb-6">
            <div className="bg-[#2C2F33] px-4 py-2 rounded-md border border-[#24C3B5]/20">
              Olá, <span className="text-[#24C3B5] font-semibold">{user?.complete_name}</span>
            </div>
          </div>

          <motion.div
              className="mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">Minhas Corretoras</h2>
            <p className="text-gray-400">Escolha uma corretora para começar a operar</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokerages.map((broker, index) => (
                <motion.div
                    key={broker.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                >
                  <Card className="bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all duration-300 text-center">
                    <div className="flex justify-center mt-6">
                      <img
                          src={getBrokerIcon(broker.brokerage_route)}
                          alt={broker.brokerage_name}
                          className="w-16 h-16 object-cover rounded-full"
                      />
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-4">{broker.brokerage_name}</h3>
                      <Button
                          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          onClick={() => navigate(`/broker/${broker.id}`)}
                      >
                        Operar na {broker.brokerage_name}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
