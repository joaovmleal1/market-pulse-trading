
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import BrokerSidebarMenu from '@/components/ui/BrokerSidebarMenu';
import { cn } from '@/lib/utils';

export const Broker = () => {
    const { id } = useParams<{ id: string }>();
    const { accessToken } = useSelector((state: any) => state.token);

    const [wallets, setWallets] = useState<{ REAL?: number; DEMO?: number }>({});
    const [brokerInfo, setBrokerInfo] = useState<{ name?: string; icon?: string }>({});
    const [selectedWallet, setSelectedWallet] = useState<'REAL' | 'DEMO'>('REAL');
    const [botStatus, setBotStatus] = useState<number>(0);
    const [isDemo, setIsDemo] = useState<boolean>(true);
    const [roiValue, setRoiValue] = useState<number>(0);
    const [roiPercent, setRoiPercent] = useState<number>(0);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [dailyStats, setDailyStats] = useState({ wins: 0, losses: 0, lucro: 0 });
    const [totalStats, setTotalStats] = useState({ wins: 0, losses: 0, lucro: 0 });
    const [roiTotalPercent, setRoiTotalPercent] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const isReal = selectedWallet === 'REAL';
    const saldoColor = isReal ? 'text-green-400' : 'text-orange-400';
    const contaLabel = isReal ? 'Conta real' : 'Conta demo';

    const fetchWallets = async () => {
        if (!id) return;
        try {
            const res = await fetch(`https://api.multitradingob.com/user-brokerages/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();

            if (data?.api_key) {
                const decodedApiKey = atob(data.api_key);
                const walletRes = await fetch('https://broker-api.mybroker.dev/token/wallets', {
                    headers: { 'api-token': decodedApiKey },
                });
                const walletData = await walletRes.json();
                const real = walletData.find((w: any) => w.type === 'REAL');
                const demo = walletData.find((w: any) => w.type === 'DEMO');
                setWallets({
                    REAL: real?.balance ?? 0,
                    DEMO: demo?.balance ?? 0,
                });
            }
        } catch {
            setWallets({});
        }
    };

    const fetchBrokerInfo = async () => {
        if (!id) return;
        try {
            const res = await fetch(`https://api.multitradingob.com/brokerages/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            setBrokerInfo({
                name: data?.brokerage_name,
                icon: data?.brokerage_icon,
            });
        } catch {
            setBrokerInfo({});
        }
    };

    const fetchBotOptions = async () => {
        if (!id) return;
        try {
            const res = await fetch(`https://api.multitradingob.com/bot-options/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            setBotStatus(data?.bot_status ?? 0);
            setIsDemo(data?.is_demo ?? true);
            setUserId(data?.user_id ?? null);
        } catch {
            setBotStatus(0);
            setIsDemo(true);
        }
    };

    const fetchTradeOrders = async () => {
        if (!id) return;
        try {
            const res = await fetch(`https://api.multitradingob.com/trade-order-info/today/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            setRecentOrders(data);

            let wins = 0;
            let losses = 0;
            let lucro = 0;

            data.forEach((op: any) => {
                const status = op.status?.toUpperCase();
                if (status?.includes('WON')) {
                    wins++;
                    lucro += op.pnl;
                } else if (status?.includes('LOST')) {
                    losses++;
                    lucro -= op.pnl;
                }
            });

            setDailyStats({ wins, losses, lucro });

            const total = data.reduce((acc: number, op: any) => acc + op.pnl, 0);
            setRoiValue(lucro);
            setRoiPercent(total ? (lucro / total) * 100 : 0);
        } catch {
            setRecentOrders([]);
            setDailyStats({ wins: 0, losses: 0, lucro: 0 });
            setRoiValue(0);
            setRoiPercent(0);
        }
    };

    const fetchAllTrades = async () => {
        if (!id) return;
        try {
            const res = await fetch(`https://api.multitradingob.com/trade-order-info/all/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();

            let wins = 0;
            let losses = 0;
            let lucro = 0;

            data.forEach((op: any) => {
                const status = op.status?.toUpperCase();
                if (status?.includes('WON')) {
                    wins++;
                    lucro += op.pnl;
                } else if (status?.includes('LOST')) {
                    losses++;
                    lucro -= op.pnl;
                }
            });

            setTotalStats({ wins, losses, lucro });

            const total = data.reduce((acc: number, op: any) => acc + op.pnl, 0);
            setRoiTotalPercent(total ? (lucro / total) * 100 : 0);
        } catch {
            setTotalStats({ wins: 0, losses: 0, lucro: 0 });
            setRoiTotalPercent(0);
        }
    };

    const toggleBot = async () => {
        if (!userId || !id) return;
        const action = botStatus === 1 ? 'stop' : 'start';
        const url = `https://bot.multitradingob.com/${action}/${userId}/${id}`;

        const username = import.meta.env.VITE_BASIC_AUTH_USER;
        const password = import.meta.env.VITE_BASIC_AUTH_PASS;
        const credentials = btoa(`${username}:${password}`);

        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${credentials}`,
                },
            });
            if (res.ok) {
                setBotStatus((prev) => (prev === 1 ? 0 : 1));
            }
        } catch (err) {
            console.error('Erro ao alternar o bot:', err);
        }
    };

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([
                fetchWallets(),
                fetchBrokerInfo(),
                fetchBotOptions(),
                fetchTradeOrders(),
                fetchAllTrades()
            ]);
            setLoading(false);
        };

        if (accessToken) loadAll();
    }, [accessToken]);

    const getWinrate = (stats: { wins: number; losses: number }) => {
        const total = stats.wins + stats.losses;
        return total === 0 ? 0 : Math.round((stats.wins / total) * 100);
    };

    const imageMap = import.meta.glob('@/assets/imgs/*', {
        eager: true,
        import: 'default',
    }) as Record<string, string>;

    const getImagePath = (filename: string) => {
        const entry = Object.entries(imageMap).find(([key]) => key.endsWith(filename));
        return entry ? entry[1] : '';
    };

    const imageSrc = getImagePath(brokerInfo.icon);
    const saldo = selectedWallet === 'REAL' ? wallets.REAL ?? 0 : wallets.DEMO ?? 0;

    const handleToggleWallet = () => {
        setSelectedWallet((prev) => (prev === 'REAL' ? 'DEMO' : 'REAL'));
    };

    return (
        <div className="min-h-screen bg-[#111827] text-white relative">
            <BrokerSidebarMenu />

            {loading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <main className="p-4 sm:p-6 md:pl-72 md:pr-10 md:py-10 pt-20 transition-all">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
                            <CardContent className="p-5 space-y-2">
                                <p className="text-gray-400 text-sm">Saldo disponível</p>
                                <p className={`text-3xl font-bold ${saldoColor}`}>$ {saldo.toFixed(2)}</p>
                                <p className="text-gray-400 text-sm">{contaLabel}</p>
                                <button
                                    onClick={handleToggleWallet}
                                    className="mt-4 w-full px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/20 transition"
                                >
                                    Trocar para {isReal ? 'Demo' : 'Real'}
                                </button>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-cyan-400 font-semibold">🤖 Status do Bot</p>
                                    <span
                                        className={`px-3 py-1 text-sm rounded-full ${
                                            botStatus === 1 ? 'bg-green-500' : 'bg-red-500'
                                        } text-white`}
                                    >
                    {botStatus === 1 ? 'Ativo' : 'Parado'}
                  </span>
                                </div>
                                <p className="text-sm text-gray-400">{isDemo ? 'Conta demo' : 'Conta real'}</p>
                                {brokerInfo.icon && (
                                    <img
                                        src={imageSrc}
                                        alt="Logo corretora"
                                        className="w-16 h-16 object-contain mx-auto mt-2"
                                    />
                                )}
                                <button
                                    onClick={toggleBot}
                                    className={`mt-4 w-full px-4 py-2 rounded-xl font-semibold transition text-white ${
                                        botStatus === 1
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {botStatus === 1 ? 'Parar bot' : 'Ativar bot'}
                                </button>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
                            <CardContent className="p-5">
                                <p className="text-cyan-400 font-semibold mb-1">📈 ROI Diário</p>
                                <p
                                    className={`text-3xl font-bold ${
                                        roiValue >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}
                                >
                                    {roiPercent.toFixed(2)}%
                                </p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Lucro:{' '}
                                    <span
                                        className={`font-bold ${
                                            roiValue >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}
                                    >
                    $ {roiValue.toFixed(2)}
                  </span>
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {[{ label: '📊 Estatísticas Diárias', stats: dailyStats }, { label: '📈 Estatísticas Totais', stats: totalStats }].map((item, index) => (
                            <Card key={index} className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
                                <CardContent className="p-5">
                                    <p className="text-cyan-400 font-semibold mb-2">{item.label}</p>
                                    <p className="text-lg text-gray-400">
                                        Winrate: <span className="font-bold text-green-400">{getWinrate(item.stats)}%</span>
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Derrotas: <span className="font-bold text-red-400">{100 - getWinrate(item.stats)}%</span>
                                    </p>
                                    <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mt-2 flex">
                                        <div
                                            className="h-full bg-green-400"
                                            style={{ width: `${getWinrate(item.stats)}%` }}
                                        ></div>
                                        <div
                                            className="h-full bg-red-500"
                                            style={{ width: `${100 - getWinrate(item.stats)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-green-400 text-sm mt-2">Vitórias: {item.stats.wins}</p>
                                    <p className="text-red-400 text-sm">Derrotas: {item.stats.losses}</p>
                                    <p className={`text-sm font-semibold ${item.stats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    Lucro: $ {item.stats.lucro.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
              <CardContent className="p-5">
                <p className="text-cyan-400 font-semibold mb-1">📉 ROI Total</p>
                <p className={`text-3xl font-bold ${totalStats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {roiTotalPercent.toFixed(2)}%
                </p>
                <p className={`text-sm font-semibold ${totalStats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  $ {totalStats.lucro.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10">
            <Card className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-cyan-400 font-semibold">📊 Últimas Operações</p>
                  <button className="text-sm text-cyan-400 hover:text-cyan-300 transition">Ver histórico</button>
                </div>
                {recentOrders.length === 0 ? (
                  <p className="text-gray-400">Nenhuma operação registrada hoje.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {recentOrders.slice(0, 5).map((op, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{op.symbol}</span>
                        <span className={op.status === 'WIN' ? 'text-green-400' : 'text-red-400'}>
                          {op.status === 'WIN' ? '+' : '-'}$ {op.pnl.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      )}
    </div>
  );
};
