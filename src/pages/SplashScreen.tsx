
import { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/4b02a836-64da-4605-90da-a76b17c070b5.png" 
            alt="Multi Trading Logo" 
            className="w-48 h-auto mx-auto mb-4"
          />
        </div>
        <p className="text-gray-300 text-lg">Análise de Criptomoedas</p>
        <div className="mt-8">
          <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
