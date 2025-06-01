
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
        <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ height: '500px' }}>
          <iframe
            src="https://app.xofre.com/auth/register?affiliateId=01JW6Z7KB5J89BBA1J6YNR7D1W"
            className="w-full h-full border-0"
            title="Plataforma de Trading Xofre"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingPlatform;
