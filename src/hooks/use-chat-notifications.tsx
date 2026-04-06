import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { usePresence } from './use-presence';
import { useChatNavigation } from './use-chat-navigation';
import { useAuth } from './use-auth';
import { ChatNotificationToast } from '@/components/chat-notification-toast';
import { ChatMessage, Channel, DirectMessageConversation } from '@/types/chat';

interface NotificationDeps {
    // Pass live channel/conversation lists so the hook can resolve names
    channels: Channel[];
    conversations: DirectMessageConversation[];
    // Member lookup: userId → { first_name, last_name, avatar_url }
    getMember: (userId: string) => { first_name: string; last_name: string; avatar_url?: string } | undefined;
}

export function useChatNotifications({ channels, conversations, getMember }: NotificationDeps) {
    const { addMessageListener } = usePresence();
    const { activeChat, navigateToChat } = useChatNavigation();
    const { user } = useAuth();
    const location = useLocation();

    // Keep latest values in refs so the listener closure never goes stale
    const activeChatRef = useRef(activeChat);
    const locationRef = useRef(location.pathname);
    const channelsRef = useRef(channels);
    const conversationsRef = useRef(conversations);
    const getMemberRef = useRef(getMember);
    const userRef = useRef(user);

    useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);
    useEffect(() => { locationRef.current = location.pathname; }, [location.pathname]);
    useEffect(() => { channelsRef.current = channels; }, [channels]);
    useEffect(() => { conversationsRef.current = conversations; }, [conversations]);
    useEffect(() => { getMemberRef.current = getMember; }, [getMember]);
    useEffect(() => { userRef.current = user; }, [user]);

    useEffect(() => {
        const cleanup = addMessageListener((event: unknown) => {
            const envelope = event as Record<string, unknown>;

            // Only handle chat messages
            if (envelope.type !== 'CHAT_MESSAGE' || !envelope.payload) return;

            const msg = envelope.payload as ChatMessage;

            // Don't notify for own messages
            if (msg.sender_id === userRef.current?.id) return;

            const targetId = msg.channel_id ?? msg.conversation_id;
            if (!targetId) return;

            const isChannel = Boolean(msg.channel_id);

            // Suppress if user is already viewing this exact chat
            const onChatPage = locationRef.current.startsWith('/chat');
            const viewingThisChat = activeChatRef.current?.id === targetId;
            if (onChatPage && viewingThisChat) return;

            // Resolve sender
            const sender = getMemberRef.current(msg.sender_id);
            const senderName = sender
                ? `${sender.first_name} ${sender.last_name}`.trim()
                : msg.sender_id;

            // Resolve chat label
            let chatLabel = 'Chat';
            if (isChannel) {
                const channel = channelsRef.current.find(c => c.id === targetId);
                chatLabel = channel?.name ?? 'channel';
            } else {
                chatLabel = 'Direct Message';
            }

            toast.custom(
                (toastId) => (
                    <ChatNotificationToast
                        senderName={senderName}
            avatarUrl={sender?.avatar_url}
            chatLabel={chatLabel}
            isChannel={isChannel}
            preview={msg.content}
            onClick={() => {
                toast.dismiss(toastId);
                navigateToChat(targetId, isChannel);
            }}
            />
        ),
            {
                duration: 5000,
                    position: 'bottom-right',
            },
        );
        });

        return cleanup;
    }, [addMessageListener, navigateToChat]);
}