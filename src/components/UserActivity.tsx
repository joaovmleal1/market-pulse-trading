
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface User {
  id: string;
  name: string;
  action: 'BUY' | 'SELL';
  amount: string;
  timestamp: Date;
}

const UserActivity = () => {
  const [users, setUsers] = useState<User[]>([]);

  const generateRandomUser = (): User => {
    const names = ['João', 'Maria', 'Carlos', 'Ana', 'Pedro', 'Sofia', 'Lucas', 'Beatriz', 'Rafael', 'Julia'];
    const actions: ('BUY' | 'SELL')[] = ['BUY', 'SELL'];
    const amounts = ['0.1', '0.25', '0.5', '1.0', '2.5', '5.0'];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: names[Math.floor(Math.random() * names.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      timestamp: new Date()
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prev => {
        const newUser = generateRandomUser();
        const updated = [newUser, ...prev].slice(0, 8); // Manter apenas 8 usuários
        return updated;
      });
    }, 3000); // Novo usuário a cada 3 segundos

    // Adicionar alguns usuários iniciais
    const initialUsers = Array.from({ length: 4 }, generateRandomUser);
    setUsers(initialUsers);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-white mb-3">🔴 Operações em Tempo Real</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600 animate-fade-in"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gray-600 text-white text-xs">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white text-sm font-medium">{user.name}</p>
                <p className="text-gray-400 text-xs">
                  {user.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={user.action === 'BUY' ? 'default' : 'destructive'}
                className={`${
                  user.action === 'BUY' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                {user.action === 'BUY' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {user.action} {user.amount}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserActivity;
