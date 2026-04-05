import { Content } from '@/layout/components/content';
import { useTranslation } from '@/hooks/useTranslation';
import { useWorkspaces } from '@/hooks/use-workspaces';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export function InvitesPage() {
  const { t } = useTranslation();
  const { currentWorkspace, useInvites } = useWorkspaces();
  const { data: invites = [], isLoading } = useInvites(currentWorkspace?.id);

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="container-fluid py-6">
      <Content className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            {t('layout.invites.title')}
          </h1>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('layout.invites.column.email')}</TableHead>
                <TableHead>{t('layout.invites.column.role')}</TableHead>
                <TableHead>{t('layout.invites.column.status')}</TableHead>
                <TableHead>{t('layout.invites.column.createdAt')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : invites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {t('layout.invites.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                invites.map((invite) => (
                  <TableRow key={invite.token}>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell className="capitalize">
                      {invite.role}
                    </TableCell>
                    <TableCell>
                      {isExpired(invite.expires_at) ? (
                        <Badge variant="destructive">
                          {t('layout.invites.status.expired')}
                        </Badge>
                      ) : (
                        <Badge variant="success" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                          {t('layout.invites.status.active')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invite.created_at), 'PPP')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Content>
    </div>
  );
}
