import { ChatMessage } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import { useMembers } from '@/hooks/use-members';

interface MessageListProps {
    workspaceId: string;
    messages: ChatMessage[];
}

export function MessageList({ workspaceId, messages }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { members } = useMembers(workspaceId);

    const getMember = (userId: string) => {
        return members.find(m => m.user_id === userId);
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {messages.map((msg) => {
                const member = getMember(msg.sender_id);
                return (
                    <div key={msg.id} className="flex items-start gap-4">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={member?.avatar_url} />
                            <AvatarFallback>
                                {member?.first_name?.[0]}{member?.last_name?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">
                                    {member ? `${member.first_name} ${member.last_name}` : msg.sender_id}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {format(new Date(msg.created_at), 'HH:mm')}
                                </span>
                            </div>
                            <div className="text-sm text-foreground/90 mt-1">
                                {msg.content}
                            </div>
                        </div>
                    </div>
                );
            })}
            {messages.length === 0 && (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                    No messages yet. Send one to start the conversation!
                </div>
            )}
        </div>
    );
}
