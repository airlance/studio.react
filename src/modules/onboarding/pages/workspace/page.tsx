import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const workspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name is too short'),
  slug: z.string().min(2, 'Workspace URL is too short').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens are allowed'),
  description: z.string().optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

export default function OnboardingWorkspacePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  const { watch, setValue } = form;
  const name = watch('name');

  useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      setValue('slug', slug, { shouldValidate: true });
    }
  }, [name, setValue]);

  const onSubmit = async (values: WorkspaceFormValues) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('slug', values.slug);
    if (values.description) formData.append('description', values.description);

    try {
      await api.post('/workspaces', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Workspace created successfully');
      await queryClient.invalidateQueries({ queryKey: ['api-user'] });
      navigate('/');
    } catch (error) {
      toast.error('Failed to create workspace');
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t('onboarding.workspace.title')}
          </CardTitle>
          <CardDescription>
            {t('onboarding.workspace.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('onboarding.workspace.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('onboarding.workspace.slug')}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground shrink-0">studio.com/</span>
                        <Input placeholder="my-team" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What is this workspace for?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : t('onboarding.workspace.create')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
