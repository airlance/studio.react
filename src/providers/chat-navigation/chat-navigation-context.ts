import { createContext } from 'react';

export interface ActiveChat {
    id: string;
    isChannel: boolean;
}

export interface ChatNavigationContextType {
    activeChat: ActiveChat | null;
    navigateToChat: (id: string, isChannel: boolean) => void;
}

export const ChatNavigationContext = createContext<ChatNavigationContextType | undefined>(undefined);