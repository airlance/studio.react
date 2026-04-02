import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/screen-loader';
import { getSession } from '../lib/kratos';

type RequireAuthProps = {
    children: ReactNode;
};

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

export function RequireAuth({ children }: RequireAuthProps) {
    const location = useLocation();
    const [authState, setAuthState] = useState<AuthState>('loading');

    useEffect(() => {
        let active = true;

        async function checkSession() {
            try {
                await getSession();
                if (active) {
                    setAuthState('authenticated');
                }
            } catch {
                if (active) {
                    setAuthState('unauthenticated');
                }
            }
        }

        checkSession();

        return () => {
            active = false;
        };
    }, []);

    if (authState === 'loading') {
        return <ScreenLoader />;
    }

    if (authState === 'unauthenticated') {
        const returnTo = `${location.pathname}${location.search}${location.hash}`;
        const loginPath = `/auth/login?return_to=${encodeURIComponent(returnTo)}`;
        return <Navigate to={loginPath} replace />;
    }

    return <>{children}</>;
}
