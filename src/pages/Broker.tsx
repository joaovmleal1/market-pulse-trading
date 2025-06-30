import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import BrokerSidebarMenu from '@/components/ui/BrokerSidebarMenu';

const Broker = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useSelector((state: any) => state.token);

  const [wallets, setWallets] = useState<{ REAL: string; DEMO: string }>({ REAL: '', DEMO: '' });
  const [botStatus, setBotStatus] = useState<number | null>(null);
  const [winValue, setWinValue] = useState<number>(0);
  const [lossValue, setLossValue] = useState<number>(0);
  const [trades, setTrades] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const BOT_BASIC_USER = import.meta.env.VITE_BASIC_AUTH_USER;
  const BOT_BASIC_PASS = import.meta.env.VITE_BASIC_AUTH_PASS;
  const authHeader = 'Basic ' + btoa(`${BOT_BASIC_USER}:${BOT_BASIC_PASS}`);

  const fetchBotStatus = async () => {
    try {
      const res = await fetch(`https://api.multitradingob.com/bot-options/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setBotStatus(data.bot_status);
      setWinValue(data.win_value);
      setLossValue(data.loss_value);
    } catch {
      setBotStatus(null);
    }
  };

  const fetchTrades = async () => {
    try {
      const res = await fetch(`https://api.multitradingob.com/trade-order-info/today/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.status === 404) {
        setTrades([]);
        return;
      }

      if (!res.ok) throw new Error('Erro ao buscar trades');
      const data = await res.json();
      setTrades(Array.isArray(data) ? data : []);
    } catch {
      setTrades([]);
    }
  };

  useEffect(() => {
    if (accessToken && id) {
      fetchBotStatus();
      fetchTrades();
    }
  }, [accessToken, id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken && id) {
        fetchBotStatus();
        fetchTrades();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [accessToken, id]);

  const paginatedTrades = Array.isArray(trades)
      ? trades
          .slice()
          .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : [];

  const getStatusBorder = (status: string) => {
    switch (status.toLowerCase()) {
      case 'won':
      case 'won na gale 1':
      case 'won na gale 2':
        return 'border-green-500';
      case 'lost':
        return 'border-red-500';
      case 'pending':
        return 'border-yellow-500';
      default:
        return 'border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'won':
      case 'won na gale 1':
      case 'won na gale 2':
        return <CheckCircle className="w-5 h-5 inline text-green-400" />;
      case 'lost':
        return <XCircle className="w-5 h-5 inline text-red-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 inline text-yellow-400" />;
      default:
        return null;
    }
  };

  const getBotStatusText = (status: number | null) => {
    if (status === null) return 'Indisponível';
    switch (status) {
      case 0:
        return 'Parado';
      case 1:
        return 'Operando';
      case 2:
        return 'Stop Win';
      case 3:
        return 'Stop Loss';
      default:
        return 'Status desconhecido';
    }
  };

  return (
      <div className="min-h-screen bg-[#1E1E1E] text-white">
        <BrokerSidebarMenu brokerageId={id} />
        <main className="pl-72 max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4">Resumo da Corretora</h1>

          <div className="mb-6 text-white">
            <p>
              Status do Bot: <strong>{getBotStatusText(botStatus)}</strong>
            </p>
          </div>

          <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white">Lucro do Dia</h3>
                <p className="text-xl text-green-400">$ {winValue.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white">Perdas do Dia</h3>
                <p className="text-xl text-red-400">$ {lossValue.toFixed(2)}</p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="mb-4 text-white">
            <h2 className="text-2xl font-bold mb-1">Operações do Dia</h2>
            <p className="text-sm text-gray-400 mb-4">Total: {trades.length}</p>

            {paginatedTrades.length === 0 ? (
                <p className="text-gray-400">Nenhuma operação realizada hoje.</p>
            ) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { delayChildren: 0.2, staggerChildren: 0.1 },
                      },
                    }}
                >
                  {paginatedTrades.map((trade, idx) => (
                      <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <Card className={`bg-gray-800 border-2 ${getStatusBorder(trade.status)} rounded-2xl`}>
                          <CardContent className="p-5 text-white">
                            <h4 className="text-xl font-bold mb-2">{trade.symbol}</h4>
                            <div className="space-y-1 text-sm text-gray-300">
                              <p><span className="text-gray-400">Direção:</span> {trade.order_type}</p>
                              <p><span className="text-gray-400">Entrada:</span> $ {trade.quantity}</p>
                              <p><span className="text-gray-400">Cotação:</span> $ {trade.price}</p>
                              <p><span className="text-gray-400">Status:</span> {getStatusIcon(trade.status)} {trade.status}</p>
                              <p><span className="text-gray-400">Data:</span> {new Date(trade.date_time).toLocaleString()}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                  ))}
                </motion.div>
            )}
          </div>
        </main>
      </div>
  );
};

export default Broker;
