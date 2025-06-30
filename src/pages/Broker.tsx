import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import BrokerSidebarMenu from '@/components/ui/BrokerSidebarMenu';

const Broker = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useSelector((state: any) => state.token);

  const [botStatus, setBotStatus] = useState<number | null>(null);
  const [winValue, setWinValue] = useState<number>(0);
  const [lossValue, setLossValue] = useState<number>(0);
  const [trades, setTrades] = useState<any[]>([]);

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'won':
      case 'won na gale 1':
      case 'won na gale 2':
        return 'text-green-500';
      case 'lost':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
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

  const totalTrades = trades.length;
  const wonTrades = trades.filter((t) =>
      ['won', 'won na gale 1', 'won na gale 2'].includes(t.status.toLowerCase())
  ).length;
  const lostTrades = trades.filter((t) => t.status.toLowerCase() === 'lost').length;
  const winRate = totalTrades > 0 ? Math.round((wonTrades / totalTrades) * 100) : 0;

  return (
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        <BrokerSidebarMenu />
        <main className="pl-72 pr-6 py-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard da Corretora</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#151515] border border-gray-800">
              <CardContent className="p-4">
                <p className="text-gray-400 text-sm mb-2">Lucro do Dia</p>
                <p className="text-green-400 text-2xl font-bold">+${winValue.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151515] border border-gray-800">
              <CardContent className="p-4">
                <p className="text-gray-400 text-sm mb-2">Perdas do Dia</p>
                <p className="text-red-400 text-2xl font-bold">-${lossValue.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151515] border border-gray-800">
              <CardContent className="p-4">
                <p className="text-gray-400 text-sm mb-2">Status do Bot</p>
                <p className="text-lg font-semibold">{getBotStatusText(botStatus)}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151515] border border-gray-800">
              <CardContent className="p-4">
                <p className="text-gray-400 text-sm mb-2">Win Rate</p>
                <p className="text-xl font-bold text-green-400">{winRate}%</p>
                <div className="w-full h-2 mt-2 bg-gray-700 rounded">
                  <div className="h-2 bg-green-500 rounded" style={{ width: `${winRate}%` }} />
                </div>
              </CardContent>
            </Card>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4">Operações Recentes</h2>
            {trades.length === 0 ? (
                <p className="text-gray-400">Nenhuma operação encontrada para hoje.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trades.slice(0, 6).map((trade, i) => (
                      <Card key={i} className="bg-[#151515] border border-gray-800">
                        <CardContent className="p-4 space-y-2">
                          <h3 className="text-lg font-semibold">{trade.symbol}</h3>
                          <p className="text-sm">
                            <span className="text-gray-400">Tipo:</span> {trade.order_type}
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-400">Valor:</span> ${trade.quantity}
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-400">Cotação:</span> ${trade.price}
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-400">Status:</span>{' '}
                            <span className={getStatusColor(trade.status)}>{trade.status}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-400">Data:</span>{' '}
                            {new Date(trade.date_time).toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                  ))}
                </div>
            )}
          </section>
        </main>
      </div>
  );
};

export default Broker;
