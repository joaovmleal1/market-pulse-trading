import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Card, CardContent} from '@/components/ui/card';
import BrokerSidebarMenu from '@/components/ui/BrokerSidebarMenu';
import {cn} from '@/lib/utils';

export const Broker = () => {
    const {id} = useParams<{ id: string }>();
    const {accessToken} = useSelector((state: any) => state.token);

    const [wallets, setWallets] = useState<{ REAL?: number; DEMO?: number }>({});
    const [brokerInfo, setBrokerInfo] = useState<{ name?: string; icon?: string }>({});
    const [selectedWallet, setSelectedWallet] = useState<'REAL' | 'DEMO'>('REAL');
    const [botStatus, setBotStatus] = useState<number>(0);
    const [isDemo, setIsDemo] = useState<boolean>(true);
    const [roiValue, setRoiValue] = useState<number>(0);
    const [roiPercent, setRoiPercent] = useState<number>(0);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [dailyStats, setDailyStats] = useState({wins: 0, losses: 0, lucro: 0});
    const [totalStats, setTotalStats] = useState({wins: 0, losses: 0, lucro: 0});
    const [roiTotalPercent, setRoiTotalPercent] = useState<number>(0);
    const isReal = selectedWallet === 'REAL';
    const saldoColor = isReal ? 'text-green-400' : 'text-orange-400';
    const contaLabel = isReal ? 'Conta real' : 'Conta demo';

    const fetchWallets = async () => {
        if (!id) return;
        try {
            const res = await fetch(`https://api.multitradingob.com/user-brokerages/${id}`, {
                headers: {Authorization: `Bearer ${accessToken}`},
            });
            const data = await res.json();

            if (data?.api_key) {
                const decodedApiKey = atob(data.api_key);
                const walletRes = await fetch('https://broker-api.mybroker.dev/token/wallets', {
                    headers: {'api-token': decodedApiKey},
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
                headers: {Authorization: `Bearer ${accessToken}`},
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
                headers: {Authorization: `Bearer ${accessToken}`},
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
                headers: {Authorization: `Bearer ${accessToken}`},
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

            setDailyStats({wins, losses, lucro});

            const total = data.reduce((acc: number, op: any) => acc + op.pnl, 0);
            setRoiValue(lucro);
            setRoiPercent(total ? (lucro / total) * 100 : 0);
        } catch {
            setRecentOrders([]);
            setDailyStats({wins: 0, losses: 0, lucro: 0});
            setRoiValue(0);
            setRoiPercent(0);
        }
    };

    const fetchAllTrades = async () => {
        if (!id) return;
        try {
            const res = await fetch(`https://api.multitradingob.com/trade-order-info/all/${id}`, {
                headers: {Authorization: `Bearer ${accessToken}`},
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

            setTotalStats({wins, losses, lucro});

            const total = data.reduce((acc: number, op: any) => acc + op.pnl, 0);
            setRoiTotalPercent(total ? (lucro / total) * 100 : 0);
        } catch {
            setTotalStats({wins: 0, losses: 0, lucro: 0});
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
                method: 'POST',
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
            if (accessToken) {
                fetchWallets();
                fetchBrokerInfo();
                fetchBotOptions();
                fetchTradeOrders();
                fetchAllTrades();
            }
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
            <div className="min-h-screen bg-[#1E2124] text-white">
                <BrokerSidebarMenu/>
                <main className="pl-72 pr-6 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card
                            className="bg-[#2a2d32]/80 backdrop-blur-md border border-[#24C3B5]/30 rounded-2xl shadow-md shadow-[#24C3B5]/10">
                            <CardContent className="p-6 space-y-2">
                                <p className="text-gray-400 text-sm">Saldo disponível</p>
                                <p className={`text-3xl font-bold ${saldoColor}`}>R$ {saldo.toFixed(2)}</p>
                                <p className="text-gray-400 text-sm">{contaLabel}</p>
                                <button
                                    onClick={handleToggleWallet}
                                    className="mt-4 w-full px-4 py-2 bg-[#24C3B5]/20 hover:bg-[#24C3B5]/30 text-[#24C3B5] rounded-xl border border-[#24C3B5]/40 transition"
                                >
                                    Trocar para {isReal ? 'Demo' : 'Real'}
                                </button>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-[#2a2d32]/80 backdrop-blur-md border border-[#24C3B5]/30 rounded-2xl shadow-md shadow-[#24C3B5]/10 flex flex-col justify-between">
                            <CardContent className="p-6 space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-[#24C3B5] font-semibold">🤖 Status do Bot</p>
                                    <span
                                        className={`px-3 py-1 text-sm rounded-full ${
                                            botStatus === 1 ? 'bg-[#3ECF8E]' : 'bg-[#FF6B6B]'
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
                                        className="w-20 h-20 object-contain mx-auto mt-4"
                                    />
                                )}
                                <button
                                    onClick={toggleBot}
                                    className={`mt-4 w-full px-4 py-2 rounded-xl font-semibold transition text-white ${
                                        botStatus === 1 ? 'bg-[#FF6B6B] hover:bg-red-500' : 'bg-[#3ECF8E] hover:bg-emerald-500'
                                    }`}
                                >
                                    {botStatus === 1 ? 'Parar bot' : 'Ativar bot'}
                                </button>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-[#2a2d32]/80 backdrop-blur-md border border-[#24C3B5]/30 rounded-2xl shadow-md shadow-[#24C3B5]/10">
                            <CardContent className="p-6">
                                <p className="text-[#24C3B5] font-semibold mb-2">📈 ROI Diário</p>
                                <p className={`text-3xl font-bold ${roiValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>{roiPercent.toFixed(2)}%</p>
                                <p className="text-sm text-gray-400 mt-2">Lucro: <span
                                    className={`font-bold ${roiValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>R$ {roiValue.toFixed(2)}</span>
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        {[{label: '📊 Estatísticas Diárias', stats: dailyStats}, {
                            label: '📈 Estatísticas Totais',
                            stats: totalStats
                        }].map((item, index) => (
                            <Card key={index}
                                  className="bg-[#2a2d32]/80 backdrop-blur-md border border-[#24C3B5]/30 rounded-2xl shadow-md shadow-[#24C3B5]/10">
                                <CardContent className="p-6">
                                    <p className="text-[#24C3B5] font-semibold mb-2">{item.label}</p>
                                    <div className="mb-2">
                                        <p className="text-lg">Winrate: <span
                                            className="text-white font-bold">{getWinrate(item.stats)}%</span></p>
                                        <div className="w-full h-3 bg-[#2C2F33] rounded-full mt-1">
                                            <div
                                                className="h-3 rounded-full bg-green-400"
                                                style={{width: `${getWinrate(item.stats)}%`}}
                                            ></div>
                                        </div>
                                    </div>
                                    <p className="text-green-400 text-sm">Vitórias: {item.stats.wins}</p>
                                    <p className="text-red-400 text-sm">Derrotas: {item.stats.losses}</p>
                                    <p className={`text-sm font-semibold ${item.stats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>Lucro:
                                        R$ {item.stats.lucro.toFixed(2)}</p>
                                </CardContent>
                            </Card>
                        ))}

                        <Card
                            className="bg-[#2a2d32]/80 backdrop-blur-md border border-[#24C3B5]/30 rounded-2xl shadow-md shadow-[#24C3B5]/10">
                            <CardContent className="p-6">
                                <p className="text-[#24C3B5] font-semibold mb-2">📉 ROI Total</p>
                                <p className={`text-3xl font-bold ${totalStats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>{roiTotalPercent.toFixed(2)}%</p>
                                <p className={`text-sm font-semibold ${totalStats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>R$ {totalStats.lucro.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-10">
                        <Card
                            className="bg-[#2a2d32]/80 backdrop-blur-md border border-[#24C3B5]/30 rounded-2xl shadow-md shadow-[#24C3B5]/10">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-[#24C3B5] font-semibold">📊 Últimas Operações</p>
                                    <button className="text-sm text-blue-400 hover:underline">Ver histórico</button>
                                </div>
                                {recentOrders.length === 0 ? (
                                    <p className="text-gray-400">Nenhuma operação registrada hoje.</p>
                                ) : (
                                    <ul className="space-y-2 text-sm">
                                        {recentOrders.slice(0, 5).map((op, idx) => (
                                            <li key={idx} className="flex justify-between">
                                                <span>{op.symbol}</span>
                                                <span
                                                    className={op.status === 'WIN' ? 'text-green-400' : 'text-red-400'}>
                        {op.status === 'WIN' ? '+' : '-'}R$ {op.pnl.toFixed(2)}
                      </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        );
    };