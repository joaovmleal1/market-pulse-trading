import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import SidebarMenu from '@/components/ui/SidebarMenu';
import { Loader2 } from 'lucide-react';

type TabKey = 'users' | 'settings' | 'live' | 'pairs';

interface User {
  id: number;
  complete_name: string;
  email: string;
  last_login: string | null;
  is_superuser: boolean;
  is_active: boolean;
  activated_at: string | null;
}

/** =========================
 *  Site Options API
 *  ========================= */
interface SiteOption {
  key_name: string;
  key_value: string;
  type: string;
  description: string;
  id: number;
}
const IS_LIVE_KEY = 'is_live';
const LIVE_URL_KEY = 'live_url';

// Helpers para Basic Auth a partir do .env (Vite)
const BASIC_USER = import.meta.env.VITE_BASIC_AUTH_USER as string | undefined;
const BASIC_PASS = import.meta.env.VITE_BASIC_AUTH_PASS as string | undefined;

function toBase64(str: string) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function buildBasicAuthHeader() {
  if (!BASIC_USER || !BASIC_PASS) return undefined;
  const token = toBase64(`${BASIC_USER}:${BASIC_PASS}`);
  return `Basic ${token}`;
}

/** =========================
 *  Lançamentos ao vivo
 *  ========================= */
type Direction = 'CALL' | 'PUT' | 'BUY' | 'SELL';

interface LiveTradeForm {
  asset: string;
  direction: Direction;
  expiration_min: number;
  entry_time: string; // datetime-local
  gale_one_enabled: boolean;
  gale_two_enabled: boolean;
  notes: string;
}

interface LiveTradeItem {
  id: number;
  asset: string;
  direction: Direction;
  expiration_min: number;
  entry_time: string;
  gale_one_enabled: boolean;
  gale_two_enabled: boolean;
  status: 'scheduled' | 'sent' | 'done' | 'failed';
  created_at?: string;
  notes?: string;
}

/** =========================
 *  Trade Pairs
 *  ========================= */
interface TradePair {
  id: number;
  pair_name: string;
}

const Admin = () => {
  const { user } = useAuth();
  const { accessToken } = useSelector((state: any) => state.token);

  const [activeTab, setActiveTab] = useState<TabKey>('users');

  /** =========================
   *  Aba: Usuários
   *  ========================= */
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch('https://api.multitradingob.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const activateUser = async (userId: number, days: number) => {
    try {
      await fetch(`https://api.multitradingob.com/user/activate/${userId}/${days}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(`Erro ao ativar usuário:`, err);
    }
  };

  const deactivateUser = async (userId: number) => {
    try {
      await fetch(`https://api.multitradingob.com/user/deactivate/${userId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(`Erro ao desativar usuário:`, err);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && u.is_active) ||
        (statusFilter === 'inactive' && !u.is_active);

      const matchesSearch = u.complete_name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [users, statusFilter, searchTerm]);

  /** ================================
   *  Aba: Configurações do Site (site-options)
   *  ================================ */
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [savingOptions, setSavingOptions] = useState(false);

  const [liveEnabled, setLiveEnabled] = useState<boolean>(false);
  const [liveUrl, setLiveUrl] = useState<string>('');

  const [originalOptions, setOriginalOptions] = useState<Record<string, string>>({
    [IS_LIVE_KEY]: 'false',
    [LIVE_URL_KEY]: '',
  });

  const parseBool = (v?: string) => {
    if (!v) return false;
    const s = String(v).trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes';
  };

  const fetchSiteOptions = async () => {
    try {
      setLoadingOptions(true);

      const basicAuth = buildBasicAuthHeader();
      if (!basicAuth) {
        console.error('Faltam VITE_BASIC_AUTH_USER / VITE_BASIC_AUTH_PASS no .env');
        setLoadingOptions(false);
        return;
      }

      const res = await fetch('https://api.multitradingob.com/site-options/all', {
        headers: {
          Authorization: basicAuth, // BASIC
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Falha ao carregar site-options/all:', res.status, await res.text());
        setLoadingOptions(false);
        return;
      }

      const data: SiteOption[] = await res.json();

      const map = new Map<string, string>();
      data.forEach((opt) => map.set(opt.key_name, opt.key_value ?? ''));

      const liveEnabledStr = map.get(IS_LIVE_KEY) ?? 'false';
      const liveUrlStr = map.get(LIVE_URL_KEY) ?? '';

      setLiveEnabled(parseBool(liveEnabledStr));
      setLiveUrl(liveUrlStr);

      setOriginalOptions({
        [IS_LIVE_KEY]: liveEnabledStr,
        [LIVE_URL_KEY]: liveUrlStr,
      });
    } catch (err) {
      console.error('Erro ao carregar site-options:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  // PUT com Bearer; envia value como query param (?value=...)
  const putSiteOption = async (name: string, value: string) => {
    const url = `https://api.multitradingob.com/site-options/${encodeURIComponent(
      name
    )}?value=${encodeURIComponent(value)}`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`, // OAuth Bearer
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`PUT ${name} falhou (${res.status}): ${text}`);
    }
  };

  const saveSiteOptions = async () => {
    try {
      setSavingOptions(true);

      const currEnabled = String(liveEnabled); // 'true' | 'false'
      const currUrl = liveUrl ?? '';

      const tasks: Array<Promise<any>> = [];
      if (currEnabled !== originalOptions[IS_LIVE_KEY]) {
        tasks.push(putSiteOption(IS_LIVE_KEY, currEnabled));
      }
      if (currUrl !== originalOptions[LIVE_URL_KEY]) {
        tasks.push(putSiteOption(LIVE_URL_KEY, currUrl));
      }

      if (tasks.length > 0) {
        await Promise.all(tasks);
        setOriginalOptions({
          [IS_LIVE_KEY]: currEnabled,
          [LIVE_URL_KEY]: currUrl,
        });
      }
    } catch (err) {
      console.error('Erro ao salvar site-options:', err);
    } finally {
      setSavingOptions(false);
    }
  };

  const dirtyOptions =
    String(liveEnabled) !== originalOptions[IS_LIVE_KEY] ||
    (liveUrl ?? '') !== originalOptions[LIVE_URL_KEY];

  useEffect(() => {
    if (activeTab === 'settings') fetchSiteOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  /** ================================
   *  Aba: Lançar Trades (Ao Vivo)
   *  ================================ */
  const nowToDatetimeLocal = (d = new Date()) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const [liveForm, setLiveForm] = useState<LiveTradeForm>({
    asset: '',
    direction: 'CALL',
    expiration_min: 1,
    entry_time: nowToDatetimeLocal(new Date(Date.now() + 60_000)),
    gale_one_enabled: true,
    gale_two_enabled: true,
    notes: '',
  });
  const [submittingLive, setSubmittingLive] = useState(false);
  const [liveList, setLiveList] = useState<LiveTradeItem[]>([]);
  const [loadingLiveList, setLoadingLiveList] = useState(false);

  const fetchLiveList = async () => {
    try {
      setLoadingLiveList(true);
      const res = await fetch('https://api.multitradingob.com/admin/live-trades?limit=20', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLiveList(Array.isArray(data) ? data : []);
      } else {
        setLiveList([]);
      }
    } catch (err) {
      console.error('Erro ao buscar lançamentos:', err);
    } finally {
      setLoadingLiveList(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'live') fetchLiveList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleLaunchTrade = async () => {
    try {
      setSubmittingLive(true);

      const payload = {
        asset: liveForm.asset.trim(),
        direction: liveForm.direction,
        expiration_min: Number(liveForm.expiration_min),
        entry_time: new Date(liveForm.entry_time).toISOString(),
        gale_one_enabled: !!liveForm.gale_one_enabled,
        gale_two_enabled: !!liveForm.gale_two_enabled,
        notes: liveForm.notes?.trim() || '',
      };

      if (!payload.asset) throw new Error('Preencha o ativo.');
      if (!payload.expiration_min || payload.expiration_min < 1) throw new Error('Expiração inválida.');

      const res = await fetch('https://api.multitradingob.com/admin/live-trades', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Falha ao lançar trade.');
      }

      setLiveForm((prev) => ({
        ...prev,
        asset: '',
        entry_time: nowToDatetimeLocal(new Date(Date.now() + 60_000)),
        notes: '',
      }));

      fetchLiveList();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingLive(false);
    }
  };

  /** ================================
   *  Aba: Pares (CRUD)
   *  ================================ */
  const [pairs, setPairs] = useState<TradePair[]>([]);
  const [loadingPairs, setLoadingPairs] = useState(false);
  const [searchPair, setSearchPair] = useState('');
  const [creatingPair, setCreatingPair] = useState(false);
  const [newPairName, setNewPairName] = useState('');
  const [savingCreate, setSavingCreate] = useState(false);

  const [editingPair, setEditingPair] = useState<TradePair | null>(null);
  const [editName, setEditName] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchPairs = async () => {
    try {
      setLoadingPairs(true);
      const res = await fetch('https://api.multitradingob.com/trade-pairs/all', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        console.error('Falha ao listar pares:', res.status, await res.text());
        setPairs([]);
        return;
      }
      const data: TradePair[] = await res.json();
      setPairs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar pares:', err);
    } finally {
      setLoadingPairs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pairs') fetchPairs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const filteredPairs = useMemo(() => {
    const q = searchPair.trim().toLowerCase();
    if (!q) return pairs;
    return pairs.filter((p) => p.pair_name?.toLowerCase().includes(q));
  }, [pairs, searchPair]);

  const openCreatePair = () => {
    setNewPairName('');
    setCreatingPair(true);
  };

  const handleCreatePair = async () => {
    try {
      const name = newPairName.trim();
      if (!name) return;

      setSavingCreate(true);
      const res = await fetch('https://api.multitradingob.com/trade-pairs/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pair_name: name }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Falha ao criar par.');
      }
      setCreatingPair(false);
      setNewPairName('');
      fetchPairs();
    } catch (err) {
      console.error('Erro ao criar par:', err);
    } finally {
      setSavingCreate(false);
    }
  };

  const openEditPair = (pair: TradePair) => {
    setEditingPair(pair);
    setEditName(pair.pair_name);
  };

  const handleEditPair = async () => {
    if (!editingPair) return;
    try {
      const name = editName.trim();
      if (!name) return;

      setSavingEdit(true);
      // Ajuste se seus endpoints diferirem
      const res = await fetch(`https://api.multitradingob.com/trade-pairs/${editingPair.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pair_name: name }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Falha ao editar par.');
      }
      setEditingPair(null);
      fetchPairs();
    } catch (err) {
      console.error('Erro ao editar par:', err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeletePair = async (id: number) => {
    try {
      if (!window.confirm('Deseja realmente excluir este par?')) return;
      setDeletingId(id);
      const res = await fetch(`https://api.multitradingob.com/trade-pairs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Falha ao excluir par.');
      }
      setDeletingId(null);
      fetchPairs();
    } catch (err) {
      console.error('Erro ao excluir par:', err);
      setDeletingId(null);
    }
  };

  /** ================================
   *  UI
   *  ================================ */
  const TabButton = ({ k, label }: { k: TabKey; label: string }) => (
    <Button
      onClick={() => setActiveTab(k)}
      className={`rounded-full px-4 py-2 text-sm ${
        activeTab === k
          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
          : 'bg-[#1E293B] text-gray-200 border border-cyan-500/20 hover:text-cyan-300'
      }`}
    >
      {label}
    </Button>
  );

  /**
   * Modal sempre montado (evita perder foco).
   * Usa classes para esconder/mostrar.
   */
  const Modal: React.FC<{
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
  }> = ({ open, title, onClose, children, footer }) => {
    return (
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        {/* backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={onClose}
        />
        {/* content */}
        <div
          className="relative w-[92%] max-w-md rounded-2xl border border-cyan-500/20 bg-[#0f172a] shadow-xl p-4"
          onClick={(e) => e.stopPropagation()} // garante que clique interno não fecha
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-semibold text-white">{title}</p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 rounded px-2 py-1 border border-transparent hover:border-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">{children}</div>
          {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      <SidebarMenu />
      <main className="pt-16 lg:pl-72 max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold mb-6 text-gray-200">Painel Administrativo</h1>

        {/* Menu Horizontal */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton k="users" label="Usuários" />
          <TabButton k="settings" label="Configurações do Site" />
          <TabButton k="live" label="Lançar Trades (Ao Vivo)" />
          <TabButton k="pairs" label="Pares" />
        </div>

        {/* === ABA USUÁRIOS === */}
        {activeTab === 'users' && (
          <motion.section initial={false} animate={{ opacity: 1 }} aria-label="Aba Usuários">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="flex gap-2 flex-wrap">
                {['all', 'active', 'inactive'].map((type) => (
                  <Button
                    key={type}
                    onClick={() => setStatusFilter(type as any)}
                    className={`text-sm ${
                      statusFilter === type
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'bg-[#1E293B] text-gray-200 border border-cyan-500/20 hover:text-cyan-300'
                    }`}
                  >
                    {type === 'all' ? 'Todos' : type === 'active' ? 'Ativos' : 'Inativos'}
                  </Button>
                ))}
              </div>
              <Input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-[#1E293B] text-white placeholder-gray-400 border border-cyan-500/20"
              />
            </div>

            {loadingUsers ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="animate-spin" /> Carregando usuários...
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-gray-400">Nenhum usuário encontrado.</p>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((u) => (
                  <Card key={u.id} className="bg-[#1E293B] border border-cyan-500/20 text-white">
                    <CardContent className="p-4 w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <p className="font-bold text-lg text-white">{u.complete_name}</p>
                        <p className="text-sm text-gray-400">Id: {u.id}</p>
                        <p className="text-sm text-gray-400">{u.email}</p>
                        <p className="text-sm">
                          Último login:{' '}
                          <span className="text-gray-300">
                            {u.last_login ? new Date(u.last_login).toLocaleString() : 'Nunca'}
                          </span>
                        </p>
                        <p className="text-sm text-gray-400">
                          Superuser: {u.is_superuser ? 'Sim' : 'Não'} | Ativo: {u.is_active ? 'Sim' : 'Não'}
                        </p>
                        <p className="text-sm text-gray-400">
                          Ativado em: {u.activated_at ? new Date(u.activated_at).toLocaleString() : 'Não ativado'}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {!u.is_active &&
                          [1, 7, 30].map((day) => (
                            <Button
                              key={day}
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => activateUser(u.id, day)}
                            >
                              Ativar {day} {day === 1 ? 'dia' : 'dias'}
                            </Button>
                          ))}
                        {u.is_active && (
                          <Button variant="destructive" onClick={() => deactivateUser(u.id)}>
                            Desativar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* === ABA CONFIGURAÇÕES (site-options) === */}
        {activeTab === 'settings' && (
          <motion.section initial={false} animate={{ opacity: 1 }} aria-label="Aba Configurações do Site">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-[#1E293B] border border-cyan-500/20">
                <CardContent className="p-4 space-y-4">
                  <p className="text-lg font-semibold">Live</p>

                  <div className="flex items-center justify-between border border-cyan-500/20 rounded-md p-3">
                    <div>
                      <p className="text-sm font-medium">Habilitar Live</p>
                      <p className="text-xs text-gray-400">Liga/desliga a transmissão exibida no site.</p>
                    </div>
                    <Switch checked={liveEnabled} onCheckedChange={(c) => setLiveEnabled(!!c)} />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">URL da Live</label>
                    <Input
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="bg-[#1F1F1F] border border-cyan-500/20 text-white"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      GET: <code>/site-options/all</code> (Basic) · PUT:{' '}
                      <code>/site-options/{IS_LIVE_KEY}?value=...</code> (Bearer)
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={saveSiteOptions}
                      disabled={savingOptions || loadingOptions || !dirtyOptions}
                      className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:text-cyan-300"
                    >
                      {savingOptions ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin" /> Salvando...
                        </span>
                      ) : (
                        'Salvar Configurações'
                      )}
                    </Button>
                    {loadingOptions && (
                      <span className="inline-flex items-center gap-2 text-gray-400 ml-3">
                        <Loader2 className="animate-spin" /> Carregando...
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}

        {/* === ABA LANÇAR TRADES === */}
        {activeTab === 'live' && (
          <motion.section initial={false} animate={{ opacity: 1 }} aria-label="Aba Lançar Trades (Ao Vivo)">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Formulário */}
              <Card className="bg-[#1E293B] border border-cyan-500/20">
                <CardContent className="p-4 space-y-3">
                  <p className="text-lg font-semibold">Disparar Sinal Manual</p>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Ativo (par)</label>
                    <Input
                      value={liveForm.asset}
                      onChange={(e) => setLiveForm((f) => ({ ...f, asset: e.target.value }))}
                      className="bg-[#1F1F1F] border border-cyan-500/20 text-white"
                      placeholder="Ex.: EURUSD, WIN, BTCUSDT..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Direção</label>
                      <select
                        value={liveForm.direction}
                        onChange={(e) => setLiveForm((f) => ({ ...f, direction: e.target.value as Direction }))}
                        className="w-full rounded-md bg-[#1F1F1F] border border-cyan-500/20 px-3 py-2"
                      >
                        <option value="CALL">CALL</option>
                        <option value="PUT">PUT</option>
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Expiração (min)</label>
                      <Input
                        inputMode="numeric"
                        value={String(liveForm.expiration_min)}
                        onChange={(e) =>
                          setLiveForm((f) => ({ ...f, expiration_min: Number(e.target.value || 0) }))
                        }
                        className="bg-[#1F1F1F] border border-cyan-500/20 text-white text-center"
                        placeholder="1, 3, 5..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Horário da Entrada</label>
                    <Input
                      type="datetime-local"
                      value={liveForm.entry_time}
                      onChange={(e) => setLiveForm((f) => ({ ...f, entry_time: e.target.value }))}
                      className="bg-[#1F1F1F] border border-cyan-500/20 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Dica: os gales serão agendados pelo servidor a +1min e +2min (se habilitados).
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={liveForm.gale_one_enabled}
                        onCheckedChange={(checked) => setLiveForm((f) => ({ ...f, gale_one_enabled: !!checked }))}
                      />
                      <span className="text-sm">Gale 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={liveForm.gale_two_enabled}
                        onCheckedChange={(checked) => setLiveForm((f) => ({ ...f, gale_two_enabled: !!checked }))}
                      />
                      <span className="text-sm">Gale 2</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Observações</label>
                    <Input
                      value={liveForm.notes}
                      onChange={(e) => setLiveForm((f) => ({ ...f, notes: e.target.value }))}
                      className="bg-[#1F1F1F] border border-cyan-500/20 text-white"
                      placeholder="Opcional"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleLaunchTrade}
                      disabled={submittingLive}
                      className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:text-cyan-300"
                    >
                      {submittingLive ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin" /> Enviando...
                        </span>
                      ) : (
                        'Lançar Trade'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Últimos lançamentos */}
              <Card className="bg-[#1E293B] border border-cyan-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-semibold">Últimos Lançamentos</p>
                    <Button
                      variant="outline"
                      onClick={fetchLiveList}
                      className="border border-cyan-500/20 text-gray-200 hover:bg-gray-700"
                    >
                      Atualizar
                    </Button>
                  </div>

                  {loadingLiveList ? (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Loader2 className="animate-spin" /> Carregando...
                    </div>
                  ) : liveList.length === 0 ? (
                    <p className="text-gray-400">Nenhum lançamento encontrado.</p>
                  ) : (
                    <div className="space-y-3">
                      {liveList.map((it) => (
                        <div
                          key={it.id}
                          className="border border-cyan-500/20 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <p className="text-sm text-gray-300">
                              <span className="font-semibold text-white">{it.asset}</span> · {it.direction} ·{' '}
                              {it.expiration_min}m
                            </p>
                            <p className="text-xs text-gray-400">
                              Entrada: {new Date(it.entry_time).toLocaleString()} · G1:
                              {it.gale_one_enabled ? ' Sim' : ' Não'} · G2:{' '}
                              {it.gale_two_enabled ? ' Sim' : ' Não'}
                            </p>
                            {it.notes && <p className="text-xs text-gray-500">Obs.: {it.notes}</p>}
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${
                              it.status === 'done'
                                ? 'border-green-400/40 text-green-300'
                                : it.status === 'failed'
                                ? 'border-red-400/40 text-red-300'
                                : it.status === 'sent'
                                ? 'border-blue-400/40 text-blue-300'
                                : 'border-yellow-400/40 text-yellow-300'
                            }`}
                          >
                            {it.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}

        {/* === ABA PARES === */}
        {activeTab === 'pairs' && (
          <motion.section initial={false} animate={{ opacity: 1 }} aria-label="Aba Pares">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <Input
                type="text"
                placeholder="Buscar por nome do par..."
                value={searchPair}
                onChange={(e) => setSearchPair(e.target.value)}
                className="w-full md:w-80 bg-[#1E293B] text-white placeholder-gray-400 border border-cyan-500/20"
              />
              <Button
                onClick={openCreatePair}
                className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:text-cyan-300"
              >
                + Novo Par
              </Button>
            </div>

            {loadingPairs ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="animate-spin" /> Carregando pares...
              </div>
            ) : filteredPairs.length === 0 ? (
              <p className="text-gray-400">Nenhum par encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPairs.map((p) => (
                  <Card key={p.id} className="bg-[#1E293B] border border-cyan-500/20 text-white">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{p.pair_name}</p>
                        <p className="text-xs text-gray-400">ID: {p.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => openEditPair(p)}
                          className="border border-cyan-500/20 text-gray-200 hover:bg-gray-700"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeletePair(p.id)}
                          disabled={deletingId === p.id}
                        >
                          {deletingId === p.id ? <Loader2 className="animate-spin h-4 w-4" /> : 'Excluir'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Modal Criar Par (sempre montado) */}
        <Modal
          open={creatingPair}
          title="Novo Par"
          onClose={() => setCreatingPair(false)}
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setCreatingPair(false)}
                className="border border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreatePair}
                disabled={savingCreate || !newPairName.trim()}
                className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:text-cyan-300"
              >
                {savingCreate ? <Loader2 className="animate-spin h-4 w-4" /> : 'Criar'}
              </Button>
            </>
          }
        >
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nome do par</label>
            <Input
              autoFocus={creatingPair}
              value={newPairName}
              onChange={(e) => setNewPairName(e.target.value)}
              className="bg-[#1F1F1F] border border-cyan-500/20 text-white"
              placeholder="Ex.: EURUSD"
            />
          </div>
        </Modal>

        {/* Modal Editar Par (sempre montado) */}
        <Modal
          open={!!editingPair}
          title="Editar Par"
          onClose={() => setEditingPair(null)}
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setEditingPair(null)}
                className="border border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEditPair}
                disabled={savingEdit || !editName.trim()}
                className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:text-cyan-300"
              >
                {savingEdit ? <Loader2 className="animate-spin h-4 w-4" /> : 'Salvar'}
              </Button>
            </>
          }
        >
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nome do par</label>
            <Input
              autoFocus={!!editingPair}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-[#1F1F1F] border border-cyan-500/20 text-white"
              placeholder="Ex.: EURUSD"
            />
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default Admin;
