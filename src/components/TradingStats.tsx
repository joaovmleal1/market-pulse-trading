import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Target } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    label: "Taxa de Sucesso",
    value: "94.7%",
    trend: "+2.1%",
    color: "text-success"
  },
  {
    icon: DollarSign,
    label: "Lucro Médio/Mês",
    value: "R$ 8.450",
    trend: "+15.3%",
    color: "text-success"
  },
  {
    icon: Users,
    label: "Traders Ativos",
    value: "12.847",
    trend: "+1.2k",
    color: "text-primary"
  },
  {
    icon: Target,
    label: "Operações Hoje",
    value: "47",
    trend: "+12",
    color: "text-warning"
  }
];

export const TradingStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="bg-gradient-card backdrop-blur-sm border-border/50 p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-secondary/20`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <span className="text-sm text-success font-medium">
              {stat.trend}
            </span>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">
              {stat.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};