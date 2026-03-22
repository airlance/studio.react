import { Send, CalendarClock, FileText, Users } from 'lucide-react';
import { ActivityItem } from './dashboardData';

const ACTIVITY_ICONS: Record<ActivityItem['type'], React.ElementType> = {
    sent: Send,
    scheduled: CalendarClock,
    draft_saved: FileText,
    list_added: Users,
};

const ACTIVITY_ICON_BG: Record<ActivityItem['type'], string> = {
    sent: 'bg-accent/15 text-accent',
    scheduled: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    draft_saved: 'bg-secondary text-muted-foreground',
    list_added: 'bg-primary/10 text-primary',
};

interface ActivityFeedProps {
    items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
    return (
        <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-3.5">
                <p className="text-sm font-medium text-foreground">Recent activity</p>
            </div>

            <div className="divide-y divide-border/50">
                {items.map((item) => {
                    const Icon = ACTIVITY_ICONS[item.type];
                    const iconBg = ACTIVITY_ICON_BG[item.type];

                    return (
                        <div key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                            <div
                                className={[
                                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                                    iconBg,
                                ].join(' ')}
                            >
                                <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {item.label}
                                </p>
                                <p className="text-xs text-muted-foreground">{item.meta}</p>
                            </div>
                            <span className="shrink-0 text-xs text-muted-foreground">
                                {item.time}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}