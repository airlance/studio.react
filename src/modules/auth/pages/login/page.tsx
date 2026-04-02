import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { acceptHydraLogin, getHydraLoginRequest } from '../../lib/hydra';
import { createLoginFlow, getLoginFlow, getSession, KratosFlow, KratosUINode, submitFlow } from '../../lib/kratos';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';

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

    return 'Unable to initialize login flow.';
}

function isSubmitNode(node: KratosUINode): boolean {
    return (
        node.type === 'input' &&
        (node.attributes?.type === 'submit' || node.attributes?.type === 'button')
    );
}

export function LoginPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [flow, setFlow] = useState<KratosFlow | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const loginChallenge = useMemo(
        () => searchParams.get('login_challenge') || '',
        [searchParams],
    );
    const flowId = useMemo(() => searchParams.get('flow') || '', [searchParams]);
    const returnTo = useMemo(() => {
        const raw = searchParams.get('return_to') || '/dashboard';
        return raw.startsWith('/') ? raw : '/dashboard';
    }, [searchParams]);

    async function completeHydraLogin(challenge: string) {
        const session = await getSession();
        const payload = await acceptHydraLogin({
            login_challenge: challenge,
            subject: session.identity.id,
            remember: true,
            remember_for: 3600,
        });
        window.location.href = payload.redirect_to;
    }

    useEffect(() => {
        let active = true;

        async function init() {
            setError(null);
            setLoading(true);
            try {
                if (!loginChallenge && !flowId) {
                    try {
                        await getSession();
                        navigate(returnTo, { replace: true });
                        return;
                    } catch {
                        // No active session, continue with login flow initialization.
                    }
                }

                if (loginChallenge) {
                    const request = await getHydraLoginRequest(loginChallenge);
                    if (request.skip && request.subject) {
                        await completeHydraLogin(loginChallenge);
                        return;
                    }
                }

                let nextFlow: KratosFlow;
                let shouldDropFlowFromQuery = false;
                if (flowId) {
                    try {
                        nextFlow = await getLoginFlow(flowId);
                    } catch {
                        nextFlow = await createLoginFlow();
                        shouldDropFlowFromQuery = true;
                    }
                } else {
                    nextFlow = await createLoginFlow();
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
    }, [flowId, loginChallenge, navigate, returnTo, setSearchParams]);

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

            if (loginChallenge) {
                await completeHydraLogin(loginChallenge);
                return;
            }

            if (result.redirectTo) {
                window.location.href = result.redirectTo;
                return;
            }

            navigate(returnTo, { replace: true });
        } catch {
            setError('Login failed. Check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    }

    async function onFlowFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!flow) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const submitter = (event.nativeEvent as SubmitEvent).submitter as
            | HTMLButtonElement
            | HTMLInputElement
            | null;

        const submitterName =
            submitter?.getAttribute('data-submit-name') || submitter?.getAttribute('name') || '';
        const submitterValue =
            submitter?.getAttribute('data-submit-value') || submitter?.getAttribute('value') || '';

        if (submitterName) {
            formData.set(submitterName, submitterValue);
        }

        await handleSubmit(formData);
    }

    const nodes = flow?.ui.nodes || [];
    const hiddenNodes = nodes.filter((node) => node.type === 'input' && node.attributes?.type === 'hidden');
    const oidcButtons = nodes.filter((node) => isSubmitNode(node) && node.group === 'oidc');
    const credentialNodes = nodes.filter(
        (node) =>
            node.type === 'input' &&
            node.attributes?.type !== 'hidden' &&
            node.attributes?.type !== 'submit' &&
            node.attributes?.type !== 'button' &&
            node.group !== 'oidc',
    );
    const credentialButtons = nodes.filter((node) => isSubmitNode(node) && node.group !== 'oidc');

    return (
        <div className="block w-full space-y-5">
            <div className="text-center space-y-1 pb-3">
                <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
                <p className="text-sm text-muted-foreground">
                    Welcome back! Log in with your credentials.
                </p>
            </div>

            {error && (
                <Alert
                    variant="destructive"
                    appearance="light"
                >
                    <AlertIcon>
                        <AlertCircle />
                    </AlertIcon>
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
            )}

            {!flow && !error && <p className="text-sm text-slate-500">Loading authentication form...</p>}
            {flow && (
                <form onSubmit={onFlowFormSubmit} noValidate className="block w-full">
                    {hiddenNodes.map((node, index) => (
                        <input
                            key={`hidden-${index}`}
                            type="hidden"
                            name={node.attributes?.name}
                            defaultValue={node.attributes?.value || ''}
                        />
                    ))}

                    {oidcButtons.length > 0 && (
                        <div className="flex flex-col gap-3.5">
                            {oidcButtons.map((node, index) => {
                                const attrs = node.attributes || {};
                                const label = node.meta?.label?.text || attrs.value || 'Continue with provider';
                                const icon = attrs.value === "github" ? <Icons.github className="size-5!" /> : <></>
                                return (
                                    <Button
                                        key={`oidc-${index}`}
                                        type="submit"
                                        variant="outline"
                                        name={attrs.name}
                                        value={attrs.value || ''}
                                        data-submit-name={attrs.name}
                                        data-submit-value={attrs.value || ''}
                                        disabled={loading || attrs.disabled}
                                    >
                                        {icon} {label}
                                    </Button>
                                );
                            })}
                        </div>
                    )}

                    {oidcButtons.length > 0 && (credentialNodes.length > 0 || credentialButtons.length > 0) && (
                        <div className="relative py-1.5">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">or</span>
                            </div>
                        </div>
                    )}

                    {flow.ui.messages?.map((message) => (
                        <p key={`${message.id}-${message.text}`} className="text-sm text-red-600">
                            {message.text}
                        </p>
                    ))}

                    {credentialNodes.map((node, index) => {
                        const attrs = node.attributes || {};
                        const name = attrs.name || `field-${index}`;
                        const label = node.meta?.label?.text || name;
                        const inputType = attrs.type || 'text';

                        return (
                            <div key={`${name}-${index}`} className="flex flex-col pb-3">
                                <label htmlFor={name} className="pb-2 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 font-medium text-foreground">
                                    {label}
                                </label>
                                <input
                                    id={name}
                                    type={inputType}
                                    name={attrs.name}
                                    required={attrs.required}
                                    defaultValue={attrs.value || ''}
                                    disabled={loading || attrs.disabled}
                                    className="flex w-full bg-background border border-input shadow-xs shadow-black/5 transition-[color,box-shadow] text-foreground placeholder:text-muted-foreground/80 focus-visible:ring-ring/30 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-60 [&[readonly]]:bg-muted/80 [&[readonly]]:cursor-not-allowed file:h-full [&[type=file]]:py-0 file:border-solid file:border-input file:bg-transparent file:font-medium file:not-italic file:text-foreground file:p-0 file:border-0 file:border-e aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20 h-8.5 px-3 text-[0.8125rem] leading-(--text-sm--line-height) rounded-md file:pe-3 file:me-3"
                                />
                                {node.messages?.map((message) => (
                                    <p key={`${message.id}-${message.text}`} className="text-xs text-red-600">
                                        {message.text}
                                    </p>
                                ))}
                            </div>
                        );
                    })}

                    <div className="space-y-3">
                        {credentialButtons.map((node, index) => {
                            const attrs = node.attributes || {};
                            const label = node.meta?.label?.text || attrs.value || 'Continue';

                            return (
                                <Button
                                    key={`cred-${index}`}
                                    type="submit"
                                    name={attrs.name}
                                    value={attrs.value || ''}
                                    data-submit-name={attrs.name}
                                    data-submit-value={attrs.value || ''}
                                    disabled={loading || attrs.disabled}
                                    className="w-full"
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link
                            to="/auth/registration"
                            className="text-sm font-semibold text-foreground hover:text-primary"
                        >
                            Sign Up
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );
}
