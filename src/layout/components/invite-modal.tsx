import { useCallback, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useWorkspaces } from '@/hooks/use-workspaces';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const { t } = useTranslation();
  const { currentWorkspace, inviteUser } = useWorkspaces();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [sendEmail, setSendEmail] = useState(true);

  const handleInvite = useCallback(async () => {
    if (!currentWorkspace?.id) return;
    if (!email) {
      toast.error('Email is required');
      return;
    }

    try {
      await inviteUser.mutateAsync({
        workspaceId: currentWorkspace.id,
        email,
        role,
        sendEmail,
      });
      toast.success(t('layout.invite.success'));
      setEmail('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to send invitation');
      console.error(error);
    }
  }, [currentWorkspace?.id, email, role, sendEmail, inviteUser, onOpenChange, t]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('layout.invite.title')}</DialogTitle>
          <DialogDescription>
            {t('layout.sidebar.inviteTooltip')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('layout.invite.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">{t('layout.invite.role')}</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder={t('layout.invite.role')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{t('layout.invite.role.admin')}</SelectItem>
                <SelectItem value="member">{t('layout.invite.role.member')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendEmail"
              checked={sendEmail}
              onCheckedChange={(checked) => setSendEmail(!!checked)}
            />
            <Label
              htmlFor="sendEmail"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('layout.invite.sendEmail')}
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleInvite} disabled={inviteUser.isPending}>
            {t('layout.invite.send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
