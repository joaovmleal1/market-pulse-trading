
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

type Signal = 'BUY' | 'SELL' | null;

interface TradingPlatformProps {
  signal?: Signal;
}

const TradingPlatform = ({ signal }: TradingPlatformProps) => {
  const getSignalMessage = () => {
    if (!signal) return null;
    
    return signal === 'BUY' ? (
      <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 text-green-400">
          <TrendingUp className="w-5 h-5" />
          <span className="font-bold">SINAL DE COMPRA ATIVO</span>
        </div>
        <p className="text-sm text-green-300 mt-1">
          Execute sua operação de compra na plataforma abaixo
        </p>
      </div>
    ) : (
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 text-red-400">
          <TrendingDown className="w-5 h-5" />
          <span className="font-bold">SINAL DE VENDA ATIVO</span>
        </div>
        <p className="text-sm text-red-300 mt-1">
          Execute sua operação de venda na plataforma abaixo
        </p>
      </div>
    );
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Plataforma de Trading</h3>
          <a 
            href="https://app.xofre.com/auth/register?affiliateId=01JW6Z7KB5J89BBA1J6YNR7D1W" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
          >
            Nova aba <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        {getSignalMessage()}
        
        <div className="bg-gray-900 rounded-lg p-6 text-center">
          <h4 className="text-white text-lg mb-4">Execute suas Operações</h4>
          <p className="text-gray-400 mb-6">
            {signal 
              ? "Clique para acessar a plataforma e executar sua operação baseada no sinal gerado." 
              : "Gere um sinal de análise primeiro, depois acesse a plataforma para executar suas operações."
            }
          </p>
          <a 
            href="https://app.xofre.com/auth/register?affiliateId=01JW6Z7KB5J89BBA1J6YNR7D1W" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`px-8 py-4 rounded-lg flex items-center justify-center mx-auto w-fit text-lg font-semibold transition-all ${
              signal 
                ? 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {signal ? 'Executar Operação Agora' : 'Acessar Plataforma'} 
            <ExternalLink className="w-5 h-5 ml-2" />
          </a>
          
          {signal && (
            <p className="text-xs text-gray-500 mt-3">
              ⚡ Sinal ativo - Execute rapidamente para aproveitar a oportunidade
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingPlatform;
