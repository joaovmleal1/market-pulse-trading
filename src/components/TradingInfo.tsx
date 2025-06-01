
import { Card, CardContent } from '@/components/ui/card';

type Signal = 'BUY' | 'SELL' | null;

interface TradingInfoProps {
  displayPair: string;
  isWaiting: boolean;
  signal: Signal;
}

const TradingInfo = ({ displayPair, isWaiting, signal }: TradingInfoProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Informações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div>
            <span className="font-medium">Par:</span> {displayPair}
          </div>
          <div>
            <span className="font-medium">Status:</span> {isWaiting ? 'Analisando' : signal ? 'Sinal Ativo' : 'Aguardando'}
          </div>
          <div>
            <span className="font-medium">Tempo de expiração:</span> 1 minuto
          </div>
          <div>
            <span className="font-medium">Tipo de análise:</span> Manual
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingInfo;
