import { ReactNode, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatNavigationContext, ActiveChat } from './chat-navigation-context';

export function ChatNavigationProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);

    const navigateToChat = useCallback((id: string, isChannel: boolean) => {
        setActiveChat({ id, isChannel });
        navigate('/chat');
    }, [navigate]);

    return (
        <ChatNavigationContext.Provider value={{ activeChat, navigateToChat }}>
            {children}
        </ChatNavigationContext.Provider>
    );
}