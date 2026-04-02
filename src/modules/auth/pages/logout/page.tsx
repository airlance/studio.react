import { useEffect, useState } from 'react';
import { createLogoutFlow } from '../../lib/kratos';

export function LogoutPage() {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function logout() {
            try {
                const { logout_url: logoutURL } = await createLogoutFlow();
                window.location.href = logoutURL;
            } catch {
                if (active) {
                    setError('Unable to initialize logout flow.');
                }
            }
        }

        logout();

        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold">Logout</h1>
                    <p className="mt-2 text-sm text-slate-600">Closing your current session...</p>
                    {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                </div>
            </div>
        </div>
    );
}
