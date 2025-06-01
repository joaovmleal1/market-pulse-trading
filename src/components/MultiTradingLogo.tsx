
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

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-green-400 via-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        
        {/* Main logo content */}
        <div className="relative z-10 flex items-center justify-center">
          {/* MT monogram */}
          <div className={`${iconSizeClasses[size]} text-white font-black flex items-center justify-center`}>
            <svg viewBox="0 0 40 24" className="w-full h-full" fill="currentColor">
              {/* M */}
              <path d="M2 2h3l3 8 3-8h3v20h-2.5V8L8 18H7L3.5 8v14H2V2z"/>
              {/* T */}
              <path d="M28 2v2.5h-3V22h-2.5V4.5h-3V2h8.5z"/>
            </svg>
          </div>
        </div>

        {/* Trading indicators - small chart lines */}
        <div className="absolute bottom-1 right-1 flex flex-col space-y-0.5">
          <div className="w-2 h-0.5 bg-green-300 rounded"></div>
          <div className="w-1.5 h-0.5 bg-red-300 rounded"></div>
          <div className="w-2.5 h-0.5 bg-yellow-300 rounded"></div>
        </div>
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
