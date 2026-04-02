import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KratosFlowForm } from '../../components/kratos-flow-form';
import {
    createRegistrationFlow,
    getRegistrationFlow,
    KratosFlow,
    submitFlow,
} from '../../lib/kratos';

export function RegistrationPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [flow, setFlow] = useState<KratosFlow | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const flowId = useMemo(() => searchParams.get('flow') || '', [searchParams]);

    useEffect(() => {
        let active = true;

        async function init() {
            setError(null);
            setLoading(true);
            try {
                let nextFlow: KratosFlow;
                let shouldDropFlowFromQuery = false;
                if (flowId) {
                    try {
                        nextFlow = await getRegistrationFlow(flowId);
                    } catch {
                        nextFlow = await createRegistrationFlow();
                        shouldDropFlowFromQuery = true;
                    }
                } else {
                    nextFlow = await createRegistrationFlow();
                }
                if (!active) {
                    return;
                }

                setFlow(nextFlow);
                if (shouldDropFlowFromQuery) {
                    const nextParams = new URLSearchParams(window.location.search);
                    nextParams.delete('flow');
                    setSearchParams(nextParams, { replace: true });
                }
            } catch (e) {
                if (!active) {
                    return;
                }
                setError(extractErrorMessage(e));
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
    }, [flowId, setSearchParams]);

    async function handleSubmit(formData: FormData) {
        if (!flow) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await submitFlow(flow, formData);
            if (result.flow) {
                setFlow(result.flow);
                return;
            }

            if (result.redirectTo) {
                window.location.href = result.redirectTo;
                return;
            }

            navigate('/dashboard', { replace: true });
        } catch {
            setError('Registration failed. Please check form values and try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold">Create account</h1>
                    <p className="mt-2 text-sm text-slate-600">Complete registration to enter dashboard.</p>
                    {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                    {flow && <KratosFlowForm flow={flow} onSubmit={handleSubmit} loading={loading} />}
                </div>
            </div>
        </div>
    );
}
    function extractErrorMessage(error: unknown): string {
        if (error instanceof Error && error.message) {
            return error.message;
        }

        if (typeof error === 'object' && error !== null) {
            const e = error as { error?: { message?: string }; message?: string };
            if (e.error?.message) {
                return e.error.message;
            }
            if (e.message) {
                return e.message;
            }
        }

        return 'Unable to initialize registration flow.';
    }
