
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const TradingPlatform = () => {
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
            Abrir em nova aba <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 text-center">
          <h4 className="text-white text-lg mb-4">Acesse a Plataforma de Trading</h4>
          <p className="text-gray-400 mb-6">
            Clique no botão abaixo para acessar a plataforma completa de trading.
          </p>
          <a 
            href="https://app.xofre.com/auth/register?affiliateId=01JW6Z7KB5J89BBA1J6YNR7D1W" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center mx-auto w-fit"
          >
            Acessar Plataforma <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingPlatform;
