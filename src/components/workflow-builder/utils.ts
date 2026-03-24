import { WorkflowNode, NodeConfig, NodeType } from "./types";
import { uid as generateUid } from "@/utils/uid";

export const uid = () => generateUid('n');

export const makeEnd = (): WorkflowNode => ({ id: uid(), type: "end" });

export const mapNode = (root: WorkflowNode | undefined | null, id: string, fn: (node: WorkflowNode) => WorkflowNode): WorkflowNode | null => {
    if (!root) return null;
    if (root.id === id) return fn(root);
    return {
        ...root,
        triggers: root.triggers ? root.triggers.map((t) => mapNode(t, id, fn) as WorkflowNode).filter(Boolean) : undefined,
        next: mapNode(root.next, id, fn) as WorkflowNode,
        yes: root.yes ? mapNode(root.yes, id, fn) as WorkflowNode : null,
        no: root.no ? mapNode(root.no, id, fn) as WorkflowNode : null,
    };
};

export const insertAfterNode = (root: WorkflowNode, afterId: string, type: NodeType, config: NodeConfig): WorkflowNode =>
    mapNode(root, afterId, (node) => {
        if (type === "ifelse") {
            return { ...node, next: { id: uid(), type, config, yes: makeEnd(), no: makeEnd() } };
        }
        return { ...node, next: { id: uid(), type, config, next: node.next } };
    }) as WorkflowNode;

export const insertBranchStart = (root: WorkflowNode, ifelseId: string, branch: "yes" | "no", type: NodeType, config: NodeConfig): WorkflowNode =>
    mapNode(root, ifelseId, (node) => ({
        ...node,
        [branch]: { id: uid(), type, config, next: node[branch] },
    })) as WorkflowNode;

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
    
    return {
        ...root,
        triggers: root.triggers ? root.triggers.map((t) => deleteNode(t, targetId) as WorkflowNode).filter(Boolean) : undefined,
        next: deleteNode(root.next, targetId) as WorkflowNode,
        yes: deleteNode(root.yes, targetId) as WorkflowNode,
        no: deleteNode(root.no, targetId) as WorkflowNode,
    };
};

export const createInitial = (): WorkflowNode => ({ id: "root", type: "workflow", triggers: [], next: makeEnd() });
