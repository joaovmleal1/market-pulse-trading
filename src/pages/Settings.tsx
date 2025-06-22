import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import SecureField from '@/components/ui/SecureField';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';

const settingsFields = [
  { label: 'Stop Loss', key: 'stop_loss' },
  { label: 'Stop Win', key: 'stop_win' },
  { label: 'Valor de Entrada', key: 'entry_price' },
  { label: 'Conta Demo', key: 'is_demo', type: 'boolean' },
  { label: 'Gale 1', key: 'gale_one', type: 'boolean' },
  { label: 'Gale 2', key: 'gale_two', type: 'boolean' },
  { label: 'API Key da Corretora', key: 'api_key', type: 'secure' },
  { label: 'Usuário da Corretora', key: 'brokerage_username' },
  { label: 'Senha da Corretora', key: 'brokerage_password', type: 'secure' },
];

const containerVariants = {
  hidden: { opacity: 0, visibility: 'hidden' },
  visible: {
    opacity: 1,
    visibility: 'visible',
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 }
  })
};

const SettingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { accessToken } = useSelector((state: any) => state.token);

  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBotOptions = async () => {
      try {
        const response = await fetch('https://api.multitradingob.com/bot-options/bot-options', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setFormData((prev: any) => ({
          ...prev,
          stop_loss: data.stop_loss,
          stop_win: data.stop_win,
          entry_price: data.entry_price,
          is_demo: data.is_demo,
          gale_one: data.gale_one,
          gale_two: data.gale_two,
        }));
      } catch (error) {
        console.error('Erro ao buscar configurações do bot:', error);
      }
    };

    const fetchOrCreateBrokerageConfig = async () => {
      try {
        const res = await fetch(`https://api.multitradingob.com/user-brokerages/user_brokerages/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        let data;
        if (res.status === 404) {
          const createRes = await fetch(`https://api.multitradingob.com/user-brokerages/user_brokerages`, {
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
  }, [accessToken, id]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSaveConfig = async () => {
    try {
      setIsSaving(true);

      await fetch('https://api.multitradingob.com/bot-options/bot-options', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_status: false,
          user_id: user?.id || 0,
          stop_loss: Number(formData.stop_loss),
          stop_win: Number(formData.stop_win),
          entry_price: Number(formData.entry_price),
          is_demo: formData.is_demo,
          gale_one: formData.gale_one,
          gale_two: formData.gale_two,
          api_key: formData.api_key,
        }),
      });

      await fetch(`https://api.multitradingob.com/user-brokerages/user_brokerages/${id}`, {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <MultiTradingLogo size="md" />
          <div className="flex items-center space-x-4">
            <span className="text-white">Olá, {user?.complete_name}</span>
            <Button
              variant="outline"
              onClick={logout}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {isLoading || !isFormReady ? (
        <main className="flex-grow flex items-center justify-center text-white text-lg p-6">
          Carregando configurações...
        </main>
      ) : (
        <motion.main
          className="flex flex-col items-center justify-center p-6"
          initial={{ opacity: 0, visibility: 'hidden', y: 10 }}
          animate={{ opacity: 1, visibility: 'visible', y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Configurações</h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full justify-items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {settingsFields.map((field, index) => (
              <motion.div
                variants={itemVariants}
                custom={index}
                key={field.key}
                className="w-72"
              >
                <Card className="bg-gray-800 border-gray-700 w-full rounded-2xl shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    {field.type === 'boolean' ? (
                      <>
                        <label className="text-white block mb-2">{field.label}</label>
                        <div className="flex items-center justify-center space-x-2">
                          <Switch
                            checked={!!formData[field.key]}
                            onCheckedChange={(checked) => handleChange(field.key, !!checked)}
                          />
                          <span className="text-white">
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
                      />
                    ) : (
                      <>
                        <label className="text-white block mb-2">{field.label}</label>
                        <Input
                          className="bg-gray-700 text-white border-gray-600 text-center"
                          placeholder={`Digite o(a) ${field.label.toLowerCase()}`}
                          value={formData[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex flex-col items-center gap-4 mt-8 w-72">
            <Button
              onClick={handleSaveConfig}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
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
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              Voltar Sem Salvar
            </Button>
          </div>
        </motion.main>
      )}
    </div>
  );
};

export default SettingsPage;
