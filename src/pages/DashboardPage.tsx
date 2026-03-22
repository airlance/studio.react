import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { PlanUsageCard } from '@/components/dashboard/PlanUsageCard';
import { RecentCampaignsTable } from '@/components/dashboard/RecentCampaignsTable';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import {
    MOCK_STATS,
    MOCK_PLAN,
    MOCK_CAMPAIGNS,
    MOCK_ACTIVITY,
} from '@/components/dashboard/dashboardData';

export default function DashboardPage() {
    const navigate = useNavigate();

    const handleCreateCampaign = useCallback(
        () => navigate('/campaigns/create'),
        [navigate],
    );

    return (
        <div className="px-6 py-6 sm:px-8 sm:py-8 space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Welcome back — here's what's happening.
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={handleCreateCampaign}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                    <Plus className="mr-1.5 h-4 w-4" />
                    New campaign
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {MOCK_STATS.map((stat) => (
                    <StatCard key={stat.label} stat={stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RecentCampaignsTable campaigns={MOCK_CAMPAIGNS} />
                </div>
                <div className="space-y-6">
                    <PlanUsageCard items={MOCK_PLAN} />
                    <ActivityFeed items={MOCK_ACTIVITY} />
                </div>
            </div>

        </div>
    );
}