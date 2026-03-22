import { TrendingUp, TrendingDown } from 'lucide-react';
import { StatCard as StatCardType } from './dashboardData';

interface StatCardProps {
    stat: StatCardType;
}

export function StatCard({ stat }: StatCardProps) {
    const isPositive = stat.change > 0;
    const isNeutral = stat.change === 0;

    return (
        <div className="rounded-lg border border-border bg-card px-5 py-4">
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums">
                {stat.value}
            </p>
            {!isNeutral && (
                <div
                    className={[
                        'mt-2 flex items-center gap-1 text-xs font-medium',
                        isPositive ? 'text-accent' : 'text-destructive',
                    ].join(' ')}
                >
                    {isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    <span>
                        {isPositive ? '+' : ''}
                        {stat.change}% {stat.changePeriod}
                    </span>
                </div>
            )}
        </div>
    );
}