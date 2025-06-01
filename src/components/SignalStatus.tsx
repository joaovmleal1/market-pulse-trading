
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, RefreshCw, Target } from 'lucide-react';

type Signal = 'BUY' | 'SELL' | null;

interface SignalStatusProps {
  signal: Signal;
  isWaiting: boolean;
  displayPair: string;
}

const SignalStatus = ({ signal, isWaiting, displayPair }: SignalStatusProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-8 text-center">
        {!isWaiting && !signal ? (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
              <Target className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Pronto para Análise
            </h2>
            <p className="text-gray-300 max-w-sm mx-auto">
              Clique em "Gerar Novo Sinal" para receber uma recomendação de trading para {displayPair}
            </p>
          </div>
        ) : isWaiting ? (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Analisando {displayPair}
            </h2>
            <p className="text-gray-300">
              Processando dados de mercado e indicadores técnicos...
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mx-auto max-w-sm">
              <div className="text-xs text-gray-400 space-y-1">
                <div>✓ Coletando dados de preço</div>
                <div>✓ Analisando volume</div>
                <div className="text-blue-400">⏳ Calculando indicadores...</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {signal === 'BUY' ? (
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <ArrowUp className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-green-400">
                  🚀 COMPRAR {displayPair}
                </h2>
                <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-green-300 font-medium">
                    Tendência de alta identificada
                  </p>
                  <p className="text-green-200 text-sm mt-1">
                    Execute a operação na plataforma ao lado
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <ArrowDown className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-red-400">
                  📉 VENDER {displayPair}
                </h2>
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-red-300 font-medium">
                    Tendência de baixa identificada
                  </p>
                  <p className="text-red-200 text-sm mt-1">
                    Execute a operação na plataforma ao lado
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignalStatus;
