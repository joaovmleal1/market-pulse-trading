import { useEffect, useRef } from "react";

const TradingViewChart = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": "BINANCE:BTCUSDT",
            "interval": "D",
            "timezone": "America/Sao_Paulo",
            "theme": "dark",
            "style": "1",
            "locale": "br",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "calendar": false,
            "support_host": "https://www.tradingview.com"
        });

        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        return () => {
            if (containerRef.current && script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        Análise de Mercado em Tempo Real
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Acompanhe os gráficos profissionais e tome decisões informadas
                    </p>
                </div>

                <div className="relative">
                    <div className="gradient-primary rounded-lg p-1">
                        <div className="bg-card rounded-lg overflow-hidden">
                            <div
                                ref={containerRef}
                                className="tradingview-widget-container"
                                style={{ height: "500px", width: "100%" }}
                            >
                                <div className="tradingview-widget-container__widget"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TradingViewChart;