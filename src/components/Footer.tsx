import { TrendingUp, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/30 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Multi Trading
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Plataforma líder em trading automático de câmbio e criptomoedas. 
              Transformando vidas através da tecnologia financeira.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Plataforma</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Trading Automático</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Análise de Mercado</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Sinais em Tempo Real</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Suporte Técnico</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Recursos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Tutoriais</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Webinars</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contato</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@multitrading.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+55 (11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Multi Trading. Todos os direitos reservados.</p>
          <p className="mt-2">
            <span className="text-warning">⚠️ Aviso:</span> Trading envolve riscos. Resultados passados não garantem lucros futuros.
          </p>
        </div>
      </div>
    </footer>
  );
};