import { useEffect, useState } from "react";

interface AnimatedCounterProps {
    target: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    className?: string;
}

const AnimatedCounter = ({
                             target,
                             prefix = "",
                             suffix = "",
                             duration = 2000,
                             className = ""
                         }: AnimatedCounterProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startValue + (target - startValue) * easeOutQuart);

            setCount(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        const timer = setTimeout(() => {
            animate();
        }, 500); // Delay start for better UX

        return () => clearTimeout(timer);
    }, [target, duration]);

    return (
        <span className={`font-bold ${className}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
    );
};

export default AnimatedCounter;