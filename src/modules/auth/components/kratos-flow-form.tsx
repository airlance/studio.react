import { FormEvent, useState } from 'react';
import { KratosFlow } from '../lib/kratos';

type Props = {
    flow: KratosFlow;
    loading?: boolean;
    onSubmit: (formData: FormData) => Promise<void>;
};

export function KratosFlowForm({ flow, loading = false, onSubmit }: Props) {
    const [submitValue, setSubmitValue] = useState<{ name: string; value: string } | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitError(null);
        const data = new FormData(event.currentTarget);
        const submitter = (event.nativeEvent as SubmitEvent).submitter as
            | HTMLButtonElement
            | HTMLInputElement
            | null;

        const submitterName =
            submitter?.getAttribute('data-submit-name') || submitter?.getAttribute('name') || '';
        const submitterValue =
            submitter?.getAttribute('data-submit-value') || submitter?.getAttribute('value') || '';

        if (submitterName) {
            data.set(submitterName, submitterValue);
        } else if (submitValue?.name) {
            data.set(submitValue.name, submitValue.value);
        }

        try {
            await onSubmit(data);
        } catch (error) {
            if (error instanceof Error) {
                setSubmitError(error.message);
                return;
            }

            setSubmitError('Unable to submit the auth form.');
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {flow.ui.messages?.map((message) => (
                <p key={`${message.id}-${message.text}`} className="text-sm text-red-600">
                    {message.text}
                </p>
            ))}

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            {flow.ui.nodes.map((node, index) => {
                const attrs = node.attributes || {};
                const inputName = attrs.name || `node-${index}`;
                const label = node.meta?.label?.text || inputName;
                const nodeMessages = node.messages || [];
                const inputType = attrs.type || 'text';

                if (node.type !== 'input') {
                    return null;
                }

                if (inputType === 'hidden') {
                    return (
                        <input
                            key={`${inputName}-${index}`}
                            type="hidden"
                            name={attrs.name}
                            defaultValue={attrs.value || ''}
                        />
                    );
                }

                if (inputType === 'submit' || inputType === 'button') {
                    return (
                        <button
                            key={`${inputName}-${index}`}
                            type="submit"
                            name={attrs.name}
                            value={attrs.value || ''}
                            data-submit-name={attrs.name}
                            data-submit-value={attrs.value || ''}
                            disabled={loading || attrs.disabled}
                            onClick={() =>
                                setSubmitValue({
                                    name: attrs.name || '',
                                    value: attrs.value || '',
                                })
                            }
                            className="w-full rounded-md border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {label}
                        </button>
                    );
                }

                return (
                    <div key={`${inputName}-${index}`} className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700" htmlFor={inputName}>
                            {label}
                        </label>
                        <input
                            id={inputName}
                            type={inputType}
                            name={attrs.name}
                            required={attrs.required}
                            disabled={loading || attrs.disabled}
                            defaultValue={attrs.value || ''}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:border-slate-500"
                        />
                        {nodeMessages.map((message) => (
                            <p key={`${message.id}-${message.text}`} className="text-xs text-red-600">
                                {message.text}
                            </p>
                        ))}
                    </div>
                );
            })}
        </form>
    );
}
