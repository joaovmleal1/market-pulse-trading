import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MultiTradingLogo from '@/components/MultiTradingLogo';
import { useAuth } from '@/contexts/AuthContext';

const Signature = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-2xl bg-[#2C2F33] border border-[#24C3B5]/30 rounded-xl shadow-lg p-8 space-y-6"
            >
                <div className="flex justify-between items-center">
                    <MultiTradingLogo size="sm" />
                    <Button
                        variant="ghost"
                        className="text-[#A9B1B8] hover:text-white"
                        onClick={() => navigate('/')}
                    >
                        Voltar
                    </Button>
                </div>

                {user?.is_active ? (
                    <>
                        <h1 className="text-3xl font-bold text-[#24C3B5]">Assinatura Ativa ✅</h1>
                        <p className="text-[#A9B1B8] text-lg">
                            Sua assinatura está em dia! Você já está operando com inteligência artificial,
                            recebendo análises avançadas e entradas automáticas com alta precisão nos pares mais promissores do mercado.
                        </p>
                        <Button
                            className="w-full bg-[#24C3B5] hover:bg-[#3ED6C8] text-white"
                            onClick={() => navigate('/dashboard')}
                        >
                            Ir para o Dashboard
                        </Button>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-white">Assine o Multi Trading Pro</h1>
                        <p className="text-[#A9B1B8] text-lg">
                            Nossa plataforma utiliza inteligência artificial para analisar os principais pares de ativos e
                            executar operações automáticas nas corretoras com alta taxa de acerto. Com o Multi Trading Pro,
                            você opera com tecnologia de ponta e aumenta suas chances de lucratividade com mais precisão e
                            menos esforço.
                        </p>

                        <div className="bg-[#1E1E1E] border border-[#24C3B5]/20 rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-2 text-white">Plano Profissional</h2>
                            <ul className="list-disc pl-5 text-[#A9B1B8] space-y-1">
                                <li>Análises de mercado com inteligência artificial</li>
                                <li>Entradas automáticas nos melhores pares e momentos</li>
                                <li>Alta taxa de precisão operacional</li>
                                <li>Operações integradas às principais corretoras</li>
                                <li>Relatórios de performance detalhados</li>
                                <li>Suporte prioritário e área exclusiva para membros</li>
                            </ul>

                            <div className="mt-6 space-y-1">
                                <span className="block text-sm text-[#A9B1B8]">Planos disponíveis:</span>
                                <div className="text-lg text-white">
                                    <span className="block">🔹 Diário — <strong>R$ 19,90</strong></span>
                                    <span className="block">🔹 Semanal — <strong>R$ 39,90</strong></span>
                                    <span className="block">🔹 Mensal — <strong>R$ 200,00</strong></span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <Button
                                    className="w-full bg-[#24C3B5] hover:bg-[#3ED6C8] text-white"
                                    onClick={() => {
                                        if (user) {
                                            const url = `https://pay.kirvano.com/3ed1d972-7047-421a-809f-be816c09fd19?user_id=${user.id}&email=${encodeURIComponent(user.email)}`;
                                            window.location.href = url;
                                        }
                                    }}
                                    disabled={!user}
                                >
                                    Assinar plano Semanal/Mensal
                                </Button>

                                <Button
                                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white"
                                    onClick={() => {
                                        if (user) {
                                            const url = `https://pay.kirvano.com/c9d1c2f5-a627-4902-9400-47f0454c0777?user_id=${user.id}&email=${encodeURIComponent(user.email)}`;
                                            window.location.href = url;
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
