import { FlowEdge } from '@/types/automation';

interface CreateEdgeInput {
    fromNodeId: string;
    toNodeId: string;
    branchId?: string;
    label?: string;
}

export interface AttachNodeToFlowInput {
    edges: FlowEdge[];
    sourceNodeId: string;
    newNodeId: string;
    branchId?: string;
    label?: string;
    createEdgeId: () => string;
}

function createEdge(input: CreateEdgeInput, createEdgeId: () => string): FlowEdge {
    return {
        id: createEdgeId(),
        fromNodeId: input.fromNodeId,
        toNodeId: input.toNodeId,
        branchId: input.branchId,
        label: input.label,
    };
}

export function attachNodeToFlow(input: AttachNodeToFlowInput): FlowEdge[] {
    const { edges, sourceNodeId, newNodeId, branchId, label, createEdgeId } = input;

    const foundIndex = edges.findIndex((edge) => {
        if (edge.fromNodeId !== sourceNodeId) {
            return false;
        }

        if (branchId) {
            return edge.branchId === branchId;
        }

        return !edge.branchId;
    });

    if (foundIndex < 0) {
        const nextEdge = createEdge(
            {
                fromNodeId: sourceNodeId,
                toNodeId: newNodeId,
                branchId,
                label,
            },
            createEdgeId,
        );

        return [...edges, nextEdge];
    }

    const existing = edges[foundIndex];
    const replaced = edges.filter((_, idx) => idx !== foundIndex);

    const firstEdge = createEdge(
        {
            fromNodeId: sourceNodeId,
            toNodeId: newNodeId,
            branchId,
            label,
        },
        createEdgeId,
    );

    const secondEdge = createEdge(
        {
            fromNodeId: newNodeId,
            toNodeId: existing.toNodeId,
        },
        createEdgeId,
    );

    return [...replaced, firstEdge, secondEdge];
}
