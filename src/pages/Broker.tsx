import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import BrokerSidebarMenu from '@/components/ui/BrokerSidebarMenu';

const Broker = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useSelector((state: any) => state.token);

  const [wallets, setWallets] = useState<{ REAL?: number; DEMO?: number }>({});
  const [brokerInfo, setBrokerInfo] = useState<{ name?: string; icon?: string }>({});
  const [selectedWallet, setSelectedWallet] = useState<'REAL' | 'DEMO'>('REAL');

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

  useEffect(() => {
    if (accessToken) {
      fetchWallets();
      fetchBrokerInfo();
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

  const isDemo = selectedWallet === 'DEMO';
  const balance = isDemo ? wallets.DEMO : wallets.REAL;
  const balanceColor = isDemo ? 'text-yellow-400' : 'text-green-400';
  const buttonClasses = (type: 'REAL' | 'DEMO') =>
      `px-4 py-2 rounded-md font-semibold transition-all ${
          selectedWallet === type
              ? 'bg-[#24C3B5] text-black'
              : 'bg-[#1E1E1E] text-white hover:bg-[#2A2A2A]'
      }`;

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#111] via-[#0d0d0d] to-black text-white">
        <BrokerSidebarMenu />
        <main className="pl-72 pr-6 py-8 max-w-6xl mx-auto">
          {/* Nome e Logo da Corretora */}
          <div className="flex flex-col items-center justify-center mb-10">
            {brokerInfo.icon && (
                <img
                    src={imageSrc}
                    alt={brokerInfo.name}
                    className="w-14 h-14 object-contain mb-3"
                />
            )}
            <h1 className="text-3xl font-bold text-white">{brokerInfo.name ?? 'Corretora'}</h1>
          </div>

          {/* Wallet Card com Toggle */}
          <Card className="bg-[#1A1A1A] border border-[#2C2F33] shadow-md mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3">
                  <button onClick={() => setSelectedWallet('REAL')} className={buttonClasses('REAL')}>
                    Conta Real
                  </button>
                  <button onClick={() => setSelectedWallet('DEMO')} className={buttonClasses('DEMO')}>
                    Conta Demo
                  </button>
                </div>
                <span className="text-sm text-gray-300">Alternar visualização de saldo</span>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm">Saldo Atual</p>
                <p className={`text-3xl font-bold ${balanceColor}`}>
                  {balance !== undefined ? `R$ ${balance.toFixed(2)}` : 'Indisponível'}
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
  );
};

export default Broker;