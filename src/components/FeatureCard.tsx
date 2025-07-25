import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    className?: string;
}

const FeatureCard = ({ icon: Icon, title, description, className = "" }: FeatureCardProps) => {
    return (
        <div className={`gradient-card p-6 rounded-lg border border-border/50 hover:border-primary/30 transition-smooth hover:shadow-lg hover:scale-105 fade-in-scale ${className}`}>
            <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
};

export default FeatureCard;