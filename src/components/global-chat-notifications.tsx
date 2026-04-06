import { useWorkspaces } from '@/hooks/use-workspaces';
import { useChat } from '@/hooks/use-chat';
import { useMembers } from '@/hooks/use-members';
import { useChatNotifications } from '@/hooks/use-chat-notifications.tsx';
import { useCallback } from 'react';

/**
 * Mounts as a renderless component inside ModulesProvider (inside Router).
 * Needs Router context for useLocation + useChatNavigation.
 */
export function GlobalChatNotifications() {
    const { currentWorkspace } = useWorkspaces();
    const workspaceId = currentWorkspace?.id;

    const { channels, conversations } = useChat(workspaceId);
    const { members } = useMembers(workspaceId);

    const getMember = useCallback(
        (userId: string) => members.find(m => m.user_id === userId),
        [members],
    );

    useChatNotifications({ channels, conversations, getMember });

    return null;
}