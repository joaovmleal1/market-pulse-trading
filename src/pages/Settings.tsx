import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import SecureField from '@/components/ui/SecureField';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import BrokerSidebarMenu from '@/components/ui/BrokerSidebarMenu';

const settingsFields = [
  { label: 'Stop Loss', key: 'stop_loss' },
  { label: 'Stop Win', key: 'stop_win' },
  { label: 'Valor de Entrada', key: 'entry_price' },
  { label: 'Conta Demo', key: 'is_demo', type: 'boolean' },
  { label: 'Gale 1', key: 'gale_one', type: 'boolean' },
  { label: 'Gale 2', key: 'gale_two', type: 'boolean' },
  { label: 'API Key da Corretora', key: 'api_key', type: 'secure', brokerageOnly: true },
  { label: 'Usuário da Corretora', key: 'brokerage_username', brokerageOnly: true },
  { label: 'Senha da Corretora', key: 'brokerage_password', type: 'secure', brokerageOnly: true },
];

const brokerageFieldConfig: Record<string, string[]> = {
  '1': ['api_key'],
};

const containerVariants = {
  hidden: { opacity: 0, visibility: 'hidden' },
  visible: {
    opacity: 1,
    visibility: 'visible',
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

const SettingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accessToken } = useSelector((state: any) => state.token);

  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [brokerageInfo, setBrokerageInfo] = useState<any>(null);

  useEffect(() => {
    const fetchBrokerageInfo = async () => {
      if (!id) return;

      try {
        const res = await fetch(`https://api.multitradingob.com/brokerages/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        setBrokerageInfo(data);
      } catch (err) {
        console.error("Erro ao buscar informações da corretora:", err);
      }
    };

    fetchBrokerageInfo();
  }, [id]);

  useEffect(() => {
    const fetchBotOptions = async () => {
      if (!id || !user?.id) return;

      try {
        const res = await fetch(`https://api.multitradingob.com/bot-options/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 404) {
          const createRes = await fetch(`https://api.multitradingob.com/bot-options/${id}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bot_status: 0,
              stop_loss: 0,
              stop_win: 0,
              entry_price: 0,
              user_id: user.id,
              is_demo: false,
              win_value: 0,
              loss_value: 0,
              gale_one: true,
              gale_two: true,
              brokerage_id: Number(id),
            }),
          });

          const created = await createRes.json();
          setFormData((prev: any) => ({
            ...prev,
            stop_loss: created.stop_loss,
            stop_win: created.stop_win,
            entry_price: created.entry_price,
            is_demo: created.is_demo,
            gale_one: created.gale_one,
            gale_two: created.gale_two,
          }));
        } else {
          const data = await res.json();
          setFormData((prev: any) => ({
            ...prev,
            stop_loss: data.stop_loss,
            stop_win: data.stop_win,
            entry_price: data.entry_price,
            is_demo: data.is_demo,
            gale_one: data.gale_one,
            gale_two: data.gale_two,
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar/criar bot_options:', error);
      }
    };

    const fetchOrCreateBrokerageConfig = async () => {
      if (!id || !user?.id) return;

      try {
        const res = await fetch(`https://api.multitradingob.com/user-brokerages/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        let data;
        if (res.status === 404) {
          const createRes = await fetch(`https://api.multitradingob.com/user-brokerages`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: user?.id || 0,
              brokerage_id: Number(id),
            }),
          });
          data = await createRes.json();
        } else {
          data = await res.json();
        }

        setFormData((prev: any) => ({
          ...prev,
          api_key: data.api_key || '',
          brokerage_username: data.brokerage_username || '',
          brokerage_password: data.brokerage_password || '',
        }));
      } catch (error) {
        console.error('Erro ao carregar configurações da corretora:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken && id) {
      fetchBotOptions();
      fetchOrCreateBrokerageConfig();
    }
  }, [accessToken, id, user?.id]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSaveConfig = async () => {
    try {
      setIsSaving(true);

      await fetch(`https://api.multitradingob.com/bot-options/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_status: 0,
          user_id: user?.id || 0,
          stop_loss: Number(formData.stop_loss),
          stop_win: Number(formData.stop_win),
          entry_price: Number(formData.entry_price),
          is_demo: formData.is_demo,
          gale_one: formData.gale_one,
          gale_two: formData.gale_two,
          win_value: 0,
          loss_value: 0,
          brokerage_id: Number(id),
        }),
      });

      await fetch(`https://api.multitradingob.com/user-brokerages/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id || 0,
          brokerage_id: Number(id),
          api_key: formData.api_key,
          brokerage_username: formData.brokerage_username,
          brokerage_password: formData.brokerage_password,
        }),
      });

      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isFormReady = settingsFields.every(field => formData.hasOwnProperty(field.key));
  const allowedFields = brokerageFieldConfig[id || ''] || [];

  return (
      <div className="min-h-screen bg-[#111827] text-white">
        <BrokerSidebarMenu />
        {isLoading || !isFormReady ? (
            <main className="flex-grow flex items-center justify-center p-6">
              <Loader2 className="animate-spin h-6 w-6 mr-2 text-cyan-400" />
              <span className="text-gray-300">Carregando configurações...</span>
            </main>
        ) : (
            <motion.main
                className="flex flex-col items-center justify-center p-4 md:p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                Configurações do Robô
              </h2>

              <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
              >
                {settingsFields.map((field, index) => {
                  const isBrokerField = field.brokerageOnly;
                  const isEnabled = !isBrokerField || allowedFields.includes(field.key);
                  return (
                      <motion.div
                          variants={itemVariants}
                          custom={index}
                          key={field.key}
                          className="w-full"
                      >
                        <Card className={`bg-[#1E293B] border border-cyan-500/20 rounded-xl shadow ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <CardContent className="p-4">
                            {field.type === 'boolean' ? (
                                <>
                                  <label className="block text-sm text-gray-200 mb-2">{field.label}</label>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                        checked={!!formData[field.key]}
                                        onCheckedChange={(checked) => handleChange(field.key, !!checked)}
                                        disabled={!isEnabled}
                                    />
                                    <span className="text-sm text-gray-300">
                              {formData[field.key] ? 'Ativado' : 'Desativado'}
                            </span>
                                  </div>
                                </>
                            ) : field.type === 'secure' ? (
                                <SecureField
                                    label={field.label}
                                    name={field.key}
                                    value={formData[field.key] || ''}
                                    onChange={handleChange}
                                    disabled={!isEnabled}
                                />
                            ) : (
                                <>
                                  <label className="block text-sm text-gray-200 mb-2">{field.label}</label>
                                  <Input
                                      className="bg-[#1F1F1F] border border-cyan-500/20 text-white text-center"
                                      placeholder={`Digite ${field.label.toLowerCase()}`}
                                      value={formData[field.key] || ''}
                                      onChange={(e) => handleChange(field.key, e.target.value)}
                                      disabled={!isEnabled}
                                  />
                                </>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                  );
                })}
              </motion.div>

              {(!formData.api_key || !formData.brokerage_username || !formData.brokerage_password) && brokerageInfo?.brokerage_register_url && (
                  <a
                      href={brokerageInfo.brokerage_register_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-500/20 rounded-lg hover:text-cyan-300 hover:bg-cyan-500/10 transition"
                  >
                    Criar Conta na Corretora
                  </a>
              )}

              <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-sm">
                <Button
                    onClick={handleSaveConfig}
                    className="w-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:text-cyan-300"
                    disabled={isSaving}
                >
                  {isSaving ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Salvando...
                      </div>
                  ) : (
                      'Atualizar Configurações'
                  )}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="w-full border border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
              </div>
            </motion.main>
        )}
      </div>
  );
};

export default SettingsPage;
