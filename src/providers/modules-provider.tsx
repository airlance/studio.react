import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ScreenLoader } from '@/components/screen-loader';
import { RequireAuth } from '@/modules/auth/components/require-auth';
import { RequireAdmin } from '@/modules/auth/components/require-admin';

const DashboardModule = lazy(() => import('@/modules/dashboard'));
const FormModule = lazy(() => import('@/modules/forms'));
const TagsModule = lazy(() => import('@/modules/tags'));
const FieldsModule = lazy(() => import('@/modules/fields'));
const ListsModule = lazy(() => import('@/modules/lists'));
const TrackingModule = lazy(() => import('@/modules/tracking'));
const StorageModule = lazy(() => import('@/modules/storage'));
const AutomationModule = lazy(() => import('@/modules/automations'));
const CampaignModule = lazy(() => import('@/modules/campaigns'));
const EventsModule = lazy(() => import('@/modules/events'));
const SettingsModule = lazy(() => import('@/modules/settings'));
const StoreModule = lazy(() => import('@/modules/store'));
const ErrorModule = lazy(() => import('@/modules/errors'));
const AuthModule = lazy(() => import('@/modules/auth'));

export function ModulesProvider() {
    const withAuth = (element: JSX.Element) => (
        <RequireAuth>
            <Suspense fallback={<ScreenLoader />}>{element}</Suspense>
        </RequireAuth>
    );
    const withAdmin = (element: JSX.Element) => (
        <RequireAdmin>
            <Suspense fallback={<ScreenLoader />}>{element}</Suspense>
        </RequireAdmin>
    );

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
                path="/dashboard/*"
                element={withAuth(<DashboardModule />)}
            />
            <Route
                path="/forms/*"
                element={withAuth(<FormModule />)}
            />
            <Route
                path="/tags/*"
                element={withAuth(<TagsModule />)}
            />
            <Route
                path="/fields/*"
                element={withAuth(<FieldsModule />)}
            />
            <Route
                path="/lists/*"
                element={withAuth(<ListsModule />)}
            />
            <Route
                path="/tracking/*"
                element={withAuth(<TrackingModule />)}
            />
            <Route
                path="/storage/*"
                element={withAuth(<StorageModule />)}
            />
            <Route
                path="/automations/*"
                element={withAuth(<AutomationModule />)}
            />
            <Route
                path="/campaigns/*"
                element={withAuth(<CampaignModule />)}
            />
            <Route
                path="/events/*"
                element={withAuth(<EventsModule />)}
            />
            <Route
                path="/settings/*"
                element={withAdmin(<SettingsModule />)}
            />
            <Route
                path="/store/*"
                element={withAuth(<StoreModule />)}
            />
            <Route
                path="/auth/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <AuthModule />
                    </Suspense>
                }
            />
            <Route
                path="*"
                element={withAuth(<ErrorModule />)}
            />
        </Routes>
    );
}
