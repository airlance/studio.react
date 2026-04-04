import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { ScreenLoader } from './screen-loader';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, profile, isLoading, isVerified, isOnboarded } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <ScreenLoader />;
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (!isVerified) {
        // Redirect to verification if authenticated but not verified
        if (location.pathname.startsWith('/auth')) {
            return <>{children}</>;
        }
        return <Navigate to="/auth/verification" replace />;
    }

    if (!isOnboarded) {
        // Redirect to onboarding if verified but not yet onboarded
        if (location.pathname.startsWith('/onboarding')) {
            return <>{children}</>;
        }
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
};
