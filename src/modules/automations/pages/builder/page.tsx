import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Save, Zap } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useToast } from "@/hooks/use-toast.ts";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useHeaderSlot } from '@/layout/components/header-slot-context';
import { Content } from '@/layout/components/content';
import { WorkflowNode, TriggerOption, ActionOption, NodeConfig, NodeType } from "@/types/automation";
import { createInitial, mapNode, insertAfterNode, insertBranchStart, insertMatchBranchStart, deleteNode, moveNode, uid, DropTarget } from "@/utils/automation";
import { TRIGGERS } from "@/constants/automation";
import { WORKFLOW_RECIPES } from "@/mocks/automation";
import { SidePanelButton } from "../../components/workflow-builder/components/SidePanelButton.tsx";
import { RenderChain } from "../../components/workflow-builder/components/RenderChain.tsx";
import { SelectTriggerModal } from "../../components/workflow-builder/modals/SelectTriggerModal.tsx";
import { ConfigureTriggerModal } from "../../components/workflow-builder/modals/ConfigureTriggerModal.tsx";
import { AddActionModal } from "../../components/workflow-builder/modals/AddActionModal.tsx";
import { ConfigureWaitModal } from "../../components/workflow-builder/modals/ConfigureWaitModal.tsx";
import { ConfigureIfElseModal } from "../../components/workflow-builder/modals/ConfigureIfElseModal.tsx";
import { ConfigureMatchModal } from "../../components/workflow-builder/modals/ConfigureMatchModal.tsx";
import { ConfigureEmailModal } from "../../components/workflow-builder/modals/ConfigureEmailModal.tsx";
import { ConfigureWebhookModal } from "../../components/workflow-builder/modals/ConfigureWebhookModal.tsx";
import { ContentHeader } from '@/layout/components/content-header';

type ConfigureActionModalType =
    | "configure_wait"
    | "configure_ifelse"
    | "configure_match"
    | "configure_send_email"
    | "configure_webhook";

type ModalState =
    | null
    | { type: "select_trigger" }
    | { type: "configure_trigger"; trigger: TriggerOption; node?: WorkflowNode }
    | { type: "add_action"; ctx: DropTarget }
    | { type: ConfigureActionModalType; node?: WorkflowNode; ctx?: DropTarget }
    | { type: "show_json" };

const ACTION_MODAL_BY_ID: Record<string, ConfigureActionModalType> = {
    wait: "configure_wait",
    ifelse: "configure_ifelse",
    match: "configure_match",
    send_email: "configure_send_email",
    webhook: "configure_webhook",
    add_tag: "configure_send_email",
    notify: "configure_send_email",
};

const ACTION_NODE_TYPE_BY_MODAL: Record<ConfigureActionModalType, NodeType> = {
    configure_wait: "wait",
    configure_ifelse: "ifelse",
    configure_match: "match",
    configure_send_email: "send_email",
    configure_webhook: "webhook",
};

const isDropTarget = (value: unknown): value is DropTarget => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const target = value as Partial<DropTarget>;
    if (typeof target.afterId === "string") {
        return true;
    }

    if (typeof target.ifelseId === "string" && (target.branch === "yes" || target.branch === "no")) {
        return true;
    }

    return typeof target.matchId === "string" && typeof target.matchBranchId === "string";
};

export default function WorkflowBuilderPage() {
    useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const returnPath = '/automations/automations';

    const handleBack = useCallback(() => {
        navigate(returnPath);
    }, [navigate, returnPath]);

    const { setHeaderSlot } = useHeaderSlot();

    const [searchParams] = useSearchParams();
    const recipeId = searchParams.get("recipe");

    const [flow, setFlow] = useState<WorkflowNode>(createInitial());
    const [modal, setModal] = useState<ModalState>(null);

    useEffect(() => {
        if (recipeId && WORKFLOW_RECIPES[recipeId]) {
            setFlow(JSON.parse(JSON.stringify(WORKFLOW_RECIPES[recipeId])));
        }
    }, [recipeId]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const openAddTrigger = useCallback(() => {
        setModal({ type: "select_trigger" });
    }, []);

    const openAddAction = useCallback((ctx: DropTarget) => {
        setModal({ type: "add_action", ctx });
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);

    const handleJsonDialogOpenChange = (open: boolean) => {
        if (!open) {
            closeModal();
        }
    };

    const handleSelectTrigger = useCallback((trigger: TriggerOption) => {
        setModal({ type: "configure_trigger", trigger });
    }, []);

    const handleSaveTrigger = useCallback((config: NodeConfig) => {
        if (!modal || modal.type !== "configure_trigger") {
            return;
        }

        const nodeToEdit = modal.node;
        if (nodeToEdit) {
            const nodeId = nodeToEdit.id;
            setFlow((f) => mapNode(f, nodeId, (n) => ({ ...n, config: { ...n.config, ...config } })) as WorkflowNode);
        } else {
            setFlow((f) => {
                if (f.type === "workflow") {
                    return {
                        ...f,
                        triggers: [...(f.triggers || []), { id: uid(), type: "trigger", config: { triggerId: modal.trigger.id, ...config } }]
                    } as WorkflowNode;
                }
                return f;
            });
        }
        closeModal();
    }, [closeModal, modal]);

    const handleSelectAction = useCallback((action: ActionOption) => {
        if (!modal || modal.type !== "add_action") {
            return;
        }

        const modalType = ACTION_MODAL_BY_ID[action.id];
        if (!modalType) {
            return;
        }

        setModal({ type: modalType, ctx: modal.ctx });
    }, [modal]);

    const handleEditNode = useCallback((node: WorkflowNode) => {
        const typeMap: Record<string, string> = {
            trigger: "configure_trigger",
            wait: "configure_wait",
            ifelse: "configure_ifelse",
            match: "configure_match",
            send_email: "configure_send_email",
            webhook: "configure_webhook",
            add_tag: "configure_send_email",
            notify: "configure_send_email",
        };
        const modalType = typeMap[node.type];

        if (!modalType) {
            return;
        }

        if (node.type === "trigger") {
            const trigger = TRIGGERS.find((t) => t.id === node.config?.triggerId);
            if (!trigger) {
                return;
            }
            setModal({ type: "configure_trigger", node, trigger });
            return;
        }

        if (
            modalType === "configure_wait" ||
            modalType === "configure_ifelse" ||
            modalType === "configure_match" ||
            modalType === "configure_send_email" ||
            modalType === "configure_webhook"
        ) {
            setModal({ type: modalType, node });
        }
    }, []);

    const doInsert = useCallback((ctx: DropTarget, type: NodeType, config: NodeConfig) => {
        if (ctx.branch && ctx.ifelseId) {
            const ifelseId = ctx.ifelseId;
            const branch = ctx.branch;
            setFlow((f) => insertBranchStart(f, ifelseId, branch, type, config));
        } else if (ctx.matchId && ctx.matchBranchId) {
            const matchId = ctx.matchId;
            const matchBranchId = ctx.matchBranchId;
            setFlow((f) => insertMatchBranchStart(f, matchId, matchBranchId, type, config));
        } else if (ctx.afterId) {
            const afterId = ctx.afterId;
            setFlow((f) => insertAfterNode(f, afterId, type, config));
        }
        closeModal();
    }, [closeModal]);

    const handleSaveAction = useCallback((config: NodeConfig) => {
        if (!modal) {
            return;
        }

        if (
            modal.type !== "configure_wait" &&
            modal.type !== "configure_ifelse" &&
            modal.type !== "configure_match" &&
            modal.type !== "configure_send_email" &&
            modal.type !== "configure_webhook"
        ) {
            return;
        }

        const nodeToEdit = modal.node;
        if (nodeToEdit) {
            const nodeId = nodeToEdit.id;
            setFlow((f) => mapNode(f, nodeId, (n) => ({ ...n, config: { ...n.config, ...config } })) as WorkflowNode);
            closeModal();
            return;
        }

        if (!modal.ctx) {
            return;
        }

        doInsert(modal.ctx, ACTION_NODE_TYPE_BY_MODAL[modal.type], config);
    }, [closeModal, doInsert, modal]);

    const handleDelete = (id: string) => {
        setFlow((f) => deleteNode(f, id) as WorkflowNode);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            if (typeof active.id !== "string") {
                return;
            }

            const nodeId = active.id;
            const target = over.data.current;
            if (isDropTarget(target)) {
                setFlow((f) => moveNode(f, nodeId, target));
            }
        }
    };

    const hasRealTrigger = flow.type === "workflow" && (flow.triggers?.length || 0) > 0;

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
            setModal({ type: "show_json" })
        } catch {
            toast({ description: 'Failed to save template.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    }, [toast]);

    useEffect(() => {
        setHeaderSlot(
            <>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 text-xs text-muted-foreground"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to automations
                    </Button>
                </div>
                <div className="flex items-center gap-2"></div>
                <div className="flex items-center gap-2">
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
            </>
        );

        return () => setHeaderSlot(null);
    }, [handleBack, handleSave, isSaving, setHeaderSlot])

    return (
        <>
            <ContentHeader className="space-x-2">
                <h1 className="inline-flex items-center gap-2.5 text-sm font-semibold">
                    <Zap className="size-4 text-primary" /> Automations /
                    <p className="text-sm text-muted-foreground mt-0.5">
                        New Automation
                    </p>
                </h1>

                <div className="flex items-center gap-2.5">
                    <div className="flex rounded-full overflow-hidden border border-slate-700">
                        <button className="px-3.5 py-1 text-xs bg-green-600 text-white font-medium">Active</button>
                        <button className="px-3.5 py-1 text-xs bg-transparent text-slate-500">Inactive</button>
                    </div>
                </div>
            </ContentHeader>
            <Content className="block py-0">
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <div className="flex flex-col h-screen relative overflow-hidden">
                        <div
                            className="flex-1 flex justify-center items-start p-[60px_40px_80px] overflow-auto gap-6"
                            style={{
                                background: "#f0f4f8",
                                backgroundImage: "radial-gradient(circle, #c8d6e5 1.5px, transparent 1.5px)",
                                backgroundSize: "24px 24px",
                            }}
                        >
                            {/* Main flow column */}
                            <div className="flex flex-col items-center min-w-[800px]">
                                <RenderChain
                                    node={flow}
                                    onAddTrigger={openAddTrigger}
                                    onAddAction={openAddAction}
                                    onDelete={handleDelete}
                                    onEdit={handleEditNode}
                                />
                            </div>

                            {/* Right side panels */}
                            <div className="flex flex-col gap-2.5 pt-0">
                                {hasRealTrigger && <SidePanelButton label="Add another start trigger" onClick={openAddTrigger} />}
                                <SidePanelButton label="Add contacts to this automation" />
                            </div>
                        </div>

                        {/* Modal layer */}
                        {modal?.type === "select_trigger" && (
                            <SelectTriggerModal onSelect={handleSelectTrigger} onClose={closeModal} />
                        )}
                        {modal?.type === "configure_trigger" && (
                            <ConfigureTriggerModal
                                trigger={modal.trigger}
                                config={modal.node?.config}
                                onSave={handleSaveTrigger}
                                onBack={() => setModal(modal.node ? null : { type: "select_trigger" })}
                                onClose={closeModal}
                            />
                        )}
                        {modal?.type === "add_action" && (
                            <AddActionModal onSelect={handleSelectAction} onClose={closeModal} />
                        )}
                        {modal?.type === "configure_wait" && (
                            <ConfigureWaitModal
                                config={modal.node?.config}
                                onSave={handleSaveAction}
                                onBack={() => setModal(modal.node || !modal.ctx ? null : { type: "add_action", ctx: modal.ctx })}
                                onClose={closeModal}
                            />
                        )}
                        {modal?.type === "configure_ifelse" && (
                            <ConfigureIfElseModal
                                config={modal.node?.config}
                                onSave={handleSaveAction}
                                onBack={() => setModal(modal.node || !modal.ctx ? null : { type: "add_action", ctx: modal.ctx })}
                                onClose={closeModal}
                            />
                        )}
                        {modal?.type === "configure_match" && (
                            <ConfigureMatchModal
                                config={modal.node?.config}
                                branches={modal.node?.matchBranches}
                                onSave={handleSaveAction}
                                onBack={() => setModal(modal.node || !modal.ctx ? null : { type: "add_action", ctx: modal.ctx })}
                                onClose={closeModal}
                            />
                        )}
                        {modal?.type === "configure_send_email" && (
                            <ConfigureEmailModal
                                config={modal.node?.config}
                                onSave={handleSaveAction}
                                onBack={() => setModal(modal.node || !modal.ctx ? null : { type: "add_action", ctx: modal.ctx })}
                                onClose={closeModal}
                            />
                        )}
                        {modal?.type === "configure_webhook" && (
                            <ConfigureWebhookModal
                                config={modal.node?.config}
                                onSave={handleSaveAction}
                                onBack={() => setModal(modal.node || !modal.ctx ? null : { type: "add_action", ctx: modal.ctx })}
                                onClose={closeModal}
                            />
                        )}
                        {modal?.type === "show_json" && (
                            <Dialog open onOpenChange={handleJsonDialogOpenChange}>
                                <DialogContent className="sm:max-w-[720px]">
                                    <DialogHeader>
                                        <DialogTitle>Workflow Configuration (JSON)</DialogTitle>
                                    </DialogHeader>
                                    <pre style={{
                                        background: "#f1f5f9", padding: 16, borderRadius: 8,
                                        fontSize: 12, overflow: "auto", maxHeight: 420,
                                        border: "1px solid #e2e8f0"
                                    }}>
                                        {JSON.stringify(flow, null, 2)}
                                    </pre>
                                    <div className="flex justify-end">
                                        <Button onClick={closeModal}>Close</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </DndContext>
            </Content>
        </>
    );
}
