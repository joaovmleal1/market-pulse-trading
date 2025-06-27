import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import { useAuth } from '@/contexts/AuthContext';

const Signature = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-8 space-y-6"
      >
        <div className="flex justify-between items-center">
          <MultiTradingLogo size="sm" />
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => navigate('/')}
          >
            Voltar
          </Button>
        </div>

        {user?.is_active ? (
          <>
            <h1 className="text-3xl font-bold text-green-400">Assinatura Ativa ✅</h1>
            <p className="text-gray-300 text-lg">
              Sua assinatura está em dia! Você já está operando com inteligência artificial, recebendo análises
              avançadas e entradas automáticas com alta precisão nos pares mais promissores do mercado.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-green-500 to-blue-500"
              onClick={() => navigate('/dashboard')}
            >
              Ir para o Dashboard
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white">Assine o Multi Trading Pro</h1>
            <p className="text-gray-300 text-lg">
              Nossa plataforma utiliza inteligência artificial para analisar os principais pares de ativos e
              executar operações automáticas nas corretoras com alta taxa de acerto. Com o Multi Trading Pro,
              você opera com tecnologia de ponta e aumenta suas chances de lucratividade com mais precisão e
              menos esforço.
            </p>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-2">Plano Profissional</h2>
              <ul className="list-disc pl-5 text-gray-300 space-y-1">
                <li>Análises de mercado com inteligência artificial</li>
                <li>Entradas automáticas nos melhores pares e momentos</li>
                <li>Alta taxa de precisão operacional</li>
                <li>Operações integradas às principais corretoras</li>
                <li>Relatórios de performance detalhados</li>
                <li>Suporte prioritário e área exclusiva para membros</li>
              </ul>

              <div className="mt-6 space-y-1">
                <span className="block text-sm text-gray-400">Planos disponíveis:</span>
                <div className="text-lg text-white">
                  <span className="block">🔹 Semanal — <strong>R$ 39,90</strong></span>
                  <span className="block">🔹 Mensal — <strong>R$ 200,00</strong></span>
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white"
                onClick={() =>
                  window.location.href = 'https://pay.kirvano.com/3ed1d972-7047-421a-809f-be816c09fd19'
                }
                disabled={!user}
              >
                Assinar agora
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Signature;
