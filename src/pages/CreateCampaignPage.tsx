import { useCallback } from 'react';
import { CampaignWizard } from '@/components/campaign-wizard';
import { CampaignFormData } from '@/types/campaign';

export default function CreateCampaignPage() {
    const handleSave = useCallback(async (data: CampaignFormData) => {
        console.log('[Draft save]', data);
        // POST /api/campaigns { ...data, status: 'draft' }
    }, []);

    const handleSend = useCallback(async (data: CampaignFormData) => {
        console.log('[Send campaign]', data);
        // POST /api/campaigns { ...data, status: data.scheduleType === 'now' ? 'sending' : 'scheduled' }
    }, []);

    const handleOpenBuilder = useCallback((data: CampaignFormData) => {
        console.log('[Open builder]', data);
        // navigate('/builder', { state: { campaignId, returnTo: '/campaigns/create' } })
    }, []);

    const handleSendTest = useCallback((data: CampaignFormData) => {
        console.log('[Send test]', data);
        // open a modal / drawer to enter test email address
    }, []);

    return (
        <div className="min-h-screen bg-canvas p-6 sm:p-10">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-foreground">
                        Create campaign
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        New email campaign
                    </p>
                </div>
                <CampaignWizard
                    onSave={handleSave}
                    onSend={handleSend}
                    onOpenBuilder={handleOpenBuilder}
                    onSendTest={handleSendTest}
                />
            </div>
        </div>
    );
}