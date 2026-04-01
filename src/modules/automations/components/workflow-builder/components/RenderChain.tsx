import { WorkflowNode } from "@/types/automation";
import { Line } from "./Line.tsx";
import { AddBtn } from "./AddBtn.tsx";
import { EndNode } from "./EndNode.tsx";
import { BranchBadge } from "./BranchBadge.tsx";
import { TriggerCard } from "../nodes/TriggerCard.tsx";
import { WaitCard } from "../nodes/WaitCard.tsx";
import { IfElseCard } from "../nodes/IfElseCard.tsx";
import { MatchCard } from "../nodes/MatchCard.tsx";
import { ActionCard } from "../nodes/ActionCard.tsx";
import { PlaceholderCard } from "../nodes/PlaceholderCard.tsx";
import { ALL_ACTIONS } from "@/constants/automation";
import { Zap } from "lucide-react";
import { DropTarget } from "@/utils/automation";

interface RenderChainProps {
    node: WorkflowNode | null | undefined;
    onAddTrigger: () => void;
    onAddAction: (ctx: DropTarget) => void;
    onDelete: (id: string) => void;
    onEdit: (node: WorkflowNode) => void;
}

const CARD_MIN_WIDTH = 300;
const IFELSE_BRANCH_WIDTH = 260;
const IFELSE_BRANCH_GAP = 100;
const MATCH_BRANCH_BASE_WIDTH = 240;
const MATCH_BRANCH_GAP = 32;

function estimateSubtreeWidth(node: WorkflowNode | null | undefined): number {
    if (!node || node.type === "end") {
        return CARD_MIN_WIDTH;
    }

    if (node.type === "ifelse") {
        const yesWidth = estimateSubtreeWidth(node.yes);
        const noWidth = estimateSubtreeWidth(node.no);
        const branchWidth = Math.max(IFELSE_BRANCH_WIDTH, yesWidth, noWidth);
        return (branchWidth * 2) + IFELSE_BRANCH_GAP;
    }

    if (node.type === "match") {
        const branches = node.matchBranches || [];
        if (branches.length === 0) {
            return MATCH_BRANCH_BASE_WIDTH;
        }

        const branchWidths = branches.map((branch) =>
            Math.max(MATCH_BRANCH_BASE_WIDTH, estimateSubtreeWidth(branch.next))
        );
        const totalBranchesWidth = branchWidths.reduce((sum, width) => sum + width, 0);
        return totalBranchesWidth + (branches.length - 1) * MATCH_BRANCH_GAP;
    }

    return Math.max(CARD_MIN_WIDTH, estimateSubtreeWidth(node.next));
}

export function RenderChain({ node, onAddTrigger, onAddAction, onDelete, onEdit }: RenderChainProps) {
    if (!node) return null;

    if (node.type === "end") return <EndNode />;

    if (node.type === "workflow") {
        const triggers = node.triggers || [];
        const hasTriggers = triggers.length > 0;
        const BW = 280; // block width
        const GAP = 24;
        const totalWidth = triggers.length * BW + (triggers.length - 1) * GAP;

        return (
            <>
                <div className="flex items-end" style={{ gap: GAP }}>
                    {hasTriggers ? (
                        triggers.map((t) => (
                            <TriggerCard key={t.id} node={t} onDelete={() => onDelete(t.id)} onClick={() => onEdit(t)} />
                        ))
                    ) : (
                        <PlaceholderCard onClick={onAddTrigger} />
                    )}
                </div>

                {hasTriggers && (
                    <div className="relative flex flex-col items-center" style={{ width: totalWidth }}>
                        {triggers.length > 1 ? (
                            <>
                                <div className="flex w-full justify-between" style={{ padding: `0 ${BW / 2}px` }}>
                                    {triggers.map((t) => <div key={t.id} className="w-0.5 bg-slate-300 shrink-0 self-center h-5" />)}
                                </div>
                                <div style={{
                                    position: "absolute", top: 20, left: BW / 2, right: BW / 2, height: 2, background: "#cbd5e1"
                                }} />
                                <div className="w-0.5 bg-slate-300 shrink-0 self-center h-5" />
                            </>
                        ) : (
                            <Line />
                        )}
                    </div>
                )}
                {!hasTriggers && <Line />}

                <AddBtn 
                    id={`add-after-${node.id}`} 
                    onClick={() => onAddAction({ afterId: node.id })} 
                    data={{ afterId: node.id }}
                />
                <Line />
                <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
            </>
        );
    }

    if (node.type === "trigger") {
        return (
            <>
                <TriggerCard node={node} onDelete={() => onDelete(node.id)} onClick={() => onEdit(node)} />
                <Line />
                <AddBtn 
                    id={`add-after-${node.id}`} 
                    onClick={() => onAddAction({ afterId: node.id })} 
                    data={{ afterId: node.id }}
                />
                <Line />
                <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
            </>
        );
    }

    if (node.type === "wait") {
        return (
            <>
                <WaitCard node={node} onDelete={() => onDelete(node.id)} onClick={() => onEdit(node)} />
                <Line />
                <AddBtn 
                    id={`add-after-${node.id}`} 
                    onClick={() => onAddAction({ afterId: node.id })} 
                    data={{ afterId: node.id }}
                />
                <Line />
                <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
            </>
        );
    }

    if (node.type === "ifelse") {
        const BW = 260; // branch width
        const GAP = 100;
        return (
            <>
                <IfElseCard node={node} onDelete={() => onDelete(node.id)} onClick={() => onEdit(node)} />
                {/* Fork lines */}
                <div className="relative flex flex-col items-center" style={{ width: (BW * 2) + GAP }}>
                    <div className="w-0.5 bg-slate-300 h-6" />
                    <div style={{
                        position: "absolute", top: 24, left: BW / 2, right: BW / 2, height: 2, background: "#cbd5e1",
                    }} />
                    {/* Vertical stubs connecting to Yes/No circles */}
                    <div className="flex w-full justify-between" style={{ padding: `0 ${BW / 2}px` }}>
                        <div className="w-0.5 bg-slate-300 h-4" />
                        <div className="w-0.5 bg-slate-300 h-4" />
                    </div>
                </div>
                {/* Branch columns */}
                <div className="flex items-start -mt-0.5" style={{ gap: GAP }}>
                    {/* YES */}
                    <div className="flex flex-col items-center" style={{ width: BW }}>
                        <BranchBadge label="Yes" color="#16a34a" />
                        <Line />
                        <AddBtn 
                            id={`add-ifelse-${node.id}-yes`} 
                            onClick={() => onAddAction({ ifelseId: node.id, branch: "yes" })} 
                            data={{ ifelseId: node.id, branch: "yes" }}
                        />
                        <Line />
                        <RenderChain node={node.yes} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
                    </div>
                    {/* NO */}
                    <div className="flex flex-col items-center" style={{ width: BW }}>
                        <BranchBadge label="No" color="#dc2626" />
                        <Line />
                        <AddBtn 
                            id={`add-ifelse-${node.id}-no`} 
                            onClick={() => onAddAction({ ifelseId: node.id, branch: "no" })} 
                            data={{ ifelseId: node.id, branch: "no" }}
                        />
                        <Line />
                        <RenderChain node={node.no} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
                    </div>
                </div>
            </>
        );
    }

    if (node.type === "match") {
        const branches = node.matchBranches || [];
        const hasBranches = branches.length > 0;
        const branchGap = MATCH_BRANCH_GAP;
        const branchWidths = branches.map((branch) =>
            Math.max(MATCH_BRANCH_BASE_WIDTH, estimateSubtreeWidth(branch.next))
        );
        const totalWidth = hasBranches
            ? branchWidths.reduce((sum, width) => sum + width, 0) + (branches.length - 1) * branchGap
            : MATCH_BRANCH_BASE_WIDTH;

        const centers: number[] = [];
        if (hasBranches) {
            let cursor = 0;
            for (let index = 0; index < branchWidths.length; index++) {
                centers.push(cursor + (branchWidths[index] / 2));
                cursor += branchWidths[index] + branchGap;
            }
        }

        return (
            <>
                <MatchCard node={node} onDelete={() => onDelete(node.id)} onClick={() => onEdit(node)} />
                {hasBranches ? (
                    <>
                        <div className="relative flex flex-col items-center" style={{ width: totalWidth }}>
                            <div className="w-0.5 bg-slate-300 h-6" />
                            <div style={{
                                position: "absolute",
                                top: 24,
                                left: centers[0],
                                right: totalWidth - centers[centers.length - 1],
                                height: 2,
                                background: "#cbd5e1",
                            }} />
                            <div className="relative w-full h-4">
                                {branches.map((branch, index) => (
                                    <div
                                        key={branch.id}
                                        style={{
                                            position: "absolute",
                                            left: centers[index] - 1,
                                            width: 2,
                                            background: "#cbd5e1",
                                            height: 16,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-start -mt-0.5" style={{ gap: branchGap }}>
                            {branches.map((branch, index) => (
                                <div key={branch.id} className="flex flex-col items-center" style={{ width: branchWidths[index] }}>
                                    <BranchBadge label={branch.label} color="#4f46e5" variant="rectangle" />
                                    <Line />
                                    <AddBtn
                                        id={`add-match-${node.id}-${branch.id}`}
                                        onClick={() => onAddAction({ matchId: node.id, matchBranchId: branch.id })}
                                        data={{ matchId: node.id, matchBranchId: branch.id }}
                                    />
                                    <Line />
                                    <RenderChain node={branch.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <Line />
                        <AddBtn
                            id={`add-after-${node.id}`}
                            onClick={() => onAddAction({ afterId: node.id })}
                            data={{ afterId: node.id }}
                        />
                        <Line />
                        <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
                    </>
                )}
            </>
        );
    }

    // Generic action (send_email, webhook, add_tag, notify)
    const actionMeta = ALL_ACTIONS.find((a) => a.id === node.type) || { Icon: Zap, bg: "#374151" };
    const Icon = actionMeta.Icon;
    const labelMap: Record<string, string> = {
        send_email: "Send an email:", webhook: "Webhook:", add_tag: "Add tag:", notify: "Notify:",
    };
    return (
        <>
            <ActionCard
                node={node}
                icon={Icon}
                bg={actionMeta.bg}
                label={labelMap[node.type] || node.type}
                sub={node.config?.name || node.config?.url || node.config?.tag || "Configured"}
                onDelete={() => onDelete(node.id)}
                onClick={() => onEdit(node)}
            />
            <Line />
            <AddBtn 
                id={`add-after-${node.id}`} 
                onClick={() => onAddAction({ afterId: node.id })} 
                data={{ afterId: node.id }}
            />
            <Line />
            <RenderChain node={node.next} onAddTrigger={onAddTrigger} onAddAction={onAddAction} onDelete={onDelete} onEdit={onEdit} />
        </>
    );
}
