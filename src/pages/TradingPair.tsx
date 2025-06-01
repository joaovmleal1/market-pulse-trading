
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TradingHeader from '@/components/TradingHeader';
import TradingPlatform from '@/components/TradingPlatform';
import SignalStatus from '@/components/SignalStatus';
import SignalControls from '@/components/SignalControls';
import TradingInfo from '@/components/TradingInfo';

type Signal = 'BUY' | 'SELL' | null;

const TradingPair = () => {
  const { pair } = useParams<{ pair: string }>();
  const [signal, setSignal] = useState<Signal>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const displayPair = pair?.replace('-', '/') || '';
  const cryptoSymbol = displayPair.split('/')[0];

  const generateSignal = () => {
    setIsAnalyzing(true);
    setIsWaiting(true);
    setSignal(null);

    // Simula análise por 30 segundos
    setTimeout(() => {
      const signals: Signal[] = ['BUY', 'SELL'];
      const randomSignal = signals[Math.floor(Math.random() * signals.length)];
      setSignal(randomSignal);
      setIsWaiting(false);
      setIsAnalyzing(false);
    }, 30000); // 30 segundos
  };

  const requestNewAnalysis = () => {
    generateSignal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <TradingHeader displayPair={displayPair} cryptoSymbol={cryptoSymbol} />
      
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lado esquerdo - Análise de Sinais */}
          <div className="space-y-6">
            <SignalStatus signal={signal} isWaiting={isWaiting} displayPair={displayPair} />
            <SignalControls onRequestAnalysis={requestNewAnalysis} isAnalyzing={isAnalyzing} />
            <TradingInfo displayPair={displayPair} isWaiting={isWaiting} signal={signal} />
          </div>
          
          {/* Lado direito - Plataforma de Trading */}
          <div className="lg:sticky lg:top-6">
            <TradingPlatform signal={signal} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TradingPair;
