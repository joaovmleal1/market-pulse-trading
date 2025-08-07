import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, TrendingUp, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  "Acesso às operações ao vivo diárias",
  "Sinais automatizados 24/7",
  "Suporte técnico especializado",
  "Análises de mercado exclusivas"
];

export const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de cadastro
    setTimeout(() => {
      toast({
        title: "Cadastro realizado com sucesso! 🎉",
        description: "Verifique seu email para acessar a plataforma.",
      });
      setEmail("");
      setName("");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-border/50 p-8 shadow-card max-w-md w-full">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <Badge variant="outline" className="border-primary text-primary">
            100% GRATUITO
          </Badge>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Comece a Lucrar Hoje
        </h3>
        <p className="text-muted-foreground">
          Junte-se a milhares de traders que já transformaram suas vidas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <Input
          type="text"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-background/50 border-border/50"
        />
        <Input
          type="email"
          placeholder="Seu melhor email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background/50 border-border/50"
        />
        <Button 
          type="submit" 
          variant="hero" 
          size="xl" 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Cadastrando..." : "QUERO LUCRAR AGORA"}
        </Button>
      </form>

      <div className="space-y-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
            <span className="text-muted-foreground">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border/30">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>100% Seguro</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>Resultados Reais</span>
          </div>
        </div>
      </div>
    </Card>
  );
};