
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const TradingPlatform = () => {
  const [iframeError, setIframeError] = useState(false);

  const handleIframeError = () => {
    setIframeError(true);
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
            Abrir em nova aba <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        <div className="bg-gray-900 rounded-lg overflow-hidden relative" style={{ height: '500px' }}>
          {iframeError ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
              <h4 className="text-white text-lg mb-2">Iframe não disponível</h4>
              <p className="text-gray-400 mb-4">
                A plataforma não pode ser carregada diretamente aqui devido a políticas de segurança.
              </p>
              <a 
                href="https://app.xofre.com/auth/register?affiliateId=01JW6Z7KB5J89BBA1J6YNR7D1W" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
              >
                Acessar Plataforma <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          ) : (
            <iframe
              src="https://app.xofre.com/auth/register?affiliateId=01JW6Z7KB5J89BBA1J6YNR7D1W"
              className="w-full h-full border-0"
              title="Plataforma de Trading Xofre"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer-when-downgrade"
              onError={handleIframeError}
              onLoad={(e) => {
                // Verificar se o iframe carregou corretamente
                try {
                  const iframe = e.target as HTMLIFrameElement;
                  if (!iframe.contentWindow) {
                    handleIframeError();
                  }
                } catch (error) {
                  console.log('Iframe pode estar bloqueado por políticas de segurança');
                  handleIframeError();
                }
              }}
            />
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <p>💡 Se o iframe não carregar, clique no botão "Abrir em nova aba" acima para acessar a plataforma diretamente.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingPlatform;
