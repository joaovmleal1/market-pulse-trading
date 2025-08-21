import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import { useAuth } from '@/contexts/AuthContext';

const Signature = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    console.log("USER DATA", user);
    const isSuperUser = user?.is_superuser;
    const isRegistered = user?.polarium_registered && user?.avalon_registered && user?.xofre_registered;
    const isActive = user?.is_active;
    const needsRegistration = !isSuperUser && !isRegistered;

    return (
        <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-2xl bg-[#1E293B] border border-cyan-500/20 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6"
            >
                <div className="flex justify-between items-center">
                    <MultiTradingLogo size="sm" />
                    <Button
                        variant="ghost"
                        className="text-gray-400 hover:text-cyan-300"
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                    >
                        Voltar
                    </Button>
                </div>

                {needsRegistration ? (
                    <>
                        <motion.h1
                            className="text-2xl sm:text-3xl font-bold text-cyan-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Antes de continuar...
                        </motion.h1>
                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                            Para acessar os planos e começar a operar, é necessário se registrar gratuitamente em nossas plataformas parceiras.
                        </p>
                        <p className="text-gray-400 text-sm sm:text-base">
                            🔸 A <strong>Xofre</strong> roda de forma 100% automática.<br />
                            🔸 <strong>Polarium</strong> e <strong>Avalon</strong> funcionam com lives e sala VIP exclusiva (Em breve com sinais automáticos também).
                        </p>
                        <p className="text-gray-500 text-xs">
                            Use o mesmo e-mail do seu cadastro atual para garantir a sincronização correta.
                        </p>

                        <div className="flex flex-col gap-3 pt-2">
                            <Button
                                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-400 hover:brightness-110 text-white"
                                onClick={() => {
                                    const link = `https://trade.polariumbroker.com/register?aff=785464&clickid=uid${user.id}`;
                                    window.open(link, '_blank');
                                }}
                            >
                                Registrar na Polarium
                            </Button>

                            <Button
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:brightness-110 text-white"
                                onClick={() => {
                                    const link = `https://trade.avalonbroker.com/register?aff=752205&clickid=uid${user.id}`;
                                    window.open(link, '_blank');
                                }}
                            >
                                Registrar na Avalon
                            </Button>

                            <Button
                                className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:brightness-110 text-white"
                                onClick={() => {
                                    const link = `https://app.xofre.com/auth/register?affiliateId=01JW6Z7KB5J89BBA1J6YNR7D1W`;
                                    window.open(link, '_blank');
                                }}
                            >
                                Registrar na Xofre (Autônoma)
                            </Button>
                        </div>
                    </>
                ) : isActive ? (
                    <>
                        <motion.h1
                            className="text-2xl sm:text-3xl font-bold text-cyan-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Assinatura Ativa ✅
                        </motion.h1>
                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                            Sua assinatura está em dia! Você já está operando com inteligência artificial,
                            recebendo análises avançadas e entradas automáticas com alta precisão nos pares
                            mais promissores do mercado.
                        </p>
                        <Button
                            className="w-full bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 border border-cyan-500/20"
                            onClick={() => navigate('/dashboard')}
                        >
                            Ir para o Dashboard
                        </Button>
                    </>
                ) : (
                    <>
                        <motion.h1
                            className="text-2xl sm:text-3xl font-bold text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Assine o Multi Trading Pro
                        </motion.h1>
                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                            Nossa plataforma utiliza inteligência artificial para analisar os principais pares de ativos e
                            executar operações automáticas com alta taxa de acerto. Com o Multi Trading Pro,
                            você opera com tecnologia de ponta e aumenta suas chances de lucratividade com mais precisão e
                            menos esforço.
                        </p>

                        <div className="bg-[#1E293B] border border-cyan-500/20 rounded-xl p-6 space-y-4">
                            <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400">Plano Profissional</h2>
                            <ul className="list-disc pl-5 text-gray-400 space-y-1 text-sm sm:text-base">
                                <li>Análises de mercado com inteligência artificial</li>
                                <li>Entradas automáticas nos melhores pares e momentos</li>
                                <li>Alta taxa de precisão operacional</li>
                                <li>Operações integradas às principais corretoras</li>
                                <li>Relatórios de performance detalhados</li>
                                <li>Suporte prioritário e área exclusiva para membros</li>
                            </ul>

                            <div className="pt-4 border-t border-gray-700 text-sm text-gray-400">
                                <span className="block mb-1">Planos disponíveis:</span>
                                <div className="space-y-1 text-white">
                                    <p>🔹 Diário — <strong>R$ 19,90</strong></p>
                                    <p>🔹 Semanal — <strong>R$ 39,90</strong></p>
                                    <p>🔹 Mensal — <strong>R$ 200,00</strong></p>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button
                                    className="w-full bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 border border-cyan-500/20"
                                    onClick={() => {
                                        if (user) {
                                            const url = `https://pay.kirvano.com/3ed1d972-7047-421a-809f-be816c09fd19`;
                                            window.open(url, '_blank');
                                        }
                                    }}
                                    disabled={!user}
                                >
                                    Assinar plano Semanal/Mensal
                                </Button>

                                <Button
                                    className="w-full bg-gradient-to-r from-cyan-600 to-cyan-400 hover:brightness-110 text-white"
                                    onClick={() => {
                                        if (user) {
                                            const url = `https://pay.kirvano.com/c9d1c2f5-a627-4902-9400-47f0454c0777`;
                                            window.open(url, '_blank');
                                        }
                                    }}
                                    disabled={!user}
                                >
                                    Assinar plano Diário
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default Signature;
