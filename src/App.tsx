import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TranslationProvider } from '@/config/i18n/context';
import { AppLayout } from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import CreateCampaignPage from '@/pages/CreateCampaignPage';
import CampaignBuilderPage from '@/pages/CampaignBuilderPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        <TranslationProvider>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter
                        future={{
                            v7_startTransition: true,
                            v7_relativeSplatPath: true,
                        }}
                    >
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <AppLayout>
                                        <DashboardPage />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/campaigns/create"
                                element={
                                    <AppLayout>
                                        <CreateCampaignPage />
                                    </AppLayout>
                                }
                            />
                            {/*
                             * Builder route — full-screen, no AppLayout sidebar.
                             * :campaignId can be a real ID (edit) or "new" (first time).
                             */}
                            <Route
                                path="/campaigns/:campaignId/content"
                                element={<CampaignBuilderPage />}
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </QueryClientProvider>
        </TranslationProvider>
    </ThemeProvider>
);

export default App;