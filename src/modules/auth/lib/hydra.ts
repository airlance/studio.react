const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type HydraAcceptResponse = {
    redirect_to: string;
};

type HydraLoginRequest = {
    challenge: string;
    skip: boolean;
    subject?: string;
    client?: {
        client_name?: string;
        client_id?: string;
    };
};

type HydraConsentRequest = {
    challenge: string;
    skip: boolean;
    requested_scope: string[];
    requested_access_token_audience: string[];
    client?: {
        client_name?: string;
        client_id?: string;
    };
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(init?.headers || {}),
        },
        ...init,
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(body?.message || body?.error || `Request failed: ${res.status}`);
    }

    return body as T;
}

export async function getHydraLoginRequest(loginChallenge: string): Promise<HydraLoginRequest> {
    const query = new URLSearchParams({ login_challenge: loginChallenge }).toString();
    return apiFetch<HydraLoginRequest>(`/auth/hydra/login?${query}`);
}

export async function acceptHydraLogin(input: {
    login_challenge: string;
    subject: string;
    remember?: boolean;
    remember_for?: number;
}): Promise<HydraAcceptResponse> {
    return apiFetch<HydraAcceptResponse>('/auth/hydra/login/accept', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

export async function getHydraConsentRequest(
    consentChallenge: string,
): Promise<HydraConsentRequest> {
    const query = new URLSearchParams({ consent_challenge: consentChallenge }).toString();
    return apiFetch<HydraConsentRequest>(`/auth/hydra/consent?${query}`);
}

export async function acceptHydraConsent(input: {
    consent_challenge: string;
    grant_scope: string[];
    grant_access_token_audience?: string[];
    remember?: boolean;
    remember_for?: number;
    session?: Record<string, unknown>;
}): Promise<HydraAcceptResponse> {
    return apiFetch<HydraAcceptResponse>('/auth/hydra/consent/accept', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

export async function rejectHydraConsent(input: {
    consent_challenge: string;
    error?: string;
    error_description?: string;
}): Promise<HydraAcceptResponse> {
    return apiFetch<HydraAcceptResponse>('/auth/hydra/consent/reject', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}
