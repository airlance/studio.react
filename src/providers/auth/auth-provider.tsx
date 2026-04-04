import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { kratos } from '@/lib/kratos';
import api from '@/lib/api';
import { AuthContext } from './auth-context';
import { ApiUserResult, UserProfile, UserVerifiableAddress } from '@/types/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
    const {
        data,
        isLoading,
        isError,
    } = useQuery<ApiUserResult>({
        queryKey: ['api-user'],
        queryFn: async (): Promise<ApiUserResult> => {
            try {
                const { data: userData } = await api.get<UserProfile>('/user/me');
                const verified = userData?.verifiable_addresses?.some((a: UserVerifiableAddress) => a.verified) ?? false;
                return { user: userData, isVerified: verified };
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const status = err.response?.status;
                    if (status === 401) {
                        // Not logged in — no session
                        return { user: null, isVerified: false };
                    }
                    if (status === 403) {
                        // Logged in but not verified — extract user from response if available
                        const userFromRes = (err.response?.data as { user?: UserProfile })?.user ?? null;
                        return { user: userFromRes, isVerified: false };
                    }
                }
                throw err;
            }
        },
        retry: false,
    });

    const logout = async () => {
        try {
            const { data: logoutData } = await kratos.createBrowserLogoutFlow();
            window.location.href = logoutData.logout_url;
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user: data?.user ?? null,
                isLoading,
                isError,
                isVerified: data?.isVerified ?? false,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
