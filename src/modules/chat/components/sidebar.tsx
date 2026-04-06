import { useTranslation } from '@/hooks/useTranslation';
import { Channel, DirectMessageConversation } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Hash, MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMembers } from '@/hooks/use-members';
import { CreateChannelDialog } from './create-channel-dialog';
import { StartDMDialog } from './start-dm-dialog';
import { useChat } from '@/hooks/use-chat';
import { useState } from 'react';

interface ChatSidebarProps {
    workspaceId?: string;
    channels: Channel[];
    conversations: DirectMessageConversation[];
    activeId?: string;
    onSelect: (id: string, isChannel: boolean) => void;
    currentUserId?: string;
}

export function ChatSidebar({ 
    workspaceId,
    channels, 
    conversations, 
    activeId, 
    onSelect,
    currentUserId 
}: ChatSidebarProps) {
    const { t } = useTranslation();
    const { members } = useMembers(workspaceId);
    const { createChannel, getOrCreateConversation } = useChat(workspaceId);

    const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
    const [isStartDMOpen, setIsStartDMOpen] = useState(false);

    const getMemberName = (userId: string) => {
        const member = members.find(m => m.user_id === userId);
        return member ? `${member.first_name} ${member.last_name}` : userId;
    };

    const handleCreateChannel = async (data: { name: string; description: string; is_private: boolean; participants: string[] }) => {
        try {
            const channel = await createChannel.mutateAsync(data);
            if (channel) {
                onSelect(channel.id, true);
            }
        } catch (err) {
            console.error('Failed to create channel', err);
        }
    };

    const handleStartDM = async (userId: string) => {
        try {
            const conv = await getOrCreateConversation.mutateAsync(userId);
            if (conv) {
                onSelect(conv.id, false);
            }
        } catch (err) {
            console.error('Failed to start conversation', err);
        }
    };

    return (
        <div className="flex h-full w-64 flex-col border-r bg-muted/30">
            <div className="flex h-14 items-center justify-between px-4 border-b">
                <span className="font-semibold">{t('layout.sidebar.chat')}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 space-y-6">
                <div className="px-3">
                    <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        {t('chat.channels')}
                        <Plus 
                            className="h-3 w-3 cursor-pointer hover:text-foreground transition-colors" 
                            onClick={() => setIsCreateChannelOpen(true)}
                        />
                    </h3>
                    <div className="space-y-1">
                        {channels.map((channel) => (
                            <Button
                                key={channel.id}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start font-normal h-9",
                                    activeId === channel.id && "bg-secondary text-secondary-foreground"
                                )}
                                onClick={() => onSelect(channel.id, true)}
                            >
                                <Hash className="mr-2 h-4 w-4 opacity-70" />
                                {channel.name}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="px-3">
                    <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        {t('chat.directMessages')}
                        <Plus 
                            className="h-3 w-3 cursor-pointer hover:text-foreground transition-colors" 
                            onClick={() => setIsStartDMOpen(true)}
                        />
                    </h3>
                    <div className="space-y-1">
                        {conversations.map((conv) => {
                            const otherUserId = conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id;
                            return (
                                <Button
                                    key={conv.id}
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start font-normal h-9",
                                        activeId === conv.id && "bg-secondary text-secondary-foreground"
                                    )}
                                    onClick={() => onSelect(conv.id, false)}
                                >
                                    <MessageSquare className="mr-2 h-4 w-4 opacity-70" />
                                    {getMemberName(otherUserId)}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <CreateChannelDialog
                open={isCreateChannelOpen}
                onOpenChange={setIsCreateChannelOpen}
                onSubmit={handleCreateChannel}
                members={members}
                isLoading={createChannel.isPending}
            />

            <StartDMDialog
                open={isStartDMOpen}
                onOpenChange={setIsStartDMOpen}
                onSelect={handleStartDM}
                members={members}
                currentUserId={currentUserId}
            />
        </div>
    );
}
