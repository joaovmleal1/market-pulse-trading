
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface SignalControlsProps {
  onRequestAnalysis: () => void;
  isAnalyzing: boolean;
}

const SignalControls = ({ onRequestAnalysis, isAnalyzing }: SignalControlsProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6 text-center">
        <Button 
          onClick={onRequestAnalysis}
          disabled={isAnalyzing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analisando...' : 'Solicitar Nova Análise'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignalControls;
