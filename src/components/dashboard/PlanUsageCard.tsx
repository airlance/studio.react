import { PlanUsage } from './dashboardData';

interface PlanUsageCardProps {
    items: PlanUsage[];
}

function UsageBar({ used, total }: { used: number; total: number }) {
    const pct = Math.min(100, Math.round((used / total) * 100));
    const isWarning = pct >= 80;
    const isDanger = pct >= 95;

    return (
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
                className={[
                    'h-full rounded-full transition-all',
                    isDanger
                        ? 'bg-destructive'
                        : isWarning
                            ? 'bg-amber-500'
                            : 'bg-primary',
                ].join(' ')}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

export function PlanUsageCard({ items }: PlanUsageCardProps) {
    return (
        <div className="rounded-lg border border-border bg-card px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Plan usage</p>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Growth plan
                </span>
            </div>

            <div className="space-y-4">
                {items.map((item) => {
                    const pct = Math.round((item.used / item.total) * 100);
                    return (
                        <div key={item.label}>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{item.label}</span>
                                <span className="text-xs font-medium tabular-nums text-foreground">
                                    {item.used.toLocaleString()} / {item.total.toLocaleString()}{' '}
                                    <span className="text-muted-foreground">{item.unit}</span>
                                </span>
                            </div>
                            <UsageBar used={item.used} total={item.total} />
                            <p className="mt-0.5 text-right text-[10px] text-muted-foreground">
                                {pct}% used
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 border-t border-border pt-3">
                <button className="w-full rounded-md border border-border py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    Upgrade plan
                </button>
            </div>
        </div>
    );
}