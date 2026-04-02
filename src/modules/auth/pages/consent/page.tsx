import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    acceptHydraConsent,
    getHydraConsentRequest,
    rejectHydraConsent,
} from '../../lib/hydra';

type ConsentState = {
    challenge: string;
    skip: boolean;
    requested_scope: string[];
    requested_access_token_audience: string[];
    client?: {
        client_name?: string;
        client_id?: string;
    };
};

export function ConsentPage() {
    const [searchParams] = useSearchParams();
    const [consent, setConsent] = useState<ConsentState | null>(null);
    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const consentChallenge = useMemo(
        () => searchParams.get('consent_challenge') || '',
        [searchParams],
    );

    useEffect(() => {
        let active = true;

        async function init() {
            if (!consentChallenge) {
                setError('Missing consent challenge.');
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const request = await getHydraConsentRequest(consentChallenge);
                if (!active) {
                    return;
                }

                setConsent(request);
                setSelectedScopes(request.requested_scope || []);

                if (request.skip) {
                    const accepted = await acceptHydraConsent({
                        consent_challenge: consentChallenge,
                        grant_scope: request.requested_scope || [],
                        grant_access_token_audience: request.requested_access_token_audience || [],
                        remember: true,
                        remember_for: 3600,
                    });
                    window.location.href = accepted.redirect_to;
                }
            } catch (e) {
                if (!active) {
                    return;
                }
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError('Failed to load consent challenge.');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        init();

        return () => {
            active = false;
        };
    }, [consentChallenge]);

    function toggleScope(scope: string) {
        setSelectedScopes((prev) =>
            prev.includes(scope) ? prev.filter((item) => item !== scope) : [...prev, scope],
        );
    }

    async function handleApprove() {
        if (!consentChallenge || !consent) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const accepted = await acceptHydraConsent({
                consent_challenge: consentChallenge,
                grant_scope: selectedScopes,
                grant_access_token_audience: consent.requested_access_token_audience || [],
                remember: true,
                remember_for: 3600,
            });
            window.location.href = accepted.redirect_to;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('Failed to accept consent.');
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleReject() {
        if (!consentChallenge) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const rejected = await rejectHydraConsent({
                consent_challenge: consentChallenge,
                error: 'access_denied',
                error_description: 'User denied access.',
            });
            window.location.href = rejected.redirect_to;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('Failed to reject consent.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-12">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold">Consent</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Allow this app to access your account data.
                    </p>
                    {consent?.client && (
                        <p className="mt-3 text-sm text-slate-700">
                            Client: {consent.client.client_name || consent.client.client_id}
                        </p>
                    )}
                    {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

                    {!consent?.requested_scope?.length ? (
                        <p className="mt-4 text-sm text-slate-600">No requested scopes.</p>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {consent.requested_scope.map((scope) => (
                                <label key={scope} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={selectedScopes.includes(scope)}
                                        onChange={() => toggleScope(scope)}
                                    />
                                    <span>{scope}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleApprove}
                            disabled={loading}
                            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
                        >
                            Approve
                        </button>
                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={loading}
                            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-70"
                        >
                            Deny
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
