import { useTranslation } from '@/hooks/useTranslation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MemberInfo } from '@/hooks/use-members';
import { usePresence } from '@/hooks/use-presence';

interface StartDMDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (userId: string) => void;
    members: MemberInfo[];
    currentUserId?: string;
}

export function StartDMDialog({
    open,
    onOpenChange,
    onSelect,
    members,
    currentUserId
}: StartDMDialogProps) {
    const { t } = useTranslation();
    const { isOnline } = usePresence();

    // Filter out the current user
    const otherMembers = members.filter(m => m.user_id !== currentUserId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>{t('chat.directMessage')}</DialogTitle>
                </DialogHeader>
                <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder={t('chat.searchMembers')} />
                    <CommandList>
                        <CommandEmpty>{t('common.noResults')}</CommandEmpty>
                        <CommandGroup heading={t('chat.members')}>
                            {otherMembers.map((member) => (
                                <CommandItem
                                    key={member.user_id}
                                    value={`${member.first_name} ${member.last_name} ${member.email}`}
                                    onSelect={() => {
                                        onSelect(member.user_id);
                                        onOpenChange(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-center space-x-3 w-full">
                                        <div className="relative">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={member.avatar_url} />
                                                <AvatarFallback>
                                                    {member.first_name[0]}{member.last_name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            {isOnline(member.user_id) && (
                                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {member.first_name} {member.last_name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {member.email}
                                            </span>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
