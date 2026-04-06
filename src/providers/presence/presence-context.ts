import { createContext } from 'react';

export interface PresenceContextType {
    onlineUsers: Set<string>;
    isOnline: (userId: string) => boolean;
    addMessageListener: (handler: (data: any) => void) => () => void;
}

export const PresenceContext = createContext<PresenceContextType | undefined>(undefined);
