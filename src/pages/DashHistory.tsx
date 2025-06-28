import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import XofreLogo from '../assets/imgs/xofre.png';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import SidebarMenu from '@/components/ui/SidebarMenu';

const DashHistory = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useSelector((state: any) => state.token);

  const [trades, setTrades] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchTrades = async () => {
    try {
      const res = await fetch(`https://api.multitradingob.com/trade-order-info/trade_order_info/today/1`, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Erro ao buscar operações');
      const data = await res.json();
      setTrades(data || []);
    } catch {
      setTrades([]);
    }
  };

  useEffect(() => {
    if (accessToken && id) {
      fetchTrades();
    }
  }, [accessToken, id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken && id) {
        fetchTrades();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [accessToken, id]);

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

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <SidebarMenu />
      <main className="pl-72 max-w-6xl mx-auto p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-1">Operações realizadas hoje</h2>
          <p className="text-sm text-gray-400 mb-4">Total: {trades.length}</p>

          {trades.length === 0 ? (
            <p className="text-gray-400">Nenhuma operação registrada até o momento.</p>
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
                  <motion.div
                    key={idx}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <Card
                      className={`bg-[#2C2F33] border-2 ${getStatusBorder(
                        trade.status
                      )} rounded-2xl shadow-md shadow-black/40 transition-transform duration-200 hover:scale-[1.02]`}
                    >
                      <CardContent className="p-5">
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

              {trades.length > itemsPerPage && (
                <div className="flex justify-center mt-6 gap-2">
                  <Button
                    variant="outline"
                    className="bg-transparent text-white"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent text-white"
                    disabled={currentPage * itemsPerPage >= trades.length}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashHistory;