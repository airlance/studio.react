import { WorkflowNode, NodeConfig, NodeType, MatchBranch } from "@/types/automation";
import { uid as generateUid } from "@/utils/uid.ts";

export interface DropTarget {
    afterId?: string;
    ifelseId?: string;
    branch?: "yes" | "no";
    matchId?: string;
    matchBranchId?: string;
}

export const uid = () => generateUid('n');

export const makeEnd = (): WorkflowNode => ({ id: uid(), type: "end" });

const DEFAULT_MATCH_CASES = ["Match 1", "Match 2", "Match 3"];

const getMatchLabels = (config: NodeConfig): string[] => {
    const cases = config.cases;
    if (!Array.isArray(cases)) {
        return DEFAULT_MATCH_CASES;
    }

    const labels = cases
        .map((value) => value.trim())
        .filter((value) => value.length > 0);

    return labels.length > 0 ? labels : DEFAULT_MATCH_CASES;
};

const createMatchBranches = (labels: string[]): MatchBranch[] =>
    labels.map((label) => ({
        id: uid(),
        label,
        next: makeEnd(),
    }));

const buildInsertedNode = (
    type: NodeType,
    config: NodeConfig,
    nextNode: WorkflowNode | null | undefined,
): WorkflowNode => {
    if (type === "ifelse") {
        return { id: uid(), type, config, yes: makeEnd(), no: makeEnd() };
    }

    if (type === "match") {
        const labels = getMatchLabels(config);
        return {
            id: uid(),
            type,
            config: { ...config, cases: labels },
            matchBranches: createMatchBranches(labels),
        };
    }

    return { id: uid(), type, config, next: nextNode || makeEnd() };
};

export const syncMatchBranches = (
    existingBranches: MatchBranch[] | undefined,
    labels: string[],
): MatchBranch[] => {
    const normalisedLabels = labels.length > 0 ? labels : DEFAULT_MATCH_CASES;
    const branches = existingBranches || [];

    return normalisedLabels.map((label, index) => {
        const existingBranch = branches[index];
        if (!existingBranch) {
            return { id: uid(), label, next: makeEnd() };
        }

        return {
            ...existingBranch,
            label,
        };
    });
};

export const mapNode = (root: WorkflowNode | undefined | null, id: string, fn: (node: WorkflowNode) => WorkflowNode): WorkflowNode | null => {
    if (!root) return null;
    if (root.id === id) return fn(root);
    return {
        ...root,
        triggers: root.triggers ? root.triggers.map((t) => mapNode(t, id, fn) as WorkflowNode).filter(Boolean) : undefined,
        next: mapNode(root.next, id, fn) as WorkflowNode,
        yes: root.yes ? mapNode(root.yes, id, fn) as WorkflowNode : null,
        no: root.no ? mapNode(root.no, id, fn) as WorkflowNode : null,
        matchBranches: root.matchBranches
            ? root.matchBranches.map((branch) => ({
                ...branch,
                next: mapNode(branch.next, id, fn) as WorkflowNode,
            }))
            : undefined,
    };
};

export const insertAfterNode = (root: WorkflowNode, afterId: string, type: NodeType, config: NodeConfig): WorkflowNode =>
    mapNode(root, afterId, (node) => {
        return { ...node, next: buildInsertedNode(type, config, node.next) };
    }) as WorkflowNode;

export const insertBranchStart = (root: WorkflowNode, ifelseId: string, branch: "yes" | "no", type: NodeType, config: NodeConfig): WorkflowNode =>
    mapNode(root, ifelseId, (node) => ({
        ...node,
        [branch]: buildInsertedNode(type, config, node[branch]),
    })) as WorkflowNode;

export const insertMatchBranchStart = (
    root: WorkflowNode,
    matchId: string,
    matchBranchId: string,
    type: NodeType,
    config: NodeConfig,
): WorkflowNode =>
    mapNode(root, matchId, (node) => {
        if (node.type !== "match" || !node.matchBranches) {
            return node;
        }

        return {
            ...node,
            matchBranches: node.matchBranches.map((branch) =>
                branch.id === matchBranchId
                    ? { ...branch, next: buildInsertedNode(type, config, branch.next) }
                    : branch
            ),
        };
    }) as WorkflowNode;

export const reorderMatchBranches = (
    root: WorkflowNode,
    matchId: string,
    activeBranchId: string,
    overBranchId: string,
): WorkflowNode =>
    mapNode(root, matchId, (node) => {
        if (node.type !== "match" || !node.matchBranches) {
            return node;
        }

        const fromIndex = node.matchBranches.findIndex((branch) => branch.id === activeBranchId);
        const toIndex = node.matchBranches.findIndex((branch) => branch.id === overBranchId);
        if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
            return node;
        }

        const reordered = [...node.matchBranches];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);

        return {
            ...node,
            matchBranches: reordered,
        };
    }) as WorkflowNode;

export const deleteNode = (root: WorkflowNode | null | undefined, targetId: string): WorkflowNode | null => {
    if (!root) return null;
    if (root.type === "workflow") {
        const triggers = root.triggers || [];
        const filtered = triggers.filter((t) => t.id !== targetId);
        if (filtered.length !== triggers.length) return { ...root, triggers: filtered };
    }
    if (root.next?.id === targetId) return { ...root, next: root.next.type === "ifelse" ? makeEnd() : (root.next.next || makeEnd()) };
    if (root.yes?.id === targetId) return { ...root, yes: root.yes.next || makeEnd() };
    if (root.no?.id === targetId) return { ...root, no: root.no.next || makeEnd() };
    if (root.matchBranches) {
        const directBranchMatch = root.matchBranches.find((branch) => branch.next?.id === targetId);
        if (directBranchMatch) {
            return {
                ...root,
                matchBranches: root.matchBranches.map((branch) =>
                    branch.id === directBranchMatch.id
                        ? { ...branch, next: branch.next?.next || makeEnd() }
                        : branch
                ),
            };
        }
    }

    return {
        ...root,
        triggers: root.triggers ? root.triggers.map((t) => deleteNode(t, targetId) as WorkflowNode).filter(Boolean) : undefined,
        next: deleteNode(root.next, targetId) as WorkflowNode,
        yes: deleteNode(root.yes, targetId) as WorkflowNode,
        no: deleteNode(root.no, targetId) as WorkflowNode,
        matchBranches: root.matchBranches
            ? root.matchBranches.map((branch) => ({
                ...branch,
                next: deleteNode(branch.next, targetId) as WorkflowNode,
            }))
            : undefined,
    };
};

export const findNode = (root: WorkflowNode | null | undefined, id: string): WorkflowNode | null => {
    if (!root) return null;
    if (root.id === id) return root;
    let found = findNode(root.next, id);
    if (found) return found;
    if (root.triggers) {
        for (const t of root.triggers) {
            found = findNode(t, id);
            if (found) return found;
        }
    }
    if (root.yes) found = findNode(root.yes, id);
    if (found) return found;
    if (root.no) found = findNode(root.no, id);
    if (found) return found;

    if (root.matchBranches) {
        for (const branch of root.matchBranches) {
            found = findNode(branch.next, id);
            if (found) return found;
        }
    }

    return found;
};

export const moveNode = (root: WorkflowNode, nodeId: string, target: DropTarget): WorkflowNode => {
    // 1. Find the node to move
    const nodeToMove = findNode(root, nodeId);
    if (!nodeToMove) return root;

    // 2. Prevent dropping onto itself or its children
    if (target.afterId === nodeId || target.ifelseId === nodeId || target.matchId === nodeId) return root;
    // (A more thorough check would be isDescendant(nodeToMove, target))

    // 3. Remove from old position
    const cleaned = deleteNode(root, nodeId) as WorkflowNode;

    // 4. Insert into new position
    if (target.branch && target.ifelseId) {
        return mapNode(cleaned, target.ifelseId, (n) => ({
            ...n,
            [target.branch!]: { ...nodeToMove, next: n[target.branch!] as WorkflowNode },
        })) as WorkflowNode;
    } else if (target.matchId && target.matchBranchId) {
        return mapNode(cleaned, target.matchId, (n) => {
            if (n.type !== "match" || !n.matchBranches) {
                return n;
            }

            return {
                ...n,
                matchBranches: n.matchBranches.map((branch) =>
                    branch.id === target.matchBranchId
                        ? { ...branch, next: { ...nodeToMove, next: branch.next } }
                        : branch
                ),
            };
        }) as WorkflowNode;
    } else if (target.afterId) {
        return mapNode(cleaned, target.afterId, (n) => ({
            ...n,
            next: { ...nodeToMove, next: n.next as WorkflowNode },
        })) as WorkflowNode;
    }

    return cleaned;
};

export const createInitial = (): WorkflowNode => ({ id: "root", type: "workflow", triggers: [], next: makeEnd() });
