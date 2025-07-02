
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import BrokerSidebarMenu from "@/components/ui/BrokerSidebarMenu.tsx";
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const BrokerHistory = () => {
  const { accessToken } = useSelector((state: any) => state.token);
  const { id } = useParams<{ id: string }>();

  const [trades, setTrades] = useState([]);
  const [brokerNames, setBrokerNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  const fetchTrades = async () => {
    if (!id) return;
    try {
      const res = await fetch(`https://api.multitradingob.com/trade-order-info/all/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error('Erro ao buscar operações');
      const data = await res.json();
      setTrades(data || []);
    } catch {
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrokerName = async (id: number) => {
    if (brokerNames[id]) return;
    try {
      const res = await fetch(`https://api.multitradingob.com/brokerages/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBrokerNames((prev) => ({ ...prev, [id]: data.brokerage_name }));
    } catch {
      setBrokerNames((prev) => ({ ...prev, [id]: 'Desconhecida' }));
    }
  };

  useEffect(() => {
    if (accessToken) fetchTrades();
  }, [accessToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken) fetchTrades();
    }, 15000);
    return () => clearInterval(interval);
  }, [accessToken]);

  useEffect(() => {
    const ids = new Set(trades.map((t) => t.brokerage_id));
    ids.forEach((id) => fetchBrokerName(id));
  }, [trades]);

  const filteredTrades = trades.filter((trade) => {
    const tradeDate = new Date(trade.date_time);
    const start = dataInicial ? new Date(dataInicial) : null;
    const end = dataFinal ? new Date(dataFinal) : null;

    if (start && tradeDate < start) return false;
    if (end && tradeDate > new Date(end.getTime() + 24 * 60 * 60 * 1000)) return false;
    return true;
  });

  const paginatedTrades = filteredTrades
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

  const limparDatas = () => {
    setDataInicial('');
    setDataFinal('');
  };

  return (
      <div className="min-h-screen bg-[#1E1E1E] text-white">
        <BrokerSidebarMenu />
        <main className="pl-72 max-w-6xl mx-auto p-4 pt-20 sm:p-6">
          <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />
              <Input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
              <Button variant="ghost" onClick={limparDatas} className="text-gray-300 border border-gray-600 hover:bg-gray-700">Limpar</Button>
            </div>
          </div>

          {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-cyan-400 w-8 h-8" />
              </div>
          ) : paginatedTrades.length === 0 ? (
              <div className="text-center text-gray-400">Nenhuma operação encontrada</div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedTrades.map((trade, index) => (
                    <motion.div
                        key={index}
                        className={`border-l-4 p-4 rounded-lg bg-[#111827] ${getStatusBorder(trade.status)}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                      <div className="text-sm text-gray-400">{new Date(trade.date_time).toLocaleString()}</div>
                      <div className="font-semibold text-gray-200">
                        {brokerNames[trade.brokerage_id] || 'Carregando...'} - {trade.asset}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">{getStatusIcon(trade.status)} {trade.status}</span>
                        <span className="text-sm text-gray-400">Entrada: {trade.entry_value}</span>
                      </div>
                    </motion.div>
                ))}
              </div>
          )}
        </main>
      </div>
  );
};

export default BrokerHistory;
