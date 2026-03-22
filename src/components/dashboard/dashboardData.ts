export interface StatCard {
    label: string;
    value: string | number;
    change: number;
    changePeriod: string;
}

export interface PlanUsage {
    label: string;
    used: number;
    total: number;
    unit: string;
}

export interface RecentCampaign {
    id: string;
    name: string;
    status: 'sent' | 'scheduled' | 'draft' | 'sending';
    sentAt: string | null;
    recipients: number;
    openRate: number;
    clickRate: number;
}

export interface ActivityItem {
    id: string;
    type: 'sent' | 'scheduled' | 'draft_saved' | 'list_added';
    label: string;
    meta: string;
    time: string;
}

export const MOCK_STATS: StatCard[] = [
    { label: 'Emails sent (30d)', value: '48,320', change: 12.4, changePeriod: 'vs last month' },
    { label: 'Avg. open rate',    value: '26.8%',  change: 1.2,  changePeriod: 'vs last month' },
    { label: 'Avg. click rate',   value: '4.1%',   change: -0.3, changePeriod: 'vs last month' },
    { label: 'Unsubscribes',      value: '142',    change: -8.5, changePeriod: 'vs last month' },
];

export const MOCK_PLAN: PlanUsage[] = [
    { label: 'Emails this month', used: 48320, total: 100000, unit: 'emails' },
    { label: 'Contacts',          used: 14820, total: 25000,  unit: 'contacts' },
    { label: 'Active automations',used: 3,     total: 10,     unit: 'flows' },
];

export const MOCK_CAMPAIGNS: RecentCampaign[] = [
    { id: 'c1', name: 'Spring sale announcement',   status: 'sent',      sentAt: '2025-03-18', recipients: 12400, openRate: 31.2, clickRate: 5.8 },
    { id: 'c2', name: 'Product update — March',     status: 'sent',      sentAt: '2025-03-14', recipients: 8900,  openRate: 24.7, clickRate: 3.2 },
    { id: 'c3', name: 'Weekly digest #42',          status: 'scheduled', sentAt: '2025-03-25', recipients: 14820, openRate: 0,    clickRate: 0   },
    { id: 'c4', name: 'Re-engagement — inactive',   status: 'draft',     sentAt: null,         recipients: 0,     openRate: 0,    clickRate: 0   },
    { id: 'c5', name: 'VIP early access',           status: 'sent',      sentAt: '2025-03-10', recipients: 430,   openRate: 58.1, clickRate: 22.4},
];

export const MOCK_ACTIVITY: ActivityItem[] = [
    { id: 'a1', type: 'sent',        label: 'Spring sale announcement sent',  meta: '12,400 recipients', time: '2h ago'  },
    { id: 'a2', type: 'scheduled',   label: 'Weekly digest #42 scheduled',   meta: 'Mar 25, 10:00 UTC', time: '5h ago'  },
    { id: 'a3', type: 'draft_saved', label: 'Re-engagement draft saved',     meta: 'by you',            time: '1d ago'  },
    { id: 'a4', type: 'list_added',  label: 'New signups list updated',      meta: '+234 contacts',     time: '2d ago'  },
];