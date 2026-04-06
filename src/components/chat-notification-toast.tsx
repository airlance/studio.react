import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Hash, MessageSquare } from 'lucide-react';

interface ChatNotificationToastProps {
    senderName: string;
    avatarUrl?: string;
    chatLabel: string;     // channel name or "Direct Message"
    isChannel: boolean;
    preview: string;
    onClick: () => void;
}

export function ChatNotificationToast({
                                          senderName,
                                          avatarUrl,
                                          chatLabel,
                                          isChannel,
                                          preview,
                                          onClick,
                                      }: ChatNotificationToastProps) {
    const initials = senderName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <button
            onClick={onClick}
            className="flex w-full items-start gap-3 rounded-md p-1 text-left transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            <Avatar className="mt-0.5 h-9 w-9 shrink-0">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold leading-none">{senderName}</span>
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        {isChannel
                            ? <Hash className="h-3 w-3" />
                            : <MessageSquare className="h-3 w-3" />
                        }
                        {chatLabel}
                    </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {preview}
                </p>
            </div>
        </button>
    );
}