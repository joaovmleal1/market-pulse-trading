import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SidebarMenu from '@/components/ui/SidebarMenu';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

type Brokerage = {
  id: number;
  brokerage_name: string;
  brokerage_route: string;
  brokerage_icon: string;
};

type BotOptions = {
  bot_status: number;
  win_value: number;
  loss_value: number;
};

type Trade = {
  symbol: string;
  order_type: string;
  quantity: number;
  price: number;
  status: string;
  date_time: string;
};

// Importa todas as imagens da pasta
const imageMap = import.meta.glob('@/assets/imgs/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

// Função para buscar imagem por nome vindo da API
const getImagePath = (filename: string) => {
  const entry = Object.entries(imageMap).find(([key]) => key.endsWith(filename));
  return entry ? entry[1] : '';
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accessToken } = useSelector((state: any) => state.token);

  const [brokers, setBrokers] = useState<Brokerage[]>([]);
  const [data, setData] = useState<Record<number, { bot?: BotOptions; lastTrade?: Trade }>>({});

  useEffect(() => {
    if (!accessToken) return;

    fetch('https://api.multitradingob.com/brokerages', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
        .then((res) => res.json())
        .then(setBrokers)
        .catch(console.error);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || brokers.length === 0) return;

    brokers.forEach((b) => {
      fetch(`https://api.multitradingob.com/bot-options/${b.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
          .then((res) => res.json())
          .then((bot) => setData((prev) => ({ ...prev, [b.id]: { ...prev[b.id], bot } })))
          .catch(console.error);

      fetch(`https://api.multitradingob.com/trade-order-info/today/${b.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
          .then((res) => res.json())
          .then((trades: Trade[]) => {
            const last = trades.sort(
                (a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
            )[0];
            setData((prev) => ({ ...prev, [b.id]: { ...prev[b.id], lastTrade: last } }));
          })
          .catch(console.error);
    });
  }, [accessToken, brokers]);

  const getStatusLabel = (status: number | undefined) => {
    switch (status) {
      case 1:
        return 'Operando';
      case 0:
        return 'Parado';
      case 2:
        return 'Stop Win';
      case 3:
        return 'Stop Loss';
      default:
        return '—';
    }
  };

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
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-2">Minhas Corretoras</h2>
            <p className="text-gray-400">Informações gerais por corretora</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {brokers.map((b, i) => {
              const info = data[b.id] || {};
              const imageSrc = getImagePath(b.brokerage_icon);
              return (
                  <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <Card className="bg-[#2C2F33] border border-[#24C3B5]/30 rounded-xl hover:shadow-md shadow-black/30 transition-all duration-300">
                      <CardContent className="relative p-6">
                        <div className="flex flex-col items-center">
                          <img
                              src={imageSrc}
                              alt={b.brokerage_name}
                              className="w-14 h-14 object-contain mb-4"
                          />
                          <h3 className="text-xl font-bold text-white mb-3">{b.brokerage_name}</h3>

                          <div className="text-sm text-gray-300 space-y-1 text-center">
                            <p>
                              <span className="text-gray-400">Status:</span>{' '}
                              <span className="text-white">{getStatusLabel(info.bot?.bot_status)}</span>
                            </p>
                            <p>
                              <span className="text-gray-400">Lucro:</span>{' '}
                              <span className="text-green-400">
                            R$ {info.bot?.win_value.toFixed(2) ?? '0.00'}
                          </span>
                            </p>
                            <p>
                              <span className="text-gray-400">Perdas:</span>{' '}
                              <span className="text-red-400">
                            R$ {info.bot?.loss_value.toFixed(2) ?? '0.00'}
                          </span>
                            </p>
                            {info.lastTrade && (
                                <p>
                                  <span className="text-gray-400">Última:</span>{' '}
                                  {info.lastTrade.symbol} — {info.lastTrade.status}
                                </p>
                            )}
                          </div>
                        </div>

                        <Button
                            className="mt-6 w-full bg-[#24C3B5] hover:bg-[#1ca79c] transition-all duration-200"
                            onClick={() => navigate(`/broker/${b.id}`)}
                        >
                          Operar
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
              );
            })}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
