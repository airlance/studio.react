import {useCallback, useState} from "react";
import { ArrowLeft, Save } from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {useToast} from "@/hooks/use-toast.ts";
import {Button} from "@/components/ui/button.tsx";
import { WorkflowBuilder } from "@/components/workflow-builder";

export default function WorkflowBuilderPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const returnPath = '/automations';

    const handleBack = useCallback(() => {
        navigate(returnPath);
    }, [navigate, returnPath]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            /*
             * TODO: call exportToHtml(template) here, POST the HTML + JSON
             * to the API, then navigate back.
             *
             * For now we just simulate and navigate.
             */
            await new Promise((r) => setTimeout(r, 600));
            toast({ description: 'Template saved.' });
            navigate(returnPath);
        } catch {
            toast({ description: 'Failed to save template.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    }, [navigate, returnPath, toast]);

    return (
        <div className="flex h-screen flex-col overflow-hidden">
            {/* Top bar */}
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card px-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 text-xs text-muted-foreground"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to campaign
                    </Button>
                </div>

                <Button
                    size="sm"
                    className="h-7 gap-1.5 text-xs bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <Save className="h-3.5 w-3.5" />
                    {isSaving ? 'Saving…' : 'Save & continue'}
                </Button>
            </div>

            {/* Builder fills remaining height */}
            <div className="flex-1 overflow-hidden">
                <WorkflowBuilder />
            </div>
        </div>
    );
}