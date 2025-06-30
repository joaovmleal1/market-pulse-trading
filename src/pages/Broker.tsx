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
        icon: data?.brokerage_icon, // espera-se algo como "xofre.png"
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

  return (
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        <BrokerSidebarMenu />
        <main className="pl-72 pr-6 py-8 max-w-6xl mx-auto">
          {/* Nome e Logo da Corretora */}
          <div className="flex flex-col items-center justify-center mb-8">
            {brokerInfo.icon && (
                <img
                    src={`/assets/imgs/${brokerInfo.icon}`}
                    alt={brokerInfo.name}
                    className="w-20 h-20 object-contain mb-2"
                />
            )}
            <h1 className="text-3xl font-bold">{brokerInfo.name ?? 'Corretora'}</h1>
          </div>

          {/* Card de Wallets */}
          <Card className="bg-[#151515] border border-[#1e1e1e] mb-8 shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Saldo Conta Real</p>
                  <p className="text-2xl font-bold text-green-400">
                    {wallets.REAL !== undefined ? `R$ ${wallets.REAL.toFixed(2)}` : 'Indisponível'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Saldo Conta Demo</p>
                  <p className="text-2xl font-bold text-yellow-400">
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
