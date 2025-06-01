

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
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-green-400 via-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
        
        {/* Main logo - Upward trending arrow */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <svg viewBox="0 0 24 24" className="w-2/3 h-2/3" fill="none">
            {/* Trending arrow */}
            <path 
              d="M7 17L17 7M17 7H11M17 7V13" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            {/* Additional chart line for context */}
            <path 
              d="M3 14L7 10L12 15L21 6" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              opacity="0.6"
              fill="none"
            />
          </svg>
        </div>

        {/* Subtle inner glow */}
        <div className="absolute inset-1 bg-gradient-to-br from-white/5 to-transparent rounded-xl"></div>
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

