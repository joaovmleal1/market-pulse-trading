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

            setDailyStats({ wins, losses, lucro });

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

            setTotalStats({ wins, losses, lucro });

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

        try {
            const res = await fetch(url);
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

    const isReal = selectedWallet === 'REAL';
    const saldoColor = isReal ? 'text-green-400' : 'text-orange-400';
    const contaLabel = isReal ? 'Conta real' : 'Conta demo';

    return (
        <div className="min-h-screen bg-[#1E2124] text-white">
            <BrokerSidebarMenu/>
            <main className="pl-72 pr-4 py-8"> {/* ← padding direito reduzido */}
                <div className="flex flex-col mb-6">
                    <div className="flex flex-col items-center mb-4">
                        {brokerInfo.icon && (
                            <img
                                src={imageSrc}
                                alt={brokerInfo.name}
                                className="w-14 h-14 object-contain mb-3"
                            />
                        )}
                        <h1 className="text-2xl font-semibold text-white">{brokerInfo.name}</h1>
                    </div>

                    {/* Card ocupa toda a largura possível */}
                    <Card className="bg-[#16191C] border border-[#24C3B5]/20 shadow-sm w-full">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-400 mb-1">Seu saldo disponível</span>
                                <span className={`text-3xl font-bold ${isReal ? 'text-green-400' : 'text-orange-400'}`}>
                R$ {saldo.toFixed(2)}
              </span>
                                <span className="text-sm text-gray-400 mt-1">{contaLabel}</span>
                            </div>
                            <button
                                onClick={handleToggleWallet}
                                className="px-4 py-2 rounded-lg bg-[#1F332B] text-green-400 hover:bg-[#24C3B5]/10 transition border border-[#24C3B5]/40"
                            >
                                Trocar para {isReal ? 'Demo' : 'Real'}
                            </button>
                        </CardContent>
                    </Card>
                </div>

                {/* GRID DOS 3 CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* CARD 1 - Status do Bot */}
                    <Card className="bg-[#16191C] border border-[#24C3B5]/20 p-4">
                        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span className="text-[#24C3B5]">🤖 Status do Bot</span>
                            <span
                                className={`ml-auto text-sm px-2 py-1 rounded-full ${
                                    botStatus === 1 ? 'bg-green-600' : 'bg-red-600'
                                } text-white`}
                            >
      {botStatus === 1 ? 'Ativo' : 'Parado'}
    </span>
                        </h2>

                        <p className="text-sm text-gray-400 mb-2">Tipo de conta:</p>
                        <span className="text-orange-400 text-sm mb-4">{isDemo ? 'Conta demo' : 'Conta real'}</span>

                        {brokerInfo.icon && (
                            <img src={imageSrc} alt="Logo corretora" className="w-24 h-auto mb-4"/>
                        )}

                        <button
                            onClick={toggleBot}
                            className={`mt-2 w-full py-2 rounded-md text-sm font-semibold transition ${
                                botStatus === 1
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {botStatus === 1 ? 'Parar bot' : 'Ativar bot'}
                        </button>
                    </Card>

                    {/* CARD 2 - ROI */}
                    <Card className="bg-[#16191C] border border-[#24C3B5]/20 p-4">
                        <h2 className="text-lg font-semibold mb-2 flex justify-between">
                            <span className="text-[#24C3B5]">📈 ROI</span>
                            <span className="text-sm text-gray-400">Hoje</span>
                        </h2>
                        <p className={`text-2xl font-bold ${roiValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {roiPercent.toFixed(2)}%
                        </p>
                        <div className="mt-2 text-sm text-gray-400">Lucro Acumulado</div>
                        <div className={`text-lg font-bold ${roiValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            R$ {roiValue.toFixed(2)}
                        </div>
                    </Card>

                    {/* CARD 3 - Operações Recentes */}
                    <Card className="bg-[#16191C] border border-[#24C3B5]/20 p-4">
                        <h2 className="text-lg font-semibold mb-2 flex justify-between">
                            <span className="text-[#24C3B5]">📊 Operações Recentes</span>
                            <span className="text-sm text-blue-400 cursor-pointer hover:underline">Ver histórico</span>
                        </h2>
                        <div className="space-y-2 text-sm">
                            {recentOrders.length === 0 && <p className="text-gray-400">Nenhuma operação hoje.</p>}
                            {recentOrders.slice(0, 5).map((op, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <div className="flex gap-2">
                                        <span>{op.symbol}</span>
                                        <span className="text-gray-500">
              ({new Date(op.date_time).toLocaleDateString()})
            </span>
                                    </div>
                                    <span className={op.status === 'WIN' ? 'text-green-400' : 'text-red-400'}>
            {op.status === 'WIN' ? '+' : '-'}R$ {op.pnl.toFixed(2)}
          </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                {/* Estatísticas e performance diárias */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {/* Estatísticas de Trading */}
                    <Card className="bg-[#16191C] border border-[#24C3B5]/20 p-4">
                        <h2 className="text-lg font-semibold mb-4 text-[#24C3B5]">📊 Estatísticas de Trading</h2>
                        <div className="mb-2">
                            <p className="text-xl font-bold text-white">{getWinrate(dailyStats)}%</p>
                            <div className="w-full bg-[#2C2F33] h-3 rounded mt-2">
                                <div
                                    className="bg-green-400 h-3 rounded"
                                    style={{width: `${getWinrate(dailyStats)}%`}}
                                />
                            </div>
                        </div>
                        <div className="mt-4 text-sm space-y-1">
                            <p className="text-green-400">Vitórias: {dailyStats.wins}</p>
                            <p className="text-red-400">Derrotas: {dailyStats.losses}</p>
                            <p className="text-gray-300">Total: {dailyStats.wins + dailyStats.losses}</p>
                            <p className={`font-semibold ${dailyStats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                Lucro: R$ {dailyStats.lucro.toFixed(2)}
                            </p>
                        </div>
                    </Card>

                    {/* Performance diária */}
                    <Card className="bg-[#16191C] border border-[#24C3B5]/20 p-4">
                        <h2 className="text-lg font-semibold mb-4 text-[#24C3B5]">📈 Performance</h2>
                        <p className="text-sm text-green-400 mb-1">
                            Vitórias ({getWinrate(dailyStats)}%)
                        </p>
                        <div className="w-full bg-[#2C2F33] h-3 rounded mb-4">
                            <div
                                className="bg-green-400 h-3 rounded"
                                style={{width: `${getWinrate(dailyStats)}%`}}
                            />
                        </div>
                        <p className="text-sm text-red-400 mb-1">
                            Derrotas ({100 - getWinrate(dailyStats)}%)
                        </p>
                        <div className="w-full bg-[#2C2F33] h-3 rounded mb-2">
                            <div
                                className="bg-red-400 h-3 rounded"
                                style={{width: `${100 - getWinrate(dailyStats)}%`}}
                            />
                        </div>
                        <p className="text-sm text-gray-400">
                            {dailyStats.wins + dailyStats.losses} Total Operações
                        </p>
                    </Card>
                </div>

                {/* Estatísticas totais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {/* Estatísticas totais */}
                    <Card className="bg-[#16191C] border border-[#24C3B5]/20 p-4">
                        <h2 className="text-lg font-semibold mb-4 text-[#24C3B5]">📊 Estatísticas Totais</h2>
                        <div className="mb-2">
                            <p className="text-xl font-bold text-white">{getWinrate(totalStats)}%</p>
                            <div className="w-full bg-[#2C2F33] h-3 rounded mt-2">
                                <div
                                    className="bg-green-400 h-3 rounded"
                                    style={{width: `${getWinrate(totalStats)}%`}}
                                />
                            </div>
                        </div>
                        <div className="mt-4 text-sm space-y-1">
                            <p className="text-green-400">Vitórias: {totalStats.wins}</p>
                            <p className="text-red-400">Derrotas: {totalStats.losses}</p>
                            <p className="text-gray-300">Total: {totalStats.wins + totalStats.losses}</p>
                            <p className={`font-semibold ${totalStats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                Lucro: R$ {totalStats.lucro.toFixed(2)}
                            </p>
                        </div>
                    </Card>

                    {/* Performance total */}
                    <Card className="bg-[#16191C] border border-[#24C3B5]/20 p-4">
                        <h2 className="text-lg font-semibold mb-4 text-[#24C3B5]">📈 Performance Total</h2>
                        <p className="text-sm text-green-400 mb-1">
                            Vitórias ({getWinrate(totalStats)}%)
                        </p>
                        <div className="w-full bg-[#2C2F33] h-3 rounded mb-4">
                            <div
                                className="bg-green-400 h-3 rounded"
                                style={{width: `${getWinrate(totalStats)}%`}}
                            />
                        </div>
                        <p className="text-sm text-red-400 mb-1">
                            Derrotas ({100 - getWinrate(totalStats)}%)
                        </p>
                        <div className="w-full bg-[#2C2F33] h-3 rounded mb-2">
                            <div
                                className="bg-red-400 h-3 rounded"
                                style={{width: `${100 - getWinrate(totalStats)}%`}}
                            />
                        </div>
                        <p className="text-sm text-gray-400">
                            {totalStats.wins + totalStats.losses} Total Operações
                        </p>
                    </Card>

                    {/* ROI total */}
                    <Card className="bg-[#16191C] border border-[#24C3B5]/20 p-4">
                        <h2 className="text-lg font-semibold mb-4 text-[#24C3B5]">📉 ROI Total</h2>
                        <p className={`text-3xl font-bold ${totalStats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {roiTotalPercent.toFixed(2)}%
                        </p>
                        <p className={`text-lg mt-2 ${totalStats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            R$ {totalStats.lucro.toFixed(2)}
                        </p>
                    </Card>
                </div>

            </main>
        </div>
    );

};
