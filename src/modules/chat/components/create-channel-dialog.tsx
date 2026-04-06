import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MemberInfo } from '@/hooks/use-members';

interface CreateChannelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { 
        name: string; 
        description: string; 
        is_private: boolean; 
        participants: string[] 
    }) => void;
    members: MemberInfo[];
    isLoading?: boolean;
}

export function CreateChannelDialog({
    open,
    onOpenChange,
    onSubmit,
    members,
    isLoading
}: CreateChannelDialogProps) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            description,
            is_private: isPrivate,
            participants: selectedMembers,
        });
        // Reset form
        setName('');
        setDescription('');
        setIsPrivate(false);
        setSelectedMembers([]);
        onOpenChange(false);
    };

    const toggleMember = (userId: string) => {
        setSelectedMembers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId) 
                : [...prev, userId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('chat.createChannel')}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t('chat.channelName')}</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. marketing"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">{t('chat.description')}</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What is this channel about?"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="private"
                                checked={isPrivate}
                                onCheckedChange={setIsPrivate}
                            />
                            <Label htmlFor="private">{t('chat.privateChannel')}</Label>
                        </div>

                        {isPrivate && (
                            <div className="grid gap-2">
                                <Label>{t('chat.selectMembers')}</Label>
                                <ScrollArea className="h-40 border rounded-md p-2">
                                    <div className="space-y-2">
                                        {members.map((member) => (
                                            <div key={member.user_id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`member-${member.user_id}`}
                                                    checked={selectedMembers.includes(member.user_id)}
                                                    onCheckedChange={() => toggleMember(member.user_id)}
                                                />
                                                <label
                                                    htmlFor={`member-${member.user_id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {member.first_name} {member.last_name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading || !name}>
                            {t('common.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
