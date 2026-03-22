export type CampaignType = 'regular' | 'ab' | 'automated';

export type ScheduleType = 'now' | 'later';

export type CampaignStatus =
    | 'draft'
    | 'scheduled'
    | 'sending'
    | 'sent'
    | 'paused'
    | 'error';

export interface SenderOption {
    id: string;
    name: string;
    email: string;
    verified: boolean;
}

export interface ContactList {
    id: string;
    name: string;
    count: number;
}

export type WizardStep = 'metadata' | 'sender' | 'audience' | 'content' | 'schedule' | 'review';

export const WIZARD_STEPS: WizardStep[] = [
    'metadata',
    'sender',
    'audience',
    'content',
    'schedule',
    'review',
];

export const STEP_LABELS: Record<WizardStep, string> = {
    metadata: 'Metadata',
    sender: 'Sender',
    audience: 'Audience',
    content: 'Content',
    schedule: 'Schedule',
    review: 'Review',
};

export interface CampaignFormData {
    name: string;
    type: CampaignType;
    fromName: string;
    fromEmail: string;
    replyTo: string;
    listIds: string[];
    subject: string;
    preheader: string;
    templateId: string | null;
    templateHtml: string | null;
    scheduleType: ScheduleType;
    sendDate: string;
    sendTime: string;
    timezone: string;
}

export const CAMPAIGN_FORM_DEFAULTS: CampaignFormData = {
    name: '',
    type: 'regular',
    fromName: '',
    fromEmail: '',
    replyTo: '',
    listIds: [],
    subject: '',
    preheader: '',
    templateId: null,
    templateHtml: null,
    scheduleType: 'now',
    sendDate: '',
    sendTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
};

export type StepErrors = Partial<Record<string, string>>;