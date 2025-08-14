import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import SidebarMenu from '@/components/ui/SidebarMenu';
import { Loader2 } from 'lucide-react';

type TabKey = 'users' | 'settings' | 'live';

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
 *  Configurações do Site
 *  ========================= */
interface SiteSettings {
  site_name: string;
  telegram_group_url: string;
  announcement_banner: string;
  first_login_alert_enabled: boolean;
  first_login_alert_url: string;
  maintenance_mode: boolean;
}

/** =========================
 *  Lançamentos ao vivo
 *  ========================= */
type Direction = 'CALL' | 'PUT' | 'BUY' | 'SELL';

interface LiveTradeForm {
  asset: string;
  direction: Direction;
  expiration_min: number;               // minutos
  entry_time: string;                   // datetime-local
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

const Admin = () => {
  const { user } = useAuth();
  const { accessToken } = useSelector((state: any) => state.token);

  const [activeTab, setActiveTab] = useState<TabKey>('users');

  /** =========================
   *  Aba: Usuários (SEU CÓDIGO)
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
   *  Aba: Configurações do Site
   *  ================================ */
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: 'Multi Trading',
    telegram_group_url: '',
    announcement_banner: '',
    first_login_alert_enabled: false,
    first_login_alert_url: '',
    maintenance_mode: false,
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchSiteSettings = async () => {
    try {
      setLoadingSettings(true);
      // 🔧 AJUSTE ENDPOINT
      const res = await fetch('https://api.multitradingob.com/site-settings', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSiteSettings((prev) => ({
          ...prev,
          ...data,
        }));
      }
    } catch (err) {
      console.error('Erro ao carregar site settings:', err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const saveSiteSettings = async () => {
    try {
      setSavingSettings(true);
      // 🔧 AJUSTE ENDPOINT
      await fetch('https://api.multitradingob.com/site-settings', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteSettings),
      });
    } catch (err) {
      console.error('Erro ao salvar site settings:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'settings') fetchSiteSettings();
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
    entry_time: nowToDatetimeLocal(new Date(Date.now() + 60_000)), // +1min
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
      // 🔧 AJUSTE ENDPOINT
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

      // monta payload
      const payload = {
        asset: liveForm.asset.trim(),
        direction: liveForm.direction,
        expiration_min: Number(liveForm.expiration_min),
        entry_time: new Date(liveForm.entry_time).toISOString(),
        gale_one_enabled: !!liveForm.gale_one_enabled,
        gale_two_enabled: !!liveForm.gale_two_enabled,
        // Sugestão: servidor pode agendar automaticamente gale 1/2
        // para +1 e +2 minutos após entry_time, conforme sua regra.
        notes: liveForm.notes?.trim() || '',
      };

      // validações básicas
      if (!payload.asset) throw new Error('Preencha o ativo.');
      if (!payload.entry_time) throw new Error('Defina a data/hora da entrada.');
      if (!payload.expiration_min || payload.expiration_min < 1) throw new Error('Expiração inválida.');

      // 🔧 AJUSTE ENDPOINT
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

      // reset leve (mantém direção/expiração)
      setLiveForm((prev) => ({
        ...prev,
        asset: '',
        entry_time: nowToDatetimeLocal(new Date(Date.now() + 60_000)),
        notes: '',
      }));

      fetchLiveList();
      // opcional: toast/sucesso visual
    } catch (err) {
      console.error(err);
      // opcional: toast/erro visual
    } finally {
      setSubmittingLive(false);
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

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      <SidebarMenu />
      <main className="pt-16 lg:pl-72 max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-gray-200">Painel Administrativo</h1>

        {/* Menu Horizontal */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton k="users" label="Usuários" />
          <TabButton k="settings" label="Configurações do Site" />
          <TabButton k="live" label="Lançar Trades (Ao Vivo)" />
        </div>

        {/* CONTEÚDOS */}
        {activeTab === 'users' && (
          <section aria-label="Aba Usuários">
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

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
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
            </motion.div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section aria-label="Aba Configurações do Site">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-[#1E293B] border border-cyan-500/20">
                  <CardContent className="p-4 space-y-3">
                    <p className="text-lg font-semibold">Informações Gerais</p>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Nome do Site</label>
                      <Input
                        value={siteSettings.site_name}
                        onChange={(e) => setSiteSettings((s) => ({ ...s, site_name: e.target.value }))}
                        className="bg-[#1F1F1F] border border-cyan-500/20 text-white"
                        placeholder="Ex.: Multi Trading"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">URL do Grupo no Telegram</label>
                      <Input
                        value={siteSettings.telegram_group_url}
                        onChange={(e) => setSiteSettings((s) => ({ ...s, telegram_group_url: e.target.value }))}
                        className="bg-[#1F1F1F] border border-cyan-500/20 text-white"
                        placeholder="https://t.me/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Aviso no topo (banner)</label>
                      <Input
                        value={siteSettings.announcement_banner}
                        onChange={(e) => setSiteSettings((s) => ({ ...s, announcement_banner: e.target.value }))}
                        className="bg-[#1F1F1F] border border-cyan-500/20 text-white"
                        placeholder="Mensagem curta exibida no topo do site"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1E293B] border border-cyan-500/20">
                  <CardContent className="p-4 space-y-4">
                    <p className="text-lg font-semibold">Experiência do Usuário</p>

                    <div className="flex items-center justify-between border border-cyan-500/20 rounded-md p-3">
                      <div>
                        <p className="text-sm font-medium">Alerta no primeiro login</p>
                        <p className="text-xs text-gray-400">Exibir pop-up com convite do Telegram.</p>
                      </div>
                      <Switch
                        checked={siteSettings.first_login_alert_enabled}
                        onCheckedChange={(checked) =>
                          setSiteSettings((s) => ({ ...s, first_login_alert_enabled: !!checked }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">URL do alerta (Telegram)</label>
                      <Input
                        value={siteSettings.first_login_alert_url}
                        onChange={(e) => setSiteSettings((s) => ({ ...s, first_login_alert_url: e.target.value }))}
                        className="bg-[#1F1F1F] border border-cyan-500/20 text-white"
                        placeholder="https://t.me/..."
                      />
                    </div>

                    <div className="flex items-center justify-between border border-cyan-500/20 rounded-md p-3">
                      <div>
                        <p className="text-sm font-medium">Modo de Manutenção</p>
                        <p className="text-xs text-gray-400">Bloqueia acesso dos usuários comuns.</p>
                      </div>
                      <Switch
                        checked={siteSettings.maintenance_mode}
                        onCheckedChange={(checked) =>
                          setSiteSettings((s) => ({ ...s, maintenance_mode: !!checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Button
                  onClick={saveSiteSettings}
                  disabled={savingSettings || loadingSettings}
                  className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:text-cyan-300"
                >
                  {savingSettings ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" /> Salvando...
                    </span>
                  ) : (
                    'Salvar Configurações'
                  )}
                </Button>
                {loadingSettings && (
                  <span className="inline-flex items-center gap-2 text-gray-400 ml-3">
                    <Loader2 className="animate-spin" /> Carregando...
                  </span>
                )}
              </div>
            </motion.div>
          </section>
        )}

        {activeTab === 'live' && (
          <section aria-label="Aba Lançar Trades (Ao Vivo)">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
            </motion.div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Admin;
