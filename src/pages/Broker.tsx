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

            let lucro = 0;
            for (const op of data) {
                if (op.status === 'WIN') lucro += op.price;
                if (op.status === 'LOSS') lucro -= op.price;
            }

            const total = data.reduce((acc: number, op: any) => acc + op.price, 0);
            setRoiValue(lucro);
            setRoiPercent(total ? (lucro / total) * 100 : 0);
        } catch {
            setRecentOrders([]);
            setRoiValue(0);
            setRoiPercent(0);
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
        }
    }, [accessToken]);

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
            {op.status === 'WIN' ? '+' : '-'}R$ {op.price.toFixed(2)}
          </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );

};
