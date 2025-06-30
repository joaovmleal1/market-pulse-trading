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

  const fetchWallets = async () => {
    if (!id) return;
    try {
      const res = await fetch(`https://api.multitradingob.com/user-brokerages/user_brokerages/${id}`, {
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
  const saldo = selectedWallet === 'REAL' ? wallets.REAL ?? 0 : wallets.DEMO ?? 0;

  const handleToggleWallet = () => {
    setSelectedWallet((prev) => (prev === 'REAL' ? 'DEMO' : 'REAL'));
  };

  return (
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        <BrokerSidebarMenu />
        <main className="pl-72 pr-6 py-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-8">
            {brokerInfo.icon && (
                <img
                    src={imageSrc}
                    alt={brokerInfo.name}
                    className="w-14 h-14 object-contain mb-3"
                />
            )}
            <h1 className="text-2xl font-semibold text-white">{brokerInfo.name}</h1>
          </div>

          {/* Card das Wallets com botão único para alternar */}
          <Card className="bg-[#151515] border border-[#2C2F33] shadow-md mb-10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-base text-gray-300 font-medium">
                  Visualizando:{" "}
                  <span className={cn(
                      'font-bold',
                      selectedWallet === 'REAL' ? 'text-green-400' : 'text-yellow-400'
                  )}>
                  Conta {selectedWallet === 'REAL' ? 'Real' : 'Demo'}
                </span>
                </p>

                <button
                    onClick={handleToggleWallet}
                    className={cn(
                        'px-4 py-2 text-sm rounded-md font-semibold transition duration-150',
                        selectedWallet === 'REAL'
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                            : 'bg-green-500 text-black hover:bg-green-400'
                    )}
                >
                  {selectedWallet === 'REAL' ? 'Ver Conta Demo' : 'Ver Conta Real'}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-200 mb-1">Saldo Atual</p>
                <p className={cn(
                    'text-4xl font-bold tracking-wide',
                    selectedWallet === 'REAL' ? 'text-green-400' : 'text-yellow-400'
                )}>
                  R$ {saldo.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
  );
};