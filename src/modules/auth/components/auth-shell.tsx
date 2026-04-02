import { Link } from 'react-router-dom';

type AuthShellProps = {
    title: string;
    description: string;
};

const links = [
    { to: '/auth/login', label: 'Login' },
    { to: '/auth/registration', label: 'Registration' },
    { to: '/auth/recovery', label: 'Recovery' },
    { to: '/auth/verification', label: 'Verification' },
    { to: '/auth/settings', label: 'Settings' },
    { to: '/auth/consent', label: 'Consent' },
    { to: '/auth/error', label: 'Error' },
];

export function AuthShell({ title, description }: AuthShellProps) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-12">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    <p className="mt-3 text-sm text-slate-600">{description}</p>
                    <p className="mt-6 text-xs text-slate-500">
                        Auth module scaffold is ready. Kratos and Hydra flow wiring comes next.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
