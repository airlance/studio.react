import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '@/lib/api';
import { Channel, ChatMessage, DirectMessageConversation, SendMessageInput } from '@/types/chat';
import { usePresence } from './use-presence';

export const useChat = (workspaceId?: string) => {
    const queryClient = useQueryClient();
    const { addMessageListener } = usePresence();

    // Fetch channels
    const channelsQuery = useQuery({
        queryKey: ['workspaces', workspaceId, 'chat', 'channels'],
        queryFn: async () => {
            if (!workspaceId) return [];
            const { data } = await api.get<Channel[]>(`/workspaces/${workspaceId}/chat/channels`);
            return data;
        },
        enabled: !!workspaceId,
    });

    // Fetch conversations (DMs)
    const conversationsQuery = useQuery({
        queryKey: ['workspaces', workspaceId, 'chat', 'conversations'],
        queryFn: async () => {
            if (!workspaceId) return [];
            const { data } = await api.get<DirectMessageConversation[]>(`/workspaces/${workspaceId}/chat/conversations`);
            return data;
        },
        enabled: !!workspaceId,
    });

    // Fetch messages for a specific target (channel or conversation)
    const useMessages = (targetId?: string) => {
        return useQuery({
            queryKey: ['chat', 'messages', targetId],
            queryFn: async () => {
                if (!workspaceId || !targetId) return [];
                const { data } = await api.get<ChatMessage[]>(`/workspaces/${workspaceId}/chat/messages/${targetId}`);
                // Create a copy before reversing to avoid mutating the cache data directly
                return [...data].reverse();
            },
            enabled: !!workspaceId && !!targetId,
        });
    };

    // Send message
    // Send message
    const sendMessageMutation = useMutation({
        mutationFn: async ({ targetId, input }: { targetId: string; input: SendMessageInput }) => {
            if (!workspaceId) return;
            const { data } = await api.post<ChatMessage>(`/workspaces/${workspaceId}/chat/messages/${targetId}`, input);
            return data;
        },
        onSuccess: (data) => {
            if (data) {
                const targetId = data.channel_id || data.conversation_id;
                queryClient.setQueryData(['chat', 'messages', targetId], (old: ChatMessage[] | undefined) => {
                    // Check if message was already added via real-time WebSocket update
                    if (old?.some(m => m.id === data.id)) return old;
                    return old ? [...old, data] : [data];
                });
            }
        },
    });

    // Create channel
    const createChannelMutation = useMutation({
        mutationFn: async (input: { name: string; description?: string; is_private: boolean; participants?: string[] }) => {
            if (!workspaceId) return;
            const { data } = await api.post<Channel>(`/workspaces/${workspaceId}/chat/channels`, input);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'chat', 'channels'] });
        },
    });

    // Get or create conversation (DM)
    const getOrCreateConversationMutation = useMutation({
        mutationFn: async (targetUserId: string) => {
            if (!workspaceId) return;
            const { data } = await api.post<DirectMessageConversation>(`/workspaces/${workspaceId}/chat/conversations`, { target_user_id: targetUserId });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'chat', 'conversations'] });
        },
    });

    // Handle real-time updates
    useEffect(() => {
        if (!workspaceId) return;

        const cleanup = addMessageListener((event: any) => {
            let msg: ChatMessage | null = null;
            
            // New standard format
            if (event.type === 'CHAT_MESSAGE' && event.payload) {
                msg = event.payload as ChatMessage;
            } 
            // Fallback for legacy or direct message format
            else if (event.content && event.sender_id) {
                msg = event as ChatMessage;
            }

            if (msg) {
                const targetId = msg.channel_id || msg.conversation_id;
                console.log('Real-time message received:', msg.id, 'for target:', targetId);
                
                queryClient.setQueryData(['chat', 'messages', targetId], (old: ChatMessage[] | undefined) => {
                    // Only add if not already in state
                    if (old?.some(m => m.id === msg!.id)) return old;
                    return old ? [...old, msg!] : [msg!];
                });
            }
        });

        return cleanup;
    }, [workspaceId, addMessageListener, queryClient]);

    return {
        channels: channelsQuery.data || [],
        conversations: conversationsQuery.data || [],
        isLoading: channelsQuery.isLoading || conversationsQuery.isLoading,
        useMessages,
        sendMessage: sendMessageMutation,
        createChannel: createChannelMutation,
        getOrCreateConversation: getOrCreateConversationMutation,
    };
};
