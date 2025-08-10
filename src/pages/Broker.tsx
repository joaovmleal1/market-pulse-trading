// src/pages/Broker.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import BrokerSidebarMenu from '@/components/ui/BrokerSidebarMenu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BrokerageInfo {
  name?: string;
  icon?: string;
}
interface BotOptions {
  bot_status?: number;
  is_demo?: boolean;
  user_id?: number | null;
}
interface TradeOrder {
  status?: string;
  pnl: number;
  symbol?: string;
}

export const Broker = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useSelector((state: any) => state.token);
  const navigate = useNavigate();

  const [wallets, setWallets] = useState<{ REAL?: number; DEMO?: number }>({});
  const [brokerInfo, setBrokerInfo] = useState<BrokerageInfo>({});
  const [selectedWallet, setSelectedWallet] = useState<'REAL' | 'DEMO'>('REAL');
  const [botStatus, setBotStatus] = useState<number>(0);
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [recentOrders, setRecentOrders] = useState<TradeOrder[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [dailyStats, setDailyStats] = useState({ wins: 0, losses: 0, lucro: 0 });
  const [totalStats, setTotalStats] = useState({ wins: 0, losses: 0, lucro: 0 });
  const [roiValue, setRoiValue] = useState<number>(0);
  const [roiPercent, setRoiPercent] = useState<number>(0);
  const [roiTotalPercent, setRoiTotalPercent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // ---------- LIVE TOAST ----------
  const [isLive, setIsLive] = useState(false);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const prevLive = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchLiveStatus = async () => {
      try {
        const basicUser = import.meta.env.VITE_BASIC_AUTH_USER;
        const basicPass = import.meta.env.VITE_BASIC_AUTH_PASS;
        const credentials = btoa(`${basicUser}:${basicPass}`);

        const res = await fetch('https://api.multitradingob.com/site-options/all', {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`site-options ${res.status}`);
        const data: Array<{ key_name: string; key_value: string }> = await res.json();
        const map = Object.fromEntries(data.map((o) => [o.key_name, o.key_value]));
        const isLiveRaw = String(map['is_live'] ?? '').trim().toLowerCase();
        const live = isLiveRaw === 'true' || isLiveRaw === '1';
        const url = (map['live_url'] || '').toString().trim();

        setIsLive(live);
        setLiveUrl(url || null);

        if (!prevLive.current && live) {
          toast.success('🚨 A Live começou! Clique para entrar.', {
            action: {
              label: 'Entrar',
              onClick: () => window.open(url || '', '_blank'),
            },
          });
        }
        prevLive.current = live;
      } catch {
        // silencioso
      }
    };

    fetchLiveStatus();
    const iv = setInterval(fetchLiveStatus, 30000);
    return () => {
      controller.abort();
      clearInterval(iv);
    };
  }, []);
  // --------------------------------

  // --- assets helper ---
  const imageMap = import.meta.glob('@/assets/imgs/*', { eager: true, import: 'default' }) as Record<
    string,
    string
  >;
  const getImagePath = (filename?: string) => {
    if (!filename) return '';
    const entry = Object.entries(imageMap).find(([key]) => key.endsWith(filename));
    return entry ? entry[1] : '';
  };

  // ---------- CARTEIRAS ----------
  function normalizeWallets(payload: any): { REAL?: number; DEMO?: number } {
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.balances)
      ? payload.balances
      : [];

    let REAL: number | undefined;
    let DEMO: number | undefined;

    for (const w of list) {
      const t = String(w.type || w.account_type || '').toLowerCase();
      const valRaw = w.amount ?? w.balance ?? w.value;
      const val = typeof valRaw === 'number' ? valRaw : Number(valRaw);
      if (t === 'real') REAL = val;
      if (t === 'demo') DEMO = val;
    }

    if (!list.length && typeof payload === 'object' && payload) {
      const maybeReal = payload.REAL ?? payload.real;
      const maybeDemo = payload.DEMO ?? payload.demo;
      if (maybeReal != null) REAL = Number(maybeReal);
      if (maybeDemo != null) DEMO = Number(maybeDemo);
    }

    return { REAL, DEMO };
  }

  const fetchWallets = async () => {
    if (!id) return;

    try {
      // 1) user-brokerages
      const ubRes = await fetch(`https://api.multitradingob.com/user-brokerages/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!ubRes.ok) throw new Error(`Falha user-brokerages: ${ubRes.status}`);
      const ubData = await ubRes.json();

      // 2) nome da corretora defensivo
      let rawName =
        ubData?.brokerage_name ??
        ubData?.brokerage?.brokerage_name ??
        ubData?.brokerage?.name ??
        '';
      rawName = String(rawName).trim();

      if (!rawName) {
        const brokerageId = ubData?.brokerage_id;
        if (brokerageId) {
          try {
            const bRes = await fetch(`https://api.multitradingob.com/brokerages/${brokerageId}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (bRes.ok) {
              const bData = await bRes.json();
              rawName = String(bData?.brokerage_name ?? bData?.name ?? '').trim();
            }
          } catch {}
        }
      }

      const nameKey = rawName.toUpperCase();

      // 3) XOFRE → via proxy interno GET /internal/xofre/wallets
      if (nameKey === 'XOFRE') {
        const apiKeyB64: string | undefined = ubData?.api_key ?? ubData?.api_token;
        if (!apiKeyB64) {
          console.warn('[wallets] XOFRE sem api_key/api_token no user-brokerages');
          setWallets({});
          return;
        }
        const res = await fetch('/internal/xofre/wallets', {
          headers: { 'X-Api-Key': apiKeyB64 },
        });
        if (!res.ok) throw new Error(`XOFRE wallets falhou: ${res.status}`);
        const walletData = await res.json();

        // normaliza
        const { REAL, DEMO } = normalizeWallets(walletData);
        setWallets({
          REAL: REAL ?? 0,
          DEMO: DEMO ?? 0,
        });
        return;
      }

      // 4) Avalon/Polarium → via proxy interno POST
      if (nameKey !== 'AVALON' && nameKey !== 'POLARIUM') {
        console.warn('Corretora não configurada:', rawName);
        setWallets({});
        return;
      }

      const email = ubData?.brokerage_username;
      const password = ubData?.brokerage_password;
      if (!email || !password) {
        console.warn('[wallets] Credenciais ausentes para', rawName, { email: !!email, password: !!password });
        setWallets({});
        return;
      }

      const balanceUrl =
        nameKey === 'AVALON'
          ? '/internal/avalon/balance'
          : '/internal/polarium/balance';

      const res = await fetch(balanceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(`${nameKey} balance falhou: ${res.status}`);
      const data = await res.json();

      const { REAL, DEMO } = normalizeWallets(data);
      setWallets({
        REAL: REAL ?? 0,
        DEMO: DEMO ?? 0,
      });
    } catch (err) {
      console.error('Erro ao buscar wallets:', err);
      setWallets({});
    }
  };
  // --------------------------------

  const fetchBrokerInfo = async () => {
    if (!id) return;
    try {
      const res = await fetch(`https://api.multitradingob.com/brokerages/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setBrokerInfo({ name: data?.brokerage_name, icon: data?.brokerage_icon });
    } catch {
      setBrokerInfo({});
    }
  };

  const fetchBotOptions = async () => {
    if (!id) return;
    try {
      const res = await fetch(`https://api.multitradingob.com/bot-options/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data: BotOptions = await res.json();
      setBotStatus(data?.bot_status ?? 0);
      setIsDemo(data?.is_demo ?? true);
      setUserId(data?.user_id ?? null);
    } catch {
      setBotStatus(0);
      setIsDemo(true);
    }
  };

  const fetchTodayTrades = async () => {
    if (!id) return;
    try {
      const res = await fetch(`https://api.multitradingob.com/trade-order-info/today/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data: TradeOrder[] = await res.json();
      setRecentOrders(data);

      let wins = 0;
      let losses = 0;
      let lucro = 0;
      data.forEach((op) => {
        const s = op.status?.toUpperCase();
        if (s?.includes('WON')) {
          wins++;
          lucro += op.pnl;
        } else if (s?.includes('LOST')) {
          losses++;
          lucro -= op.pnl;
        }
      });
      setDailyStats({ wins, losses, lucro });

      const total = data.reduce((acc, op) => acc + op.pnl, 0);
      setRoiValue(lucro);
      setRoiPercent(total ? (lucro / total) * 100 : 0);
    } catch {
      setRecentOrders([]);
      setDailyStats({ wins: 0, losses: 0, lucro: 0 });
      setRoiValue(0);
      setRoiPercent(0);
    }
  };

  const fetchAllTrades = async () => {
    if (!id) return;
    try {
      const res = await fetch(`https://api.multitradingob.com/trade-order-info/all/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data: TradeOrder[] = await res.json();

      let wins = 0;
      let losses = 0;
      let lucro = 0;
      data.forEach((op) => {
        const s = op.status?.toUpperCase();
        if (s?.includes('WON')) {
          wins++;
          lucro += op.pnl;
        } else if (s?.includes('LOST')) {
          losses++;
          lucro -= op.pnl;
        }
      });
      setTotalStats({ wins, losses, lucro });

      const total = data.reduce((acc, op) => acc + op.pnl, 0);
      setRoiTotalPercent(total ? (lucro / total) * 100 : 0);
    } catch {
      setTotalStats({ wins: 0, losses: 0, lucro: 0 });
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
        method: 'GET',
        headers: { Authorization: `Basic ${credentials}` },
      });
      if (res.ok) setBotStatus((prev) => (prev === 1 ? 0 : 1));
    } catch (err) {
      console.error('Erro ao alternar o bot:', err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchWallets(), fetchBrokerInfo(), fetchBotOptions(), fetchTodayTrades(), fetchAllTrades()]);
      setLoading(false);
    };
    if (accessToken) loadAll();
  }, [accessToken, id]);

  const getWinrate = (s: { wins: number; losses: number }) => {
    const total = s.wins + s.losses;
    return total === 0 ? 0 : Math.round((s.wins / total) * 100);
    };

  const imageSrc = getImagePath(brokerInfo.icon);
  const isReal = selectedWallet === 'REAL';
  const saldo = isReal ? wallets.REAL ?? 0 : wallets.DEMO ?? 0;
  const saldoColor = isReal ? 'text-green-400' : 'text-orange-400';
  const contaLabel = isReal ? 'Conta real' : 'Conta demo';

  const handleToggleWallet = () => setSelectedWallet((p) => (p === 'REAL' ? 'DEMO' : 'REAL'));

  return (
    <div className="min-h-screen bg-[#111827] text-white relative">
      <BrokerSidebarMenu />

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <main className="p-4 sm:p-6 md:pl-72 md:pr-10 md:py-10 pt-20 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Saldo */}
            <Card className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
              <CardContent className="p-5 space-y-2">
                <p className="text-gray-400 text-sm">Saldo disponível</p>
                <p className={`text-3xl font-bold ${saldoColor}`}>$ {saldo.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">{contaLabel}</p>
                <Button
                  onClick={handleToggleWallet}
                  className="mt-4 w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl"
                >
                  Trocar para {isReal ? 'Demo' : 'Real'}
                </Button>
              </CardContent>
            </Card>

            {/* Bot status */}
            <Card className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-cyan-400 font-semibold">🤖 Status do Bot</p>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      botStatus === 1 ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}
                  >
                    {botStatus === 1 ? 'Ativo' : 'Parado'}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{isDemo ? 'Conta demo' : 'Conta real'}</p>
                {brokerInfo.icon && (
                  <img src={imageSrc} alt="Logo corretora" className="w-16 h-16 object-contain mx-auto mt-2" />
                )}
                <Button
                  onClick={toggleBot}
                  className={`mt-4 w-full rounded-xl font-semibold text-white ${
                    botStatus === 1 ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {botStatus === 1 ? 'Parar bot' : 'Ativar bot'}
                </Button>
              </CardContent>
            </Card>

            {/* ROI Diário */}
            <Card className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
              <CardContent className="p-5">
                <p className="text-cyan-400 font-semibold mb-1">📈 ROI Diário</p>
                <p className={`text-3xl font-bold ${roiValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {roiPercent.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Lucro:{' '}
                  <span className={`font-bold ${roiValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    $ {roiValue.toFixed(2)}
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[{ label: '📊 Estatísticas Diárias', stats: dailyStats }, { label: '📈 Estatísticas Totais', stats: totalStats }].map(
              (item, index) => (
                <Card key={index} className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
                  <CardContent className="p-5">
                    <p className="text-cyan-400 font-semibold mb-2">{item.label}</p>
                    <p className="text-lg text-gray-400">
                      Winrate: <span className="font-bold text-green-400">{getWinrate(item.stats)}%</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      Derrotas: <span className="font-bold text-red-400">{100 - getWinrate(item.stats)}%</span>
                    </p>
                    <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mt-2 flex">
                      <div className="h-full bg-green-400" style={{ width: `${getWinrate(item.stats)}%` }} />
                      <div className="h-full bg-red-500" style={{ width: `${100 - getWinrate(item.stats)}%` }} />
                    </div>
                    <p className="text-green-400 text-sm mt-2">Vitórias: {item.stats.wins}</p>
                    <p className="text-red-400 text-sm">Derrotas: {item.stats.losses}</p>
                    <p className={`text-sm font-semibold ${item.stats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      Lucro: $ {item.stats.lucro.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              ),
            )}

            <Card className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
              <CardContent className="p-5">
                <p className="text-cyan-400 font-semibold mb-1">📉 ROI Total</p>
                <p className={`text-3xl font-bold ${totalStats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {roiTotalPercent.toFixed(2)}%
                </p>
                <p className={`text-sm font-semibold ${totalStats.lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  $ {totalStats.lucro.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Últimas operações */}
          <div className="mt-10">
            <Card className="bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-cyan-400 font-semibold">📊 Últimas Operações</p>
                  <button
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition"
                    onClick={() => navigate(`/broker/${id}/history`)}
                  >
                    Ver histórico
                  </button>
                </div>
                {recentOrders.length === 0 ? (
                  <p className="text-gray-400">Nenhuma operação registrada hoje.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {recentOrders.slice(0, 5).map((op, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{op.symbol}</span>
                        <span className={op.status === 'WIN' ? 'text-green-400' : 'text-red-400'}>
                          {op.status === 'WIN' ? '+' : '-'}$ {op.pnl.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      )}
    </div>
  );
};

export default Broker;
