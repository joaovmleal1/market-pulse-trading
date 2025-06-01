
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
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-spin" style={{ animationDuration: '8s' }}></div>
        
        {/* Main logo container */}
        <div className="absolute inset-1 bg-gradient-to-br from-slate-800 via-gray-900 to-black rounded-full flex items-center justify-center shadow-2xl">
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-sm"></div>
          
          {/* Logo symbol */}
          <div className="relative z-10 flex flex-col items-center justify-center text-white">
            {/* Stylized MT with trading arrow */}
            <div className="relative">
              <svg viewBox="0 0 48 32" className="w-3/4 h-3/4" fill="currentColor">
                {/* M */}
                <path d="M2 6h4l4 10 4-10h4v20h-3V12l-3 8h-2l-3-8v14H2V6z" className="fill-cyan-400"/>
                {/* T */}
                <path d="M32 6v3h-4v17h-3V9h-4V6h11z" className="fill-purple-400"/>
                {/* Trading arrow */}
                <path d="M38 10l6 6-6 6v-4h-8v-4h8v-4z" className="fill-pink-400"/>
              </svg>
            </div>
          </div>
          
          {/* Pulsing dots for activity indicator */}
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
      
      {showText && (
        <div>
          <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight`}>
            Multi Trading
          </h1>
          <p className="text-gray-400 text-xs font-medium tracking-wider uppercase">
            Advanced Analytics
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiTradingLogo;
