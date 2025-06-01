
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

    // Gera tempo aleatório entre 5 e 20 segundos
    const randomTime = Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;

    setTimeout(() => {
      const signals: Signal[] = ['BUY', 'SELL'];
      const randomSignal = signals[Math.floor(Math.random() * signals.length)];
      setSignal(randomSignal);
      setIsWaiting(false);
      setIsAnalyzing(false);
    }, randomTime);
  };

  const requestNewAnalysis = () => {
    generateSignal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <TradingHeader displayPair={displayPair} cryptoSymbol={cryptoSymbol} />
      
      <main className="max-w-7xl mx-auto p-6">
        {/* Plataforma de Trading em destaque no topo */}
        <div className="mb-8">
          <TradingPlatform signal={signal} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status do Sinal */}
          <div className="lg:col-span-1">
            <SignalStatus signal={signal} isWaiting={isWaiting} displayPair={displayPair} />
          </div>
          
          {/* Controles e Informações */}
          <div className="lg:col-span-2 space-y-6">
            <SignalControls onRequestAnalysis={requestNewAnalysis} isAnalyzing={isAnalyzing} />
            <TradingInfo displayPair={displayPair} isWaiting={isWaiting} signal={signal} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TradingPair;
