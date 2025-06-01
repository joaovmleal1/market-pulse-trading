
interface CryptoLogoProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CryptoLogo = ({ symbol, size = 'md', className = '' }: CryptoLogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const getCryptoLogo = (symbol: string) => {
    switch (symbol.toUpperCase()) {
      case 'BTC':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="w-4/5 h-4/5 text-white" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.27 14.93c-.32.06-.64.09-.97.09-.58 0-1.12-.1-1.62-.3-.5-.2-.94-.49-1.32-.87L8.5 17l-.85-1.27 1.27-.84c-.15-.33-.23-.7-.23-1.1 0-.4.08-.77.23-1.1L7.65 11.4 8.5 10.13l.86 1.15c.38-.38.82-.67 1.32-.87.5-.2 1.04-.3 1.62-.3.33 0 .65.03.97.09V8.73h1.46v1.37c.58.12 1.1.35 1.56.69.46.34.82.76 1.08 1.26l-1.27.85c-.17-.33-.41-.6-.72-.81-.31-.21-.67-.31-1.08-.31-.58 0-1.05.16-1.41.48-.36.32-.54.74-.54 1.26s.18.94.54 1.26c.36.32.83.48 1.41.48.41 0 .77-.1 1.08-.31.31-.21.55-.48.72-.81l1.27.85c-.26.5-.62.92-1.08 1.26-.46.34-.98.57-1.56.69v1.37h-1.46v-1.37z"/>
            </svg>
          </div>
        );
      
      case 'ETH':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="w-4/5 h-4/5 text-white" fill="currentColor">
              <path d="M12 2L4 12l8 5 8-5-8-10zm0 2.5L17.5 12 12 15.5 6.5 12 12 4.5z"/>
              <path d="M4 13.5L12 22l8-8.5-8 5-8-5z"/>
            </svg>
          </div>
        );
      
      case 'XRP':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="w-4/5 h-4/5 text-white" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 7.5l-1.5 1.5-1.5-1.5-1.5 1.5L12 9l-3 3 1.5 1.5L12 15l1.5-1.5L15 15l1.5-1.5-1.5-1.5 1.5-1.5z"/>
            </svg>
          </div>
        );
      
      case 'ADA':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="w-4/5 h-4/5 text-white" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-3 5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-3 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
            </svg>
          </div>
        );
      
      case 'SOL':
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="w-4/5 h-4/5 text-white" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 14H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1z"/>
            </svg>
          </div>
        );
      
      default:
        return (
          <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center`}>
            <span className="text-white font-bold text-xs">{symbol.charAt(0)}</span>
          </div>
        );
    }
  };

  return getCryptoLogo(symbol);
};

export default CryptoLogo;
