import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Bitcoin } from "lucide-react";

interface Stat {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: React.ComponentType<any>;
}

const TradingStats = () => {
    const [stats, setStats] = useState<Stat[]>([
        { label: "Bitcoin", value: "$43,291.50", change: "+2.4%", trend: "up", icon: Bitcoin },
        { label: "Ethereum", value: "$2,584.30", change: "-1.2%", trend: "down", icon: TrendingUp },
        { label: "USD/BRL", value: "R$ 5.12", change: "+0.8%", trend: "up", icon: DollarSign },
        { label: "Portfolio", value: "$12,450.80", change: "+15.3%", trend: "up", icon: TrendingUp },
    ]);

    const [animatedValues, setAnimatedValues] = useState<boolean[]>([false, false, false, false]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prevStats =>
                prevStats.map((stat, index) => {
                    const changePercent = Math.random() * 4 - 2;
                    const formattedChange = changePercent.toFixed(1);
                    const newChange = `${changePercent >= 0 ? '+' : ''}${formattedChange}%`;

                    setAnimatedValues(prev => {
                        const newAnimated = [...prev];
                        newAnimated[index] = true;
                        setTimeout(() => {
                            setAnimatedValues(curr => {
                                const reset = [...curr];
                                reset[index] = false;
                                return reset;
                            });
                        }, 500);
                        return newAnimated;
                    });

                    return {
                        ...stat,
                        change: newChange,
                        trend: changePercent >= 0 ? "up" : "down"
                    };
                })
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="gradient-card p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-smooth hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <span
                                className={`text-sm font-medium ${
                                    stat.trend === "up" ? "text-success" : "text-destructive"
                                } ${animatedValues[index] ? (stat.trend === "up" ? "number-up" : "number-down") : ""}`}
                            >
                {stat.change}
              </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TradingStats;