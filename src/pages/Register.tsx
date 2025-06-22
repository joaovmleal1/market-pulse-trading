import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MultiTradingLogo from '@/components/MultiTradingLogo';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erro no cadastro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const success = await register(name, email, password);
      if (success) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao Multi Trading",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Erro no cadastro",
          description: "Este email já está em uso",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center mb-2">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() => navigate('/')}
              >
                ← Voltar ao Início
              </Button>
            </div>
            <div className="flex justify-center mb-4">
              <MultiTradingLogo size="lg" showText={false} />
            </div>
            <CardTitle className="text-2xl text-white">Criar Conta</CardTitle>
            <CardDescription className="text-gray-400">
              Junte-se ao Multi Trading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'name', label: 'Nome', type: 'text', value: name, setter: setName },
                { id: 'email', label: 'Email', type: 'email', value: email, setter: setEmail },
                { id: 'password', label: 'Senha', type: 'password', value: password, setter: setPassword },
                { id: 'confirmPassword', label: 'Confirmar Senha', type: 'password', value: confirmPassword, setter: setConfirmPassword },
              ].map(({ id, label, type, value, setter }) => (
                <motion.div key={id} layout className="space-y-2">
                  <Label htmlFor={id} className="text-white">{label}</Label>
                  <motion.input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={label}
                    required
                    className="w-full rounded-md px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                </motion.div>
              ))}

              <motion.button
                type="submit"
                className="w-full mt-2 rounded-md px-4 py-2 font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
                  Entrar
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
