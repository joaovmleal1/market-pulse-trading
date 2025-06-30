import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import BrokerSidebarMenu from '@/components/ui/BrokerSidebarMenu';
import { Button } from '@/components/ui/button';
import { Repeat } from 'lucide-react';

const Broker = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useSelector((state: any) => state.token);

  const [wallets, setWallets] = useState<{ REAL?: number; DEMO?: number }>({});
  const [brokerInfo, setBrokerInfo] = useState<{ name?: string; icon?: string }>({});
  const [currentWallet, setCurrentWallet] = useState<'REAL' | 'DEMO'>('DEMO');

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

  const toggleWallet = () => {
    setCurrentWallet(prev => (prev === 'REAL' ? 'DEMO' : 'REAL'));
  };

  return (
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        <BrokerSidebarMenu />
        <main className="pl-72 pr-6 py-8 max-w-6xl mx-auto">
          {/* Nome e Logo da Corretora */}
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

          {/* Card de Wallet Ativa com Botão de Alternar */}
          <Card className="bg-[#151515] border border-[#1e1e1e] mb-8 shadow-md">
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Bem-vindo(a),</p>
                <p className="text-3xl font-bold text-orange-400">
                  {wallets[currentWallet] !== undefined
                      ? `R$ ${wallets[currentWallet]?.toFixed(2)}`
                      : 'Indisponível'}
                </p>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                  Conta {currentWallet.toLowerCase()}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-xs text-gray-500 mb-2">ID:</p>
                <Button
                    onClick={toggleWallet}
                    className="text-green-400 border border-green-500 bg-transparent hover:bg-green-600 hover:text-white"
                >
                  <Repeat className="w-4 h-4 mr-2" />
                  Trocar para {currentWallet === 'REAL' ? 'Demo' : 'Real'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
  );
};

export default Broker;
