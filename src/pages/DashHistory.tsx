import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import SidebarMenu from '@/components/ui/SidebarMenu';

const DashHistory = () => {
  const { accessToken } = useSelector((state: any) => state.token);

  const [trades, setTrades] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const itemsPerPage = 12;

  const fetchTrades = async () => {
    setLoading(true);
    setErro('');
    try {
      const res = await fetch(`https://api.multitradingob.com/trade-order-info/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Erro ao buscar operações');
      const data = await res.json();
      setTrades(data || []);
    } catch (err) {
      setErro('Erro ao carregar os dados. Tente novamente.');
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchTrades();
    }
  }, [accessToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken) {
        fetchTrades();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [accessToken]);

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

  return (
      <div className="min-h-screen bg-[#1E1E1E] text-white">
        <SidebarMenu />
        <main className="pl-72 max-w-6xl mx-auto p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-1">Histórico de Operações</h2>
            <p className="text-sm text-gray-400 mb-4">Total: {filteredTrades.length}</p>

            {/* Filtros */}
            <div className="flex flex-wrap items-end gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data inicial:</label>
                <input
                    type="date"
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data final:</label>
                <input
                    type="date"
                    value={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white"
                />
              </div>
            </div>

            {/* Estados */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                  <p className="text-gray-400 text-center">Carregando operações...</p>
                </div>
            ) : erro ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                  <p className="text-red-500 text-center">{erro}</p>
                </div>
            ) : filteredTrades.length === 0 ? (
                <div className="flex items-center justify-center min-h-[50vh] text-gray-400 text-center">
                  <p>Nenhuma operação registrada no período selecionado.</p>
                </div>
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

                  {filteredTrades.length > itemsPerPage && (
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
