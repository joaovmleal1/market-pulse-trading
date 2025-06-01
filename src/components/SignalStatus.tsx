
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

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
            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Pronto para análise
            </h2>
            <p className="text-gray-300">
              Clique no botão abaixo para solicitar uma análise de câmbio
            </p>
          </div>
        ) : isWaiting ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Analisando câmbio...
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
            {signal === 'BUY' ? (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <ArrowUp className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-green-400">
                  ✅ SINAL DE COMPRA
                </h2>
                <p className="text-gray-300">
                  Recomendação: Comprar {displayPair}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <ArrowDown className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-red-400">
                  🔻 SINAL DE VENDA
                </h2>
                <p className="text-gray-300">
                  Recomendação: Vender {displayPair}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignalStatus;
