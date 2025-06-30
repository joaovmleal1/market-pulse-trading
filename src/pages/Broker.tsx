// ...imports
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BrokerSidebarMenu from '@/components/ui/BrokerSidebarMenu';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import XofreLogo from '../assets/imgs/xofre.png';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const corretoras = [
  { id: 1, name: 'Xofre', image: XofreLogo },
];

const Broker = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useSelector((state: any) => state.token);

  const [wallets, setWallets] = useState<{ REAL: string | null; DEMO: string | null }>({
    REAL: null,
    DEMO: null,
  });
  const [hasApiKey, setHasApiKey] = useState(false);
  const [hasBrokerCreds, setHasBrokerCreds] = useState(false);
  const [botStatus, setBotStatus] = useState<number | null>(null);
  const [isLoadingBot, setIsLoadingBot] = useState(false);
  const [trades, setTrades] = useState<any[]>([]);
  const [winValue, setWinValue] = useState<number>(0);
  const [lossValue, setLossValue] = useState<number>(0);
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
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBotStatus(data.bot_status);
      setWinValue(data.win_value);
      setLossValue(data.loss_value);
    } catch {
      setBotStatus(null);
    }
  };

  const fetchWallets = async () => {
    if (!id) return;
    try {
      const res = await fetch(`https://api.multitradingob.com/user-brokerages/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userBrokerages = await res.json();
      const hasKey = !!userBrokerages.api_key;
      const bc = !!userBrokerages.brokerage_username && !!userBrokerages.brokerage_password;
      setHasApiKey(hasKey);
      setHasBrokerCreds(bc);

      if (!hasKey) {
        setWallets({ REAL: null, DEMO: null });
        return;
      }

      const decodedApiKey = atob(userBrokerages.api_key);
      const walletRes = await fetch('https://broker-api.mybroker.dev/token/wallets', {
        headers: { 'api-token': decodedApiKey },
      });

      const walletData = await walletRes.json();
      const real = walletData.find((w: any) => w.type === 'REAL');
      const demo = walletData.find((w: any) => w.type === 'DEMO');

      setWallets({
        REAL: real ? `$ ${real.balance.toFixed(2)}` : 'Indisponível',
        DEMO: demo ? `$ ${demo.balance.toFixed(2)}` : 'Indisponível',
      });
    } catch {
      setWallets({ REAL: null, DEMO: null });
    }
  };

  const fetchTrades = async () => {
    try {
      const res = await fetch(`https://api.multitradingob.com/trade-order-info/today/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setTrades(data || []);
    } catch {
      setTrades([]);
    }
  };

  const toggleBot = async () => {
    if (botStatus === null) return;
    setIsLoadingBot(true);
    try {
      const res = await fetch(`https://api.multitradingob.com/bot-options/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      const userId = data.user_id;
      const url =
          botStatus === 1
              ? `https://bot.multitradingob.com/stop/${userId}`
              : `https://bot.multitradingob.com/start/${userId}`;

      await fetch(url, {
        method: 'GET',
        headers: { Authorization: authHeader },
      });
      setBotStatus(botStatus === 1 ? 0 : 1);
    } catch {
      console.error('Erro ao alternar bot');
    } finally {
      setIsLoadingBot(false);
    }
  };

  useEffect(() => {
    if (accessToken && id) {
      fetchBotStatus();
      fetchWallets();
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

  const corretora = corretoras.find((c) => c.id.toString() === id);
  if (!corretora) {
    return <div className="text-white text-center mt-20">Corretora não encontrada.</div>;
  }

  const brokerName = corretora.name.split('/')[0];
  const paginatedTrades = trades
      .slice()
      .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        return 'Desconhecido';
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <BrokerSidebarMenu />
        <main className="pl-72 max-w-6xl mx-auto p-6">
          {/* Bot Info */}
          <div className="mb-6 text-center text-white">
            <p>Status do Bot: <strong>{getBotStatusText(botStatus)}</strong></p>
            <Button onClick={toggleBot} disabled={isLoadingBot} className="mt-2">
              {isLoadingBot ? 'Aguarde...' : botStatus === 1 ? 'Parar Bot' : 'Iniciar Bot'}
            </Button>
          </div>

          {/* Wallet and Profit Cards */}
          <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white">Saldo Real</h3>
                <p className="text-xl text-green-400">{wallets.REAL ?? '—'}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white">Saldo Demo</h3>
                <p className="text-xl text-yellow-400">{wallets.DEMO ?? '—'}</p>
              </CardContent>
            </Card>
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

          {/* Operações */}
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-1">Operações de Hoje</h2>
            <p className="text-sm text-gray-400 mb-4">Total: {trades.length}</p>

            {trades.length === 0 ? (
                <p className="text-gray-400">Nenhuma operação realizada.</p>
            ) : (
                <>
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
                </>
            )}
          </div>
        </main>
      </div>
  );
};

export default Broker;
