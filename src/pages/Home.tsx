import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { LiveIndicator } from "@/components/LiveIndicator";
import { TradingStats } from "@/components/TradingStats";

import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Play, TrendingUp, Zap, Shield } from "lucide-react";
import tradingBg from "@/assets/trading-bg.jpg";

const Index = () => {
  const [isLive, setIsLive] = useState(true); // Simula se há live ativa

  const features = [
    {
      icon: Zap,
      title: "Trading 100% Automático",
      description: "Nossa IA opera 24/7 sem intervenção humana, maximizando oportunidades de lucro."
    },
    {
      icon: TrendingUp,
      title: "Análise Avançada",
      description: "Algoritmos de última geração analisam milhares de dados em tempo real."
    },
    {
      icon: Shield,
      title: "Gestão de Risco",
      description: "Sistema inteligente de stop-loss e take-profit protege seu capital."
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Empresário",
      comment: "Em 3 meses consegui uma renda extra de R$ 12.000. Plataforma incrível!",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Profissional Liberal",
      comment: "Finalmente encontrei algo que funciona de verdade. Recomendo!",
      rating: 5
    },
    {
      name: "Roberto Santos",
      role: "Aposentado",
      comment: "Perfeito para quem não tem tempo. Lucro sem esforço!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home">
        <HeroSection />
      </section>

      {/* Live Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Acompanhe as Operações em Tempo Real
                </h2>
                <p className="text-lg text-muted-foreground">
                  Tenha acesso exclusivo às nossas operações ao vivo e veja como 
                  nossa plataforma gera resultados consistentes todos os dias.
                </p>
              </div>
              
              <TradingStats />
            </div>
            
            <div className="space-y-6">
              <LiveIndicator 
                isLive={isLive} 
                viewerCount={847}
                onJoinLive={() => alert('Redirecionando para a live...')}
              />
              
              <Card className="bg-gradient-card backdrop-blur-sm border-border/50 p-6 shadow-card">
                <h3 className="font-bold text-foreground mb-3">Próximas Lives</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hoje</span>
                    <span className="text-primary font-medium">15:00 - EUR/USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amanhã</span>
                    <span className="text-primary font-medium">09:00 - BTC/USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quinta</span>
                    <span className="text-primary font-medium">14:30 - GBP/JPY</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="platform" className="py-20 relative">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url(${tradingBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-primary text-primary mb-4">
              Tecnologia de Ponta
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Por que Escolher o Multi Trading?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Nossa plataforma combina inteligência artificial avançada com anos de experiência 
              em mercados financeiros para entregar resultados consistentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="bg-gradient-card backdrop-blur-sm border-border/50 p-8 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 text-center"
              >
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Proof Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Resultados Comprovados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={index}
                  className="bg-gradient-card backdrop-blur-sm border-border/50 p-6 shadow-card"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section id="signup" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <Badge variant="outline" className="border-success text-success mb-4">
                    Oferta Limitada
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Comece a Lucrar
                    <span className="block text-primary">100% Gratuitamente</span>
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Não perca a oportunidade de transformar sua vida financeira. 
                    Junte-se a milhares de traders que já descobriram o poder do trading automático.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    "Acesso completo à plataforma por 30 dias",
                    "Todas as operações ao vivo incluídas",
                    "Suporte técnico especializado 24/7",
                    "Comunidade exclusiva de traders",
                    "Material educativo completo"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong className="text-foreground">Garantia de 30 dias:</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Se não ficar satisfeito com os resultados, devolvemos 100% do seu investimento.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Card className="bg-gradient-card backdrop-blur-sm border-border/50 p-8 shadow-card max-w-md w-full text-center">
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Badge variant="outline" className="border-primary text-primary bg-primary/10">
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

                  <div className="space-y-4 mb-8">
                    {[
                      "Acesso às operações ao vivo diárias",
                      "Sinais automatizados 24/7",
                      "Suporte técnico especializado",
                      "Análises de mercado exclusivas"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="hero" 
                    size="xl" 
                    className="w-full mb-6"
                    onClick={() => window.open('https://t.me/multitrading_oficial', '_blank')}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    ENTRAR NO TELEGRAM
                  </Button>

                  <div className="pt-6 border-t border-border/30">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
