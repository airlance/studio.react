import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/screen-loader';
import { getSession, isAdminSession } from '../lib/kratos';

type RequireAdminProps = {
    children: ReactNode;
};

type AdminState = 'loading' | 'admin' | 'unauthenticated' | 'forbidden';

export function RequireAdmin({ children }: RequireAdminProps) {
    const location = useLocation();
    const [adminState, setAdminState] = useState<AdminState>('loading');

    useEffect(() => {
        let active = true;

        async function check() {
            try {
                const session = await getSession();
                if (!active) {
                    return;
                }

                if (isAdminSession(session)) {
                    setAdminState('admin');
                    return;
                }

                setAdminState('forbidden');
            } catch {
                if (active) {
                    setAdminState('unauthenticated');
                }
            }
        }

        check();
        return () => {
            active = false;
        };
    }, []);

    if (adminState === 'loading') {
        return <ScreenLoader />;
    }

    if (adminState === 'unauthenticated') {
        const returnTo = `${location.pathname}${location.search}${location.hash}`;
        const loginPath = `/auth/login?return_to=${encodeURIComponent(returnTo)}`;
        return <Navigate to={loginPath} replace />;
    }

    if (adminState === 'forbidden') {
        return <Navigate to="/dashboard/dashboard" replace />;
    }

    return <>{children}</>;
}
