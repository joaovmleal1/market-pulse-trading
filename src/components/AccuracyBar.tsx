
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target } from 'lucide-react';

interface AccuracyBarProps {
  pair: string;
}

const AccuracyBar = ({ pair }: AccuracyBarProps) => {
  const [accuracy, setAccuracy] = useState(0);
  const [todaySignals, setTodaySignals] = useState(0);
  const [successfulSignals, setSuccessfulSignals] = useState(0);

  useEffect(() => {
    // Simular dados de assertividade baseados no par
    const baseAccuracy = 75 + Math.random() * 20; // Entre 75% e 95%
    const signals = Math.floor(12 + Math.random() * 25); // Entre 12 e 37 sinais
    const successful = Math.floor(signals * (baseAccuracy / 100));
    
    setAccuracy(Math.round(baseAccuracy));
    setTodaySignals(signals);
    setSuccessfulSignals(successful);
  }, [pair]);

  const getAccuracyColor = (acc: number) => {
    if (acc >= 85) return 'text-green-400';
    if (acc >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (acc: number) => {
    if (acc >= 85) return 'bg-green-500';
    if (acc >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-400" />
          Assertividade - {pair}
        </h3>
        <div className={`text-2xl font-bold ${getAccuracyColor(accuracy)}`}>
          {accuracy}%
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-300">
          <span>Taxa de Acerto</span>
          <span>{successfulSignals}/{todaySignals} sinais</span>
        </div>
        <div className="relative">
          <Progress 
            value={accuracy} 
            className="h-3 bg-gray-700"
          />
          <div 
            className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ${getProgressColor(accuracy)}`}
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="text-green-400 font-bold text-lg">{successfulSignals}</div>
          <div className="text-gray-400 text-xs">Acertos</div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="text-red-400 font-bold text-lg">{todaySignals - successfulSignals}</div>
          <div className="text-gray-400 text-xs">Erros</div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="text-blue-400 font-bold text-lg">{todaySignals}</div>
          <div className="text-gray-400 text-xs">Total</div>
        </div>
      </div>

      <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
        <div className="flex items-center text-sm text-gray-300">
          <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
          <span>Última atualização: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AccuracyBar;
