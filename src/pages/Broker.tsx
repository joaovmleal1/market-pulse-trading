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

  return (
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        <BrokerSidebarMenu />
        <main className="pl-72 pr-6 py-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-8">
            {brokerInfo.icon && (
                <img
                    src={imageSrc}
                    alt={brokerInfo.name}
                    className="w-14 h-14 object-contain mb-4"
                />
            )}
            <h1 className="text-3xl font-bold">{brokerInfo.name ?? 'Corretora'}</h1>
          </div>

          <Card className="bg-[#151515] border border-[#1e1e1e] mb-8 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Saldo Atual</h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Conta Real</p>
                  <p className="text-2xl font-bold text-green-400">
                    {wallets.REAL !== undefined ? `R$ ${wallets.REAL.toFixed(2)}` : 'Indisponível'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Conta Demo</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {wallets.DEMO !== undefined ? `R$ ${wallets.DEMO.toFixed(2)}` : 'Indisponível'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
  );
};

export default Broker;
