import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

const NewsSection = () => {
    const news = [
        {
            id: 1,
            title: "Bitcoin atinge novo máximo histórico em meio à aprovação de ETFs",
            excerpt: "A criptomoeda líder alcançou US$ 73.000, impulsionada pelo interesse institucional crescente.",
            time: "2 horas atrás",
            trend: "up",
            category: "Crypto"
        },
        {
            id: 2,
            title: "Fed sinaliza possível corte nas taxas de juros para 2024",
            excerpt: "Decisão pode impactar significativamente o mercado de câmbio e investimentos.",
            time: "4 horas atrás",
            trend: "up",
            category: "Forex"
        },
        {
            id: 3,
            title: "Ethereum ultrapassa marca de US$ 4.000 com alta demanda por DeFi",
            excerpt: "Protocolos de finanças descentralizadas impulsionam valorização da segunda maior crypto.",
            time: "6 horas atrás",
            trend: "up",
            category: "Crypto"
        },
        {
            id: 4,
            title: "Dólar recua frente ao real após dados positivos da economia brasileira",
            excerpt: "Moeda americana fecha em queda de 0.8% após divulgação do PIB trimestral.",
            time: "8 horas atrás",
            trend: "down",
            category: "Forex"
        }
    ];

    return (
        <section className="py-20 px-6 bg-card/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        Últimas Notícias do Mercado
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Mantenha-se atualizado com as principais movimentações do mercado financeiro
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {news.map((item, index) => (
                        <Card
                            key={item.id}
                            className="p-6 hover:shadow-elegant transition-all duration-300 cursor-pointer group slide-up border-border/50 bg-card/80 backdrop-blur-sm"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {item.category}
                </span>
                                <div className="flex items-center space-x-2">
                                    {item.trend === "up" ? (
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 text-red-500" />
                                    )}
                                    <div className="flex items-center text-muted-foreground text-xs">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {item.time}
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>

                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {item.excerpt}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;