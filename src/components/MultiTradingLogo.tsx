import logo from '../assets/imgs/logo.png';

interface MultiTradingLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const MultiTradingLogo = ({ size = 'md', showText = true }: MultiTradingLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`${sizeClasses[size]} bg-transparent rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden`}>
        {/* Logo image */}
        <img src={logo} alt="Logo MultiTrading" className="w-full h-full object-contain" />
      </div>
      
      {showText && (
        <div>
          <h1 className={`${textSizeClasses[size]} font-bold text-white leading-tight`}>
            Multi Trading
          </h1>
          <p className="text-green-400 text-xs font-medium tracking-wide">
            CRYPTO ANALYTICS
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiTradingLogo;
