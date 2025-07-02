// DashHistory.tsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SidebarMenu from '@/components/ui/SidebarMenu';

interface Trade {
  symbol: string;
  order_type: string;
  quantity: number;
  price: number;
  status: string;
  date_time: string;
  brokerage_id: number;
}

interface Brokerage {
  id: number;
  brokerage_name: string;
}

const DashHistory = () => {
  const { accessToken } = useSelector((state: any) => state.token);

  const [trades, setTrades] = useState<Trade[]>([]);
  const [brokerNames, setBrokerNames] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://api.multitradingob.com/trade-order-info/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error();
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
      const data: Brokerage = await res.json();
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
      <div className="min-h-screen bg-[#111827] text-white">
        <SidebarMenu />
        <main className="lg:pl-72 pl-4 pr-4 max-w-6xl mx-auto pt-20 pb-10">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-1 text-cyan-400">Histórico de Operações</h2>
            <p className="text-sm text-gray-400 mb-4">Total: {filteredTrades.length}</p>

            <div className="flex flex-wrap items-end gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data inicial:</label>
                <input
                    type="date"
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)}
                    className="bg-[#1E293B] border border-gray-600 rounded px-3 py-1 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data final:</label>
                <input
                    type="date"
                    value={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)}
                    className="bg-[#1E293B] border border-gray-600 rounded px-3 py-1 text-white"
                />
              </div>
              <div className="pt-1">
                <Button
                    onClick={limparDatas}
                    className="text-sm bg-cyan-500/10 border border-cyan-500 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                >
                  Limpar datas
                </Button>
              </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-72">
                  <Loader2 className="animate-spin w-8 h-8 text-cyan-400" />
                </div>
            ) : filteredTrades.length === 0 ? (
                <div className="flex items-center justify-center min-h-[60vh] text-gray-400 text-center">
                  <p>Nenhuma operação registrada no período selecionado.</p>
                </div>
            ) : (
                <>
                  <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: { opacity: 1, y: 0 },
                            }}
                        >
                          <Card
                              className={`bg-[#1E293B] border-2 ${getStatusBorder(
                                  trade.status
                              )} rounded-xl shadow-lg transition-transform duration-200 hover:scale-[1.02]`}
                          >
                            <CardContent className="p-5">
                              <h4 className="text-lg font-bold mb-2 text-cyan-400">{trade.symbol}</h4>
                              <div className="space-y-1 text-sm text-gray-300">
                                <p>
                                  <span className="text-gray-400">Corretora:</span>{' '}
                                  {brokerNames[trade.brokerage_id] || '...'}
                                </p>
                                <p>
                                  <span className="text-gray-400">Direção:</span> {trade.order_type}
                                </p>
                                <p>
                                  <span className="text-gray-400">Entrada:</span> $ {trade.quantity}
                                </p>
                                <p>
                                  <span className="text-gray-400">Cotação:</span> $ {trade.price}
                                </p>
                                <p>
                                  <span className="text-gray-400">Status:</span>{' '}
                                  {getStatusIcon(trade.status)} {trade.status}
                                </p>
                                <p>
                                  <span className="text-gray-400">Data:</span>{' '}
                                  {new Date(trade.date_time).toLocaleString()}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                    ))}
                  </motion.div>

                  {filteredTrades.length > itemsPerPage && (
                      <div className="flex justify-center mt-6 gap-2">
                        <Button
                            variant="outline"
                            className="bg-[#1E293B] text-gray-200 hover:bg-gray-700"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                        >
                          Anterior
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-[#1E293B] text-gray-200 hover:bg-gray-700"
                            disabled={currentPage * itemsPerPage >= filteredTrades.length}
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
