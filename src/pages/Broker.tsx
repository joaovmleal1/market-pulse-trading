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
  const saldo = selectedWallet === 'REAL' ? wallets.REAL ?? 0 : wallets.DEMO ?? 0;

  const handleToggleWallet = () => {
    setSelectedWallet((prev) => (prev === 'REAL' ? 'DEMO' : 'REAL'));
  };

  const isReal = selectedWallet === 'REAL';
  const saldoColor = isReal ? 'text-green-400' : 'text-orange-400';
  const contaLabel = isReal ? 'Conta real' : 'Conta demo';

  return (
      <div className="min-h-screen bg-[#1E2124] text-white">
        <BrokerSidebarMenu />
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
        </main>
      </div>
  );

};
