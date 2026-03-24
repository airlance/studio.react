import { useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { WorkflowNode, TriggerOption, ActionOption } from "./types";
import { createInitial, mapNode, insertAfterNode, insertBranchStart, deleteNode, moveNode, uid } from "./utils";
import { TRIGGERS } from "./constants";
import { ModalOverlay } from "./components/ModalShared";
import { SidePanelButton } from "./components/SidePanelButton";
import { RenderChain } from "./components/RenderChain";

// Modals
import { SelectTriggerModal } from "./modals/SelectTriggerModal";
import { ConfigureTriggerModal } from "./modals/ConfigureTriggerModal";
import { AddActionModal } from "./modals/AddActionModal";
import { ConfigureWaitModal } from "./modals/ConfigureWaitModal";
import { ConfigureIfElseModal } from "./modals/ConfigureIfElseModal";
import { ConfigureEmailModal } from "./modals/ConfigureEmailModal";
import { ConfigureWebhookModal } from "./modals/ConfigureWebhookModal";

export function WorkflowBuilder() {
    const [flow, setFlow] = useState<WorkflowNode>(createInitial());
    const [modal, setModal] = useState<any>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const openAddTrigger = () => setModal({ type: "select_trigger" });
    const openAddAction  = (ctx: any)  => setModal({ type: "add_action", ctx });
    const closeModal     = ()     => setModal(null);

    const handleSelectTrigger = (trigger: TriggerOption) => setModal({ type: "configure_trigger", trigger });
    const handleSaveTrigger = (config: any) => {
        if (modal.node) {
            setFlow((f) => mapNode(f, modal.node.id, (n) => ({ ...n, config: { ...n.config, ...config } })) as WorkflowNode);
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
    };

    const handleSelectAction = (action: ActionOption) => {
        const typeMap: Record<string, string> = {
            wait: "configure_wait", ifelse: "configure_ifelse",
            send_email: "configure_send_email", webhook: "configure_webhook",
            add_tag: "configure_send_email", notify: "configure_send_email",
        };
        setModal({ type: typeMap[action.id] || "add_action", ctx: modal.ctx, action });
    };

    const handleEditNode = (node: WorkflowNode) => {
        const typeMap: Record<string, string> = {
            trigger: "configure_trigger",
            wait: "configure_wait",
            ifelse: "configure_ifelse",
            send_email: "configure_send_email",
            webhook: "configure_webhook",
            add_tag: "configure_send_email",
            notify: "configure_send_email",
        };
        const m: any = { type: typeMap[node.type], node };
        if (node.type === "trigger") {
            m.trigger = TRIGGERS.find((t) => t.id === node.config?.triggerId);
        }
        setModal(m);
    };

    const handleSaveAction = (config: any) => {
        if (modal.node) {
            setFlow((f) => mapNode(f, modal.node.id, (n) => ({ ...n, config: { ...n.config, ...config } })) as WorkflowNode);
            closeModal();
        } else {
            doInsert(modal.ctx, modal.action?.id || "unknown", config);
        }
    };

    const doInsert = (ctx: any, type: any, config: any) => {
        if (ctx.branch) {
            setFlow((f) => insertBranchStart(f, ctx.ifelseId, ctx.branch, type, config));
        } else {
            setFlow((f) => insertAfterNode(f, ctx.afterId, type, config));
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        setFlow((f) => deleteNode(f, id) as WorkflowNode);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const nodeId = active.id as string;
            const target = over.data.current as any;
            if (target) {
                setFlow((f) => moveNode(f, nodeId, target));
            }
        }
    };

    const hasRealTrigger = flow.type === "workflow" && (flow.triggers?.length || 0) > 0;

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "700px", fontFamily: "system-ui, -apple-system, sans-serif", position: "relative" }}>
                {/* Header */}
                <div style={{ background: "#0f172a", color: "#fff", padding: "0 20px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                        <span style={{ color: "#64748b" }}>Automations</span>
                        <span style={{ color: "#64748b" }}>/</span>
                        <span style={{ color: "#e2e8f0" }}>New Automation</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <span style={{ fontSize: 12, color: "#64748b" }}>Saved</span>
                        <div style={{ display: "flex", borderRadius: 20, overflow: "hidden", border: "1px solid #334155" }}>
                            <button style={{ padding: "5px 14px", fontSize: 12, background: "#16a34a", color: "#fff", border: "none", cursor: "pointer", fontWeight: 500 }}>Active</button>
                            <button style={{ padding: "5px 14px", fontSize: 12, background: "transparent", color: "#64748b", border: "none", cursor: "pointer" }}>Inactive</button>
                        </div>
                    </div>
                </div>

                {/* Canvas */}
                <div style={{
                    flex: 1, minHeight: 640,
                    background: "#f0f4f8",
                    backgroundImage: "radial-gradient(circle, #c8d6e5 1.5px, transparent 1.5px)",
                    backgroundSize: "24px 24px",
                    display: "flex", justifyContent: "center", alignItems: "flex-start",
                    padding: "60px 40px 80px", overflow: "auto", gap: 24,
                }}>
                    {/* Main flow column */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <RenderChain
                            node={flow}
                            onAddTrigger={openAddTrigger}
                            onAddAction={openAddAction}
                            onDelete={handleDelete}
                            onEdit={handleEditNode}
                        />
                    </div>

                    {/* Right side panels */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 0 }}>
                        {hasRealTrigger && <SidePanelButton label="Add another start trigger" onClick={openAddTrigger} />}
                        <SidePanelButton label="Add contacts to this automation" />
                    </div>
                </div>

                {/* Modal layer */}
                {modal && (
                    <ModalOverlay onClose={closeModal}>
                        {modal.type === "select_trigger" && (
                            <SelectTriggerModal onSelect={handleSelectTrigger} onClose={closeModal} />
                        )}
                        {modal.type === "configure_trigger" && (
                            <ConfigureTriggerModal
                                trigger={modal.trigger}
                                config={modal.node?.config}
                                onSave={handleSaveTrigger}
                                onBack={() => setModal(modal.node ? null : { type: "select_trigger" })}
                                onClose={closeModal}
                            />
                        )}
                        {modal.type === "add_action" && (
                            <AddActionModal onSelect={handleSelectAction} onClose={closeModal} />
                        )}
                        {modal.type === "configure_wait" && (
                            <ConfigureWaitModal
                                config={modal.node?.config}
                                onSave={handleSaveAction}
                                onBack={() => setModal(modal.node ? null : { type: "add_action", ctx: modal.ctx })}
                                onClose={closeModal}
                            />
                        )}
                        {modal.type === "configure_ifelse" && (
                            <ConfigureIfElseModal
                                config={modal.node?.config}
                                onSave={handleSaveAction}
                                onBack={() => setModal(modal.node ? null : { type: "add_action", ctx: modal.ctx })}
                                onClose={closeModal}
                            />
                        )}
                        {modal.type === "configure_send_email" && (
                            <ConfigureEmailModal
                                config={modal.node?.config}
                                onSave={handleSaveAction}
                                onBack={() => setModal(modal.node ? null : { type: "add_action", ctx: modal.ctx })}
                                onClose={closeModal}
                            />
                        )}
                        {modal.type === "configure_webhook" && (
                            <ConfigureWebhookModal
                                config={modal.node?.config}
                                onSave={handleSaveAction}
                                onBack={() => setModal(modal.node ? null : { type: "add_action", ctx: modal.ctx })}
                                onClose={closeModal}
                            />
                        )}
                    </ModalOverlay>
                )}
            </div>
        </DndContext>
    );
}
