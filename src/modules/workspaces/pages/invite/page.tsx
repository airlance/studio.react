import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScreenLoader } from '@/components/screen-loader';
import api from '@/lib/api';
import { toast } from 'sonner';

interface InvitePreview {
  id: string;
  slug: string;
  name: string;
  logo_url: string;
  members_count: number;
}

export default function WorkspaceInvitePage() {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: invite, isLoading, isError } = useQuery<InvitePreview>({
    queryKey: ['workspace-invite', token],
    queryFn: async () => {
      const { data } = await api.get(`/workspaces/invites/${token}/preview`);
      return data;
    },
    enabled: !!token,
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/workspaces/invites/${token}/accept`);
    },
    onSuccess: async () => {
      toast.success('Joined workspace successfully');
      await queryClient.invalidateQueries({ queryKey: ['api-user'] });
      navigate('/');
    },
    onError: (error) => {
      toast.error('Failed to join workspace');
      console.error(error);
    },
  });

  if (isLoading) return <ScreenLoader />;
  if (isError || !invite) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center py-12 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-destructive">Invalid or Expired Invite</CardTitle>
            <CardDescription>
              This invitation link is no longer valid. Please ask for a new invite.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
              <AvatarImage src={invite.logo_url} alt={invite.name} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {invite.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t('onboarding.workspace.invitationTitle')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('onboarding.workspace.invitationDescription').replace('{name}', invite.name)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
            <div className="text-sm font-medium">Members count</div>
            <div className="font-bold text-primary">{invite.members_count}</div>
          </div>
          <Button 
            className="w-full h-12 text-lg font-semibold" 
            size="lg"
            onClick={() => acceptMutation.mutate()}
            disabled={acceptMutation.isPending}
          >
            {acceptMutation.isPending ? 'Joining...' : t('onboarding.workspace.accept')}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground" 
            onClick={() => navigate('/')}
            disabled={acceptMutation.isPending}
          >
            Not now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
