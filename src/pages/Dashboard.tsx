import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SidebarMenu from '@/components/ui/SidebarMenu';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

interface Brokerage {
  id: number;
  brokerage_name: string;
  brokerage_route: string;
  brokerage_icon: string;
}

interface BotOptions {
  bot_status: number;
  win_value: number;
  loss_value: number;
}

interface Trade {
  symbol: string;
  order_type: string;
  quantity: number;
  price: number;
  status: string;
  date_time: string;
}

const imageMap = import.meta.glob('@/assets/imgs/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const getImagePath = (filename: string) => {
  const entry = Object.entries(imageMap).find(([key]) => key.endsWith(filename));
  return entry ? entry[1] : '';
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accessToken } = useSelector((state: any) => state.token);

  const [brokers, setBrokers] = useState<Brokerage[]>([]);
  const [data, setData] = useState<Record<number, { bot?: BotOptions; lastTrade?: Trade }>>({});
  const [showTelegramAlert, setShowTelegramAlert] = useState(false);

  const [isLive, setIsLive] = useState(false);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const prevLiveStatus = useRef(false);

  useEffect(() => {
    const hasJoinedTelegram = localStorage.getItem('hasJoinedTelegram');
    if (!hasJoinedTelegram) {
      setShowTelegramAlert(true);
    }
  }, []);

  const handleConfirmTelegram = () => {
    localStorage.setItem('hasJoinedTelegram', 'true');
    setShowTelegramAlert(false);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchLiveStatus = async () => {
      try {
        const basicUser = import.meta.env.VITE_BASIC_AUTH_USER;
        const basicPass = import.meta.env.VITE_BASIC_AUTH_PASS;
        const credentials = btoa(`${basicUser}:${basicPass}`);

        const res = await fetch('https://api.multitradingob.com/site-options/all', {
          method: 'GET',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Erro ao buscar opções do site: ${res.status}`);

        const data: Array<{ key_name: string; key_value: string }> = await res.json();
        const map = Object.fromEntries(data.map(opt => [opt.key_name, opt.key_value]));

        const isLiveRaw = String(map['is_live'] ?? '').trim().toLowerCase();
        const liveBool = isLiveRaw === 'true' || isLiveRaw === '1';
        const url = map['live_url'] ? String(map['live_url']).trim() : '';

        setIsLive(liveBool);
        setLiveUrl(url);

        if (!prevLiveStatus.current && liveBool) {
          toast.success('🚨 A Live começou! Clique para entrar.', {
            action: url
              ? { label: 'Entrar', onClick: () => window.open(url, '_blank') }
              : undefined,
          });
        }
        prevLiveStatus.current = liveBool;

      } catch (err) {
        if ((err as any)?.name !== 'AbortError') {
          console.error('Erro ao buscar status da live:', err);
        }
      }
    };

    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 30000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    fetch('https://api.multitradingob.com/brokerages', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then(setBrokers)
      .catch(console.error);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || brokers.length === 0) return;

    brokers.forEach((b) => {
      fetch(`https://api.multitradingob.com/bot-options/${b.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((bot) => setData((prev) => ({ ...prev, [b.id]: { ...prev[b.id], bot } })))
        .catch(console.error);

      fetch(`https://api.multitradingob.com/trade-order-info/today/${b.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((trades: Trade[]) => {
          const last = trades.sort(
            (a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
          )[0];
          setData((prev) => ({ ...prev, [b.id]: { ...prev[b.id], lastTrade: last } }));
        })
        .catch(console.error);
    });
  }, [accessToken, brokers]);

  const getStatusLabel = (status: number | undefined) => {
    switch (status) {
      case 1:
        return 'Operando';
      case 0:
        return 'Parado';
      case 2:
        return 'Stop Win';
      case 3:
        return 'Stop Loss';
      default:
        return '—';
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-gray-200 flex flex-col lg:flex-row">
      <SidebarMenu />
      <div className="flex-1 p-4 md:p-6 lg:pl-72">
        <div className="flex justify-end mb-6">
          <div className="bg-[#1E1E1E] px-4 py-2 rounded-md border border-cyan-500/20 text-sm md:text-base">
            Olá, <span className="text-cyan-400 font-semibold">{user?.complete_name}</span>
          </div>
        </div>

        {showTelegramAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-[#1E293B] p-6 rounded-xl border border-cyan-500/20 shadow-xl max-w-sm text-center">
              <h3 className="text-xl font-bold mb-3 text-cyan-400">Entre no Canal do Telegram</h3>
              <p className="text-sm text-gray-300 mb-4">
                Para acompanhar as novidades, alertas e sinais, entre no nosso canal oficial do Telegram.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://t.me/+b4uPhME4zSw1MWFh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-2 rounded transition-all"
                >
                  Acessar Canal
                </a>
                <Button onClick={handleConfirmTelegram} className="bg-gray-700 hover:bg-gray-600">
                  Já entrei
                </Button>
              </div>
            </div>
          </div>
        )}

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-200">Minhas Corretoras</h2>
          <p className="text-gray-500 text-sm">Informações gerais por corretora</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {brokers.map((b, i) => {
            const info = data[b.id] || {};
            const imageSrc = getImagePath(b.brokerage_icon);
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Card className="bg-[#1E293B] border border-cyan-500/20 rounded-xl hover:bg-gray-700 transition-all duration-300">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <img src={imageSrc} alt={b.brokerage_name} className="w-14 h-14 object-contain mb-3" />
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-cyan-400">{b.brokerage_name}</h3>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>
                        <span className="text-gray-500">Status:</span>{' '}
                        <span className="text-gray-200">{getStatusLabel(info.bot?.bot_status)}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Lucro:</span>{' '}
                        <span className="text-cyan-400">R$ {info.bot?.win_value?.toFixed(2) ?? '0.00'}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Perdas:</span>{' '}
                        <span className="text-red-400">R$ {info.bot?.loss_value?.toFixed(2) ?? '0.00'}</span>
                      </p>
                      {info.lastTrade && (
                        <p>
                          <span className="text-gray-500">Última:</span>{' '}
                          {info.lastTrade.symbol} — {info.lastTrade.status}
                        </p>
                      )}
                    </div>
                    <Button
                      className="mt-4 w-full bg-cyan-500 hover:bg-cyan-400 text-white transition-all"
                      onClick={() => navigate(`/broker/${b.id}`)}
                    >
                      Operar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
