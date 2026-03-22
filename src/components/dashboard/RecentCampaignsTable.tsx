import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecentCampaign } from './dashboardData';
import { CampaignStatus } from '@/types/campaign';

const STATUS_CONFIG: Record<
    CampaignStatus,
    { label: string; dotClass: string; textClass: string }
> = {
    sent: {
        label: 'Sent',
        dotClass: 'text-accent',
        textClass: 'text-accent',
    },
    scheduled: {
        label: 'Scheduled',
        dotClass: 'text-amber-500',
        textClass: 'text-amber-600',
    },
    draft: {
        label: 'Draft',
        dotClass: 'text-muted-foreground',
        textClass: 'text-muted-foreground',
    },
    sending: {
        label: 'Sending…',
        dotClass: 'text-primary',
        textClass: 'text-primary',
    },
    paused: {
        label: 'Paused',
        dotClass: 'text-orange-400',
        textClass: 'text-orange-500',
    },
    error: {
        label: 'Error',
        dotClass: 'text-destructive',
        textClass: 'text-destructive',
    },
};

interface RecentCampaignsTableProps {
    campaigns: RecentCampaign[];
}

export function RecentCampaignsTable({ campaigns }: RecentCampaignsTableProps) {
    const navigate = useNavigate();

    const handleViewAll = useCallback(() => navigate('/campaigns'), [navigate]);
    const handleRowClick = useCallback(
        (id: string) => navigate(`/campaigns/${id}`),
        [navigate],
    );

    return (
        <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <p className="text-sm font-medium text-foreground">Recent campaigns</p>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-muted-foreground"
                    onClick={handleViewAll}
                >
                    View all
                    <ArrowRight className="h-3 w-3" />
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-border">
                        <th className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground">
                            Name
                        </th>
                        <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">
                            Status
                        </th>
                        <th className="px-3 py-2.5 text-right text-xs font-medium text-muted-foreground">
                            Recipients
                        </th>
                        <th className="px-3 py-2.5 text-right text-xs font-medium text-muted-foreground">
                            Open rate
                        </th>
                        <th className="px-3 py-2.5 text-right text-xs font-medium text-muted-foreground">
                            Click rate
                        </th>
                        <th className="px-5 py-2.5 text-right text-xs font-medium text-muted-foreground">
                            Date
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {campaigns.map((c) => {
                        const cfg = STATUS_CONFIG[c.status];
                        return (
                            <tr
                                key={c.id}
                                onClick={() => handleRowClick(c.id)}
                                className="cursor-pointer border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/40"
                            >
                                <td className="px-5 py-3 font-medium text-foreground">
                                    {c.name}
                                </td>
                                <td className="px-3 py-3">
                                        <span
                                            className={[
                                                'inline-flex items-center gap-1.5 text-xs font-medium',
                                                cfg.textClass,
                                            ].join(' ')}
                                        >
                                            <Circle
                                                className={['h-1.5 w-1.5 fill-current', cfg.dotClass].join(' ')}
                                            />
                                            {cfg.label}
                                        </span>
                                </td>
                                <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                                    {c.recipients > 0
                                        ? c.recipients.toLocaleString()
                                        : '—'}
                                </td>
                                <td className="px-3 py-3 text-right tabular-nums">
                                    {c.openRate > 0 ? (
                                        <span className="text-foreground">{c.openRate}%</span>
                                    ) : (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </td>
                                <td className="px-3 py-3 text-right tabular-nums">
                                    {c.clickRate > 0 ? (
                                        <span className="text-foreground">{c.clickRate}%</span>
                                    ) : (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </td>
                                <td className="px-5 py-3 text-right text-xs text-muted-foreground">
                                    {c.sentAt ?? '—'}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}