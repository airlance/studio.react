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
                const { data: res } = await api.get<any>('/user/me');
                const userData = res.identity;
                const profile = res.profile;
                const workspaces = res.workspaces;
                const onboarded = res.onboarded;

                const verified = userData?.verifiable_addresses?.some((a: UserVerifiableAddress) => a.verified) ?? false;
                
                return { 
                    user: userData, 
                    profile, 
                    workspaces,
                    isVerified: verified, 
                    isOnboarded: onboarded 
                };
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const status = err.response?.status;
                    if (status === 401) {
                        return { user: null, isVerified: false, isOnboarded: false };
                    }
                    if (status === 403) {
                        const userFromRes = (err.response?.data as { user?: UserProfile })?.user ?? null;
                        return { user: userFromRes, isVerified: false, isOnboarded: false };
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
                profile: data?.profile,
                workspaces: data?.workspaces,
                isLoading,
                isError,
                isVerified: data?.isVerified ?? false,
                isOnboarded: data?.isOnboarded ?? false,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
