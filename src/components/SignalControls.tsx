
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, BarChart3 } from 'lucide-react';

interface SignalControlsProps {
  onRequestAnalysis: () => void;
  isAnalyzing: boolean;
}

const SignalControls = ({ onRequestAnalysis, isAnalyzing }: SignalControlsProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Central de Análise</h3>
          </div>
          
          <p className="text-gray-400 text-sm mb-6">
            Solicite uma análise técnica detalhada do par para receber um sinal de trading
          </p>
          
          <Button 
            onClick={onRequestAnalysis}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg w-full"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analisando Mercado...' : 'Gerar Novo Sinal'}
          </Button>
          
          {isAnalyzing && (
            <div className="text-xs text-blue-400 mt-2">
              ⏱️ Análise em progresso... Isso pode levar até 30 segundos
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalControls;
