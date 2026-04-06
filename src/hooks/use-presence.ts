import { useContext } from 'react';
import { PresenceContext, PresenceContextType } from '@/providers/presence/presence-context';

export const usePresence = (): PresenceContextType => {
    const context = useContext(PresenceContext);
    if (context === undefined) {
        throw new Error('usePresence must be used within a PresenceProvider');
    }
    return context;
};
