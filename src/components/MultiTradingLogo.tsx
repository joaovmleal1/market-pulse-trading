
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
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg`}>
        <div className="relative">
          {/* M letter */}
          <div className="text-white font-bold text-sm">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M3 3h4l3 6 3-6h4v18h-3V9l-2.5 5h-1L7 9v12H3V3z"/>
            </svg>
          </div>
          {/* Trading lines overlay */}
          <div className="absolute -top-1 -right-1 w-3 h-3">
            <div className="w-full h-0.5 bg-green-300 mb-0.5"></div>
            <div className="w-full h-0.5 bg-red-300 mb-0.5"></div>
            <div className="w-full h-0.5 bg-yellow-300"></div>
          </div>
        </div>
      </div>
      {showText && (
        <h1 className={`${textSizeClasses[size]} font-bold text-white`}>
          Multi Trading
        </h1>
      )}
    </div>
  );
};

export default MultiTradingLogo;
