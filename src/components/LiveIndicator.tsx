import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Users, TrendingUp } from "lucide-react";

interface LiveIndicatorProps {
  isLive?: boolean;
  viewerCount?: number;
  onJoinLive?: () => void;
}

export const LiveIndicator = ({ 
  isLive = false, 
  viewerCount = 0, 
  onJoinLive = () => window.open('https://youtube.com/live', '_blank')
}: LiveIndicatorProps) => {
  const [viewers, setViewers] = useState(viewerCount);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewers(prev => prev + Math.floor(Math.random() * 5));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  if (!isLive) {
    return (
      <Card className="bg-gradient-card backdrop-blur-sm border-border/50 p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-muted"></div>
            <div>
              <h3 className="font-semibold text-foreground">Live Trading</h3>
              <p className="text-sm text-muted-foreground">Próxima operação em breve</p>
            </div>
          </div>
          <Badge variant="secondary">Offline</Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-live-indicator/30 p-6 shadow-glow animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-live-indicator animate-pulse-glow"></div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Operação AO VIVO
            </h3>
            <p className="text-sm text-success">Trading em tempo real</p>
          </div>
        </div>
        <Badge variant="destructive" className="bg-live-indicator animate-pulse">
          LIVE
        </Badge>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{viewers.toLocaleString()} assistindo</span>
        </div>
      </div>

      <Button 
        variant="live" 
        size="lg" 
        onClick={onJoinLive}
        className="w-full"
      >
        <Play className="h-5 w-5 mr-2" />
        ENTRAR NA LIVE AGORA
      </Button>
    </Card>
  );
};