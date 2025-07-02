import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MultiTradingLogo from '@/components/MultiTradingLogo';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Erro no cadastro',
        description: 'As senhas não coincidem',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Erro no cadastro',
        description: 'A senha deve ter pelo menos 6 caracteres',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await register(name, email, password);
      if (result.success) {
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Bem-vindo ao Multi Trading',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Erro no cadastro',
          description: result.message || 'Este email já está em uso',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Erro no cadastro',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <motion.div
              className="w-12 h-12 border-4 border-t-cyan-400 border-cyan-800 rounded-full animate-spin"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
          />
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111827] to-[#0A0A0A] flex items-center justify-center px-4 py-6">
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-md sm:max-w-lg lg:max-w-xl"
        >
          <Card className="bg-[#1F2937]/80 backdrop-blur border border-cyan-700/30 shadow-2xl rounded-xl">
            {/* conteúdo permanece o mesmo */}
          </Card>
        </motion.div>
      </div>
  );
};

export default Register;
