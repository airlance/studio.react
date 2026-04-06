import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '@/lib/api';
import { Channel, ChatMessage, DirectMessageConversation, SendMessageInput } from '@/types/chat';
import { usePresence } from './use-presence';

// ─── standalone hook — call at top level, not inside another hook ─────────────
export const useMessages = (workspaceId: string | undefined, targetId: string | undefined) => {
    return useQuery({
        queryKey: ['chat', 'messages', targetId],
        queryFn: async () => {
            if (!workspaceId || !targetId) return [];
            const { data } = await api.get<ChatMessage[]>(
                `/workspaces/${workspaceId}/chat/messages/${targetId}`,
            );
            // Reverse once here so oldest-first; the array from the server is newest-first
            return [...data].reverse();
        },
        enabled: !!workspaceId && !!targetId,
    });
};

// ─── main hook ────────────────────────────────────────────────────────────────
export const useChat = (workspaceId?: string) => {
    const queryClient = useQueryClient();
    const { addMessageListener } = usePresence();

    const channelsQuery = useQuery({
        queryKey: ['workspaces', workspaceId, 'chat', 'channels'],
        queryFn: async () => {
            if (!workspaceId) return [];
            const { data } = await api.get<Channel[]>(`/workspaces/${workspaceId}/chat/channels`);
            return data;
        },
        enabled: !!workspaceId,
    });

    const conversationsQuery = useQuery({
        queryKey: ['workspaces', workspaceId, 'chat', 'conversations'],
        queryFn: async () => {
            if (!workspaceId) return [];
            const { data } = await api.get<DirectMessageConversation[]>(
                `/workspaces/${workspaceId}/chat/conversations`,
            );
            return data;
        },
        enabled: !!workspaceId,
    });

    const sendMessageMutation = useMutation({
        mutationFn: async ({ targetId, input }: { targetId: string; input: SendMessageInput }) => {
            if (!workspaceId) return;
            const { data } = await api.post<ChatMessage>(
                `/workspaces/${workspaceId}/chat/messages/${targetId}`,
                input,
            );
            return data;
        },
        onSuccess: (data) => {
            if (data) {
                const targetId = data.channel_id ?? data.conversation_id;
                queryClient.setQueryData(
                    ['chat', 'messages', targetId],
                    (old: ChatMessage[] | undefined) => {
                        if (old?.some(m => m.id === data.id)) return old;
                        return old ? [...old, data] : [data];
                    },
                );
            }
        },
    });

    const createChannelMutation = useMutation({
        mutationFn: async (input: {
            name: string;
            description?: string;
            is_private: boolean;
            participants?: string[];
        }) => {
            if (!workspaceId) return;
            const { data } = await api.post<Channel>(
                `/workspaces/${workspaceId}/chat/channels`,
                input,
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspaces', workspaceId, 'chat', 'channels'],
            });
        },
    });

    const getOrCreateConversationMutation = useMutation({
        mutationFn: async (targetUserId: string) => {
            if (!workspaceId) return;
            const { data } = await api.post<DirectMessageConversation>(
                `/workspaces/${workspaceId}/chat/conversations`,
                { target_user_id: targetUserId },
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspaces', workspaceId, 'chat', 'conversations'],
            });
        },
    });

    // Real-time message updates for the messages cache
    useEffect(() => {
        if (!workspaceId) return;

        return addMessageListener((event: unknown) => {
            const envelope = event as Record<string, unknown>;
            if (envelope.type !== 'CHAT_MESSAGE' || !envelope.payload) return;

            const msg = envelope.payload as ChatMessage;
            const targetId = msg.channel_id ?? msg.conversation_id;

            queryClient.setQueryData(
                ['chat', 'messages', targetId],
                (old: ChatMessage[] | undefined) => {
                    if (old?.some(m => m.id === msg.id)) return old;
                    return old ? [...old, msg] : [msg];
                },
            );
        });
    }, [workspaceId, addMessageListener, queryClient]);

    return {
        channels: channelsQuery.data ?? [],
        conversations: conversationsQuery.data ?? [],
        isLoading: channelsQuery.isLoading || conversationsQuery.isLoading,
        sendMessage: sendMessageMutation,
        createChannel: createChannelMutation,
        getOrCreateConversation: getOrCreateConversationMutation,
    };
};