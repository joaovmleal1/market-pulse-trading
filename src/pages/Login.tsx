import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MultiTradingLogo from '@/components/MultiTradingLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Multi Trading",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Erro no login",
          description: result.message || "Email ou senha incorretos",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="bg-[#2C2F33] border-[#24C3B5]/30">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center mb-2">
              <Button
                variant="ghost"
                className="text-[#A9B1B8] hover:text-white"
                onClick={() => navigate('/')}
              >
                ← Voltar ao Início
              </Button>
            </div>
            <div className="flex justify-center mb-4">
              <MultiTradingLogo size="lg" showText={false} />
            </div>
            <CardTitle className="text-2xl text-white">Entrar</CardTitle>
            <CardDescription className="text-[#A9B1B8]">
              Acesse sua conta Multi Trading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <motion.input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full rounded-md px-4 py-2 bg-[#1E1E1E] border border-[#24C3B5]/20 text-white placeholder-[#A9B1B8] outline-none focus:ring-2 focus:ring-[#24C3B5]"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Senha</Label>
                <div className="relative">
                  <motion.input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    required
                    className="w-full rounded-md px-4 py-2 bg-[#1E1E1E] border border-[#24C3B5]/20 text-white placeholder-[#A9B1B8] outline-none focus:ring-2 focus:ring-[#24C3B5]"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A9B1B8] hover:text-white"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#24C3B5] w-4 h-4"
                />
                <Label htmlFor="rememberMe" className="text-[#A9B1B8] text-sm">
                  Manter-me conectado
                </Label>
              </div>

              <motion.button
                type="submit"
                className="w-full mt-2 rounded-md px-4 py-2 font-medium text-white bg-gradient-to-r from-[#24C3B5] to-[#3ED6C8] hover:from-[#3ED6C8] hover:to-[#24C3B5]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-[#A9B1B8]">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-[#24C3B5] hover:text-[#3ED6C8] font-medium">
                  Criar conta
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;