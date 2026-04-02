export type KratosMessage = {
    id: number;
    text: string;
    type: 'error' | 'info' | 'success' | 'warning' | string;
};

export type KratosUINode = {
    type: 'input' | 'script' | 'text' | 'img' | 'a' | string;
    group: string;
    messages?: KratosMessage[];
    meta?: {
        label?: {
            text?: string;
        };
    };
    attributes: {
        name?: string;
        type?: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        href?: string;
        node_type?: string;
    };
};

export type KratosFlow = {
    id: string;
    ui: {
        action: string;
        method: string;
        messages?: KratosMessage[];
        nodes: KratosUINode[];
    };
};

export type KratosSession = {
    identity: {
        id: string;
        traits?: {
            role?: string;
            [key: string]: unknown;
        };
    };
};

export type KratosFlowSubmitResult = {
    flow?: KratosFlow;
    redirectTo?: string;
};

const KRATOS_PUBLIC_URL = import.meta.env.VITE_KRATOS_PUBLIC_URL;

async function fetchKratos<T>(input: string, init?: RequestInit): Promise<T> {
    const res = await fetch(input, {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            ...(init?.headers || {}),
        },
        ...init,
    });

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
        if (contentType.includes('application/json')) {
            throw await res.json();
        }

        throw new Error(await res.text());
    }

    if (!contentType.includes('application/json')) {
        return {} as T;
    }

    return res.json() as Promise<T>;
}

export async function createLoginFlow(returnTo?: string): Promise<KratosFlow> {
    const url = new URL('/self-service/login/browser', KRATOS_PUBLIC_URL);
    if (returnTo) {
        url.searchParams.set('return_to', returnTo);
    }

    return fetchKratos<KratosFlow>(url.toString());
}

export async function getLoginFlow(flowId: string): Promise<KratosFlow> {
    const url = new URL('/self-service/login/flows', KRATOS_PUBLIC_URL);
    url.searchParams.set('id', flowId);
    return fetchKratos<KratosFlow>(url.toString());
}

export async function createRegistrationFlow(returnTo?: string): Promise<KratosFlow> {
    const url = new URL('/self-service/registration/browser', KRATOS_PUBLIC_URL);
    if (returnTo) {
        url.searchParams.set('return_to', returnTo);
    }

    return fetchKratos<KratosFlow>(url.toString());
}

export async function getRegistrationFlow(flowId: string): Promise<KratosFlow> {
    const url = new URL('/self-service/registration/flows', KRATOS_PUBLIC_URL);
    url.searchParams.set('id', flowId);
    return fetchKratos<KratosFlow>(url.toString());
}

export async function getSession(): Promise<KratosSession> {
    const url = new URL('/sessions/whoami', KRATOS_PUBLIC_URL);
    return fetchKratos<KratosSession>(url.toString());
}

export function isAdminSession(session: KratosSession): boolean {
    return session.identity.traits?.role === 'admin';
}

export async function createLogoutFlow(): Promise<{ logout_url: string }> {
    const url = new URL('/self-service/logout/browser', KRATOS_PUBLIC_URL);
    return fetchKratos<{ logout_url: string }>(url.toString());
}

export async function submitFlow(
    flow: KratosFlow,
    formData: FormData,
): Promise<KratosFlowSubmitResult> {
    const payload = new URLSearchParams();
    formData.forEach((value, key) => {
        if (typeof value === 'string') {
            payload.append(key, value);
        }
    });

    const res = await fetch(flow.ui.action, {
        method: (flow.ui.method || 'POST').toUpperCase(),
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        const body = await res.json();
        if (body?.ui?.nodes) {
            return { flow: body as KratosFlow };
        }

        if (body?.redirect_browser_to) {
            return { redirectTo: body.redirect_browser_to as string };
        }

        if (!res.ok) {
            throw body;
        }
    }

    if (!res.ok) {
        throw new Error(`Kratos flow submit failed: ${res.status}`);
    }

    return { redirectTo: res.url };
}
