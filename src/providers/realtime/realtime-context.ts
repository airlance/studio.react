import { createContext } from 'react';

export interface RealtimeContextType {
    // Presence
    onlineUsers: Set<string>;
    isOnline: (userId: string) => boolean;
    // Event bus — subscribe to raw WS events
    addMessageListener: (handler: (data: unknown) => void) => () => void;
}

export const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);