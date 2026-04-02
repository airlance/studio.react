import { AuthShell } from '../../components/auth-shell';

export function ErrorPage() {
    return (
        <AuthShell
            title="Auth Error"
            description="This page will handle Kratos and Hydra error flow details."
        />
    );
}
