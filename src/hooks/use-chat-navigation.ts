import { useContext } from 'react';
import { ChatNavigationContext, ChatNavigationContextType } from '@/providers/chat-navigation/chat-navigation-context';

export const useChatNavigation = (): ChatNavigationContextType => {
    const context = useContext(ChatNavigationContext);
    if (context === undefined) {
        throw new Error('useChatNavigation must be used within a ChatNavigationProvider');
    }
    return context;
};