import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, TrendingUp, Zap, Users } from "lucide-react";
import heroImage from "@/assets/hero-trading.jpg";

export const HeroSection = () => {
  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 animate-slide-up">
            <Badge variant="outline" className="border-primary text-primary bg-primary/10 backdrop-blur-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.847% este mês
            </Badge>
            <Badge variant="outline" className="border-success text-success bg-success/10 backdrop-blur-sm">
              <Users className="h-3 w-3 mr-1" />
              12.847 traders ativos
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up leading-tight">
            Ganhe Dinheiro com
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Câmbio Automático
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
            Plataforma 100% automática para trading de câmbio e criptomoedas. 
            <span className="text-primary font-semibold"> Resultados reais, operações ao vivo diárias.</span>
          </p>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-slide-up">
            {[
              "🤖 100% Automático",
              "📈 94.7% Taxa de Sucesso", 
              "💰 Lucro Médio R$ 8.450/mês",
              "🔴 Lives Diárias"
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg px-4 py-2 text-sm font-medium"
              >
                {feature}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <Button 
              variant="hero" 
              size="xl"
              onClick={scrollToSignup}
              className="min-w-[280px]"
            >
              <Zap className="h-5 w-5 mr-2" />
              COMEÇAR GRATUITAMENTE
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              className="min-w-[200px] border-border/50 bg-background/10 backdrop-blur-sm hover:bg-background/20"
            >
              <Play className="h-5 w-5 mr-2" />
              Ver Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground animate-slide-up">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-success rounded-full"></div>
              <span>Plataforma Segura</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>Suporte 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-warning rounded-full"></div>
              <span>Resultados Reais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-success/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-warning/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
    </section>
  );
};