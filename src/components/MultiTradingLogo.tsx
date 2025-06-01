
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
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-green-400 via-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        
        {/* Main logo - Diamond with trading arrows */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <svg viewBox="0 0 32 32" className="w-3/4 h-3/4" fill="none">
            {/* Diamond shape */}
            <path 
              d="M16 4L24 12L16 20L8 12L16 4Z" 
              fill="white" 
              fillOpacity="0.9"
            />
            {/* Inner trading symbol */}
            <path 
              d="M12 10L16 8L20 10M12 14L16 16L20 14" 
              stroke="rgb(34, 197, 94)" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            {/* Small dots for data points */}
            <circle cx="13" cy="11" r="0.5" fill="rgb(59, 130, 246)" />
            <circle cx="16" cy="13" r="0.5" fill="rgb(59, 130, 246)" />
            <circle cx="19" cy="11" r="0.5" fill="rgb(59, 130, 246)" />
          </svg>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-xl blur-sm"></div>
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
