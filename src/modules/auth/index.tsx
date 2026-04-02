import { Navigate, Route, Routes } from 'react-router-dom';
import { ConsentPage } from './pages/consent/page';
import { ErrorPage } from './pages/error/page';
import { LoginPage } from './pages/login/page';
import { LogoutPage } from './pages/logout/page';
import { RecoveryPage } from './pages/recovery/page';
import { RegistrationPage } from './pages/registration/page';
import { SettingsPage } from './pages/settings/page';
import { VerificationPage } from './pages/verification/page';
import { Layout } from "./components/layout";

export default function AuthModule() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Navigate to="login" replace />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="logout" element={<LogoutPage />} />
                <Route path="registration" element={<RegistrationPage />} />
                <Route path="error" element={<ErrorPage />} />
                <Route path="recovery" element={<RecoveryPage />} />
                <Route path="verification" element={<VerificationPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="consent" element={<ConsentPage />} />
                <Route path="*" element={<Navigate to="login" replace />} />
            </Route>
        </Routes>
    );
}
