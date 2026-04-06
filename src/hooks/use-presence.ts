import { useContext } from 'react';
import { RealtimeContext, RealtimeContextType } from '@/providers/realtime/realtime-context';

// Backward-compatible alias so existing consumers don't need changes
export type { RealtimeContextType as PresenceContextType };

export const usePresence = (): RealtimeContextType => {
    const context = useContext(RealtimeContext);
    if (context === undefined) {
        throw new Error('usePresence must be used within a RealtimeProvider');
    }
    return context;
};