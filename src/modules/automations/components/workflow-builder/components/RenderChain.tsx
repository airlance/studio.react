import { WorkflowNode } from "@/types/automation";
import { Line } from "./Line.tsx";
import { BranchCurve } from "./BranchCurve.tsx";
import { MergeConnector } from "./MergeConnector.tsx";
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
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableMatchBranchBadge } from "./SortableMatchBranchBadge.tsx";

interface RenderChainProps {
    node: WorkflowNode | null | undefined;
    onAddTrigger: () => void;
    onAddAction: (ctx: DropTarget) => void;
    onDelete: (id: string) => void;
    onEdit: (node: WorkflowNode) => void;
}

type ChainPassthrough = Omit<RenderChainProps, "node">;

const CARD_MIN_WIDTH = 300;
const IFELSE_BRANCH_WIDTH = 260;
const IFELSE_BRANCH_GAP = 100;
const MATCH_BRANCH_BASE_WIDTH = 240;
const MATCH_BRANCH_GAP = 32;
const CURVE_HEIGHT = 56;
const CURVE_COLOR = "#9ca3af";

// Width of a trigger card — must match what TriggerCard actually renders
const TRIGGER_CARD_WIDTH = 280;
const TRIGGER_GAP = 24;

function estimateSubtreeWidth(node: WorkflowNode | null | undefined): number {
    if (!node || node.type === "end") return CARD_MIN_WIDTH;

    if (node.type === "ifelse") {
        const yesWidth = estimateSubtreeWidth(node.yes);
        const noWidth = estimateSubtreeWidth(node.no);
        const branchWidth = Math.max(IFELSE_BRANCH_WIDTH, yesWidth, noWidth);
        return branchWidth * 2 + IFELSE_BRANCH_GAP;
    }

    if (node.type === "match") {
        const branches = node.matchBranches || [];
        if (branches.length === 0) return MATCH_BRANCH_BASE_WIDTH;
        const widths = branches.map((b) =>
            Math.max(MATCH_BRANCH_BASE_WIDTH, estimateSubtreeWidth(b.next))
        );
        return widths.reduce((s, w) => s + w, 0) + (branches.length - 1) * MATCH_BRANCH_GAP;
    }

    return Math.max(CARD_MIN_WIDTH, estimateSubtreeWidth(node.next));
}

export function RenderChain({
                                node,
                                onAddTrigger,
                                onAddAction,
                                onDelete,
                                onEdit,
                            }: RenderChainProps) {
    const pass: ChainPassthrough = { onAddTrigger, onAddAction, onDelete, onEdit };

    if (!node) return null;

    // ── end ──────────────────────────────────────────────────────────────────
    if (node.type === "end") return <EndNode />;

    // ── workflow root ─────────────────────────────────────────────────────────
    if (node.type === "workflow") {
        const triggers = node.triggers || [];
        const hasTriggers = triggers.length > 0;

        const totalWidth =
            triggers.length * TRIGGER_CARD_WIDTH +
            (triggers.length - 1) * TRIGGER_GAP;

        // bottom-center of each trigger card (absolute x from left of wrapper)
        const triggerCenters = triggers.map(
            (_, i) => i * (TRIGGER_CARD_WIDTH + TRIGGER_GAP) + TRIGGER_CARD_WIDTH / 2
        );

        return (
            <>
                {/* Trigger row */}
                <div className="flex items-end" style={{ gap: TRIGGER_GAP }}>
                    {hasTriggers ? (
                        triggers.map((t) => (
                            <TriggerCard
                                key={t.id}
                                node={t}
                                onDelete={() => onDelete(t.id)}
                                onClick={() => onEdit(t)}
                            />
                        ))
                    ) : (
                        <PlaceholderCard onClick={onAddTrigger} />
                    )}
                </div>

                {/* Merge connector — curves from each trigger down to single point */}
                {hasTriggers && (
                    <MergeConnector
                        totalWidth={triggers.length === 1 ? TRIGGER_CARD_WIDTH : totalWidth}
                        centers={triggerCenters}
                        height={triggers.length === 1 ? 20 : CURVE_HEIGHT}
                        color={CURVE_COLOR}
                    />
                )}
                {!hasTriggers && <Line />}

                <AddBtn
                    id={`add-after-${node.id}`}
                    onClick={() => onAddAction({ afterId: node.id })}
                    data={{ afterId: node.id }}
                />
                <Line />
                <RenderChain node={node.next} {...pass} />
            </>
        );
    }

    // ── trigger ───────────────────────────────────────────────────────────────
    if (node.type === "trigger") {
        return (
            <>
                <TriggerCard
                    node={node}
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
                <RenderChain node={node.next} {...pass} />
            </>
        );
    }

    // ── wait ──────────────────────────────────────────────────────────────────
    if (node.type === "wait") {
        return (
            <>
                <WaitCard
                    node={node}
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
                <RenderChain node={node.next} {...pass} />
            </>
        );
    }

    // ── if/else ───────────────────────────────────────────────────────────────
    if (node.type === "ifelse") {
        const BW = IFELSE_BRANCH_WIDTH;
        const GAP = IFELSE_BRANCH_GAP;
        const totalWidth = BW * 2 + GAP;

        const parentCX = totalWidth / 2;
        const yesCX = BW / 2;
        const noCX = BW + GAP + BW / 2;

        const yesOffset = parentCX - yesCX;
        const noOffset = parentCX - noCX;

        return (
            <>
                <IfElseCard
                    node={node}
                    onDelete={() => onDelete(node.id)}
                    onClick={() => onEdit(node)}
                />

                <div className="flex items-start" style={{ gap: GAP }}>
                    {/* YES */}
                    <div className="flex flex-col items-center" style={{ width: BW }}>
                        <BranchCurve
                            branchWidth={BW}
                            parentCenterOffset={yesOffset}
                            height={CURVE_HEIGHT}
                            color={CURVE_COLOR}
                        />
                        <BranchBadge label="Yes" color="#16a34a" />
                        <Line />
                        <AddBtn
                            id={`add-ifelse-${node.id}-yes`}
                            onClick={() => onAddAction({ ifelseId: node.id, branch: "yes" })}
                            data={{ ifelseId: node.id, branch: "yes" }}
                        />
                        <Line />
                        <RenderChain node={node.yes} {...pass} />
                    </div>

                    {/* NO */}
                    <div className="flex flex-col items-center" style={{ width: BW }}>
                        <BranchCurve
                            branchWidth={BW}
                            parentCenterOffset={noOffset}
                            height={CURVE_HEIGHT}
                            color={CURVE_COLOR}
                        />
                        <BranchBadge label="No" color="#dc2626" />
                        <Line />
                        <AddBtn
                            id={`add-ifelse-${node.id}-no`}
                            onClick={() => onAddAction({ ifelseId: node.id, branch: "no" })}
                            data={{ ifelseId: node.id, branch: "no" }}
                        />
                        <Line />
                        <RenderChain node={node.no} {...pass} />
                    </div>
                </div>
            </>
        );
    }

    // ── match ─────────────────────────────────────────────────────────────────
    if (node.type === "match") {
        const branches = node.matchBranches || [];
        const hasBranches = branches.length > 0;
        const branchGap = MATCH_BRANCH_GAP;

        const branchWidths = branches.map((b) =>
            Math.max(MATCH_BRANCH_BASE_WIDTH, estimateSubtreeWidth(b.next))
        );

        const totalWidth = hasBranches
            ? branchWidths.reduce((s, w) => s + w, 0) + (branches.length - 1) * branchGap
            : MATCH_BRANCH_BASE_WIDTH;

        const columnLeftEdges: number[] = [];
        if (hasBranches) {
            let cursor = 0;
            for (let i = 0; i < branchWidths.length; i++) {
                columnLeftEdges.push(cursor);
                cursor += branchWidths[i] + branchGap;
            }
        }

        const parentCX = totalWidth / 2;

        return (
            <>
                <MatchCard
                    node={node}
                    onDelete={() => onDelete(node.id)}
                    onClick={() => onEdit(node)}
                />

                {hasBranches ? (
                    <SortableContext
                        items={branches.map((b) => b.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className="flex items-start" style={{ gap: branchGap }}>
                            {branches.map((branch, i) => {
                                const colCX = columnLeftEdges[i] + branchWidths[i] / 2;
                                const offset = parentCX - colCX;

                                return (
                                    <div
                                        key={branch.id}
                                        className="flex flex-col items-center"
                                        style={{ width: branchWidths[i] }}
                                    >
                                        <BranchCurve
                                            branchWidth={branchWidths[i]}
                                            parentCenterOffset={offset}
                                            height={CURVE_HEIGHT}
                                            color={CURVE_COLOR}
                                        />
                                        <SortableMatchBranchBadge
                                            branchId={branch.id}
                                            matchId={node.id}
                                            label={branch.label}
                                        />
                                        <Line />
                                        <AddBtn
                                            id={`add-match-${node.id}-${branch.id}`}
                                            onClick={() =>
                                                onAddAction({
                                                    matchId: node.id,
                                                    matchBranchId: branch.id,
                                                })
                                            }
                                            data={{ matchId: node.id, matchBranchId: branch.id }}
                                        />
                                        <Line />
                                        <RenderChain node={branch.next} {...pass} />
                                    </div>
                                );
                            })}
                        </div>
                    </SortableContext>
                ) : (
                    <>
                        <Line />
                        <AddBtn
                            id={`add-after-${node.id}`}
                            onClick={() => onAddAction({ afterId: node.id })}
                            data={{ afterId: node.id }}
                        />
                        <Line />
                        <RenderChain node={node.next} {...pass} />
                    </>
                )}
            </>
        );
    }

    // ── generic action ────────────────────────────────────────────────────────
    const actionMeta = ALL_ACTIONS.find((a) => a.id === node.type) || {
        Icon: Zap,
        bg: "#374151",
    };
    const Icon = actionMeta.Icon;
    const labelMap: Record<string, string> = {
        send_email: "Send an email:",
        webhook: "Webhook:",
        add_tag: "Add tag:",
        notify: "Notify:",
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
            <RenderChain node={node.next} {...pass} />
        </>
    );
}