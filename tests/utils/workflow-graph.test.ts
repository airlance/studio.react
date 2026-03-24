import { describe, expect, it } from 'vitest';
import { attachNodeToFlow } from '@/utils/workflow-graph';
import { FlowEdge } from '@/types/automation';

function createIds() {
    let counter = 0;
    return () => {
        counter += 1;
        return 'edge-' + counter;
    };
}

describe('attachNodeToFlow', () => {
    it('adds a new edge when source has no outgoing edge for branch', () => {
        const edges: FlowEdge[] = [];
        const createEdgeId = createIds();

        const next = attachNodeToFlow({
            edges,
            sourceNodeId: 'source',
            newNodeId: 'new',
            createEdgeId,
        });

        expect(next).toEqual([
            {
                id: 'edge-1',
                fromNodeId: 'source',
                toNodeId: 'new',
                branchId: undefined,
                label: undefined,
            },
        ]);
    });

    it('rewires existing linear edge through new node', () => {
        const edges: FlowEdge[] = [
            { id: 'edge-existing', fromNodeId: 'source', toNodeId: 'old-target' },
        ];
        const createEdgeId = createIds();

        const next = attachNodeToFlow({
            edges,
            sourceNodeId: 'source',
            newNodeId: 'new',
            createEdgeId,
        });

        expect(next).toEqual([
            {
                id: 'edge-1',
                fromNodeId: 'source',
                toNodeId: 'new',
                branchId: undefined,
                label: undefined,
            },
            {
                id: 'edge-2',
                fromNodeId: 'new',
                toNodeId: 'old-target',
                branchId: undefined,
                label: undefined,
            },
        ]);
    });

    it('rewires only selected match branch', () => {
        const edges: FlowEdge[] = [
            { id: 'edge-a', fromNodeId: 'match', toNodeId: 'target-a', branchId: 'a', label: 'A' },
            { id: 'edge-b', fromNodeId: 'match', toNodeId: 'target-b', branchId: 'b', label: 'B' },
        ];
        const createEdgeId = createIds();

        const next = attachNodeToFlow({
            edges,
            sourceNodeId: 'match',
            newNodeId: 'new-node',
            branchId: 'a',
            label: 'A',
            createEdgeId,
        });

        expect(next).toEqual([
            { id: 'edge-b', fromNodeId: 'match', toNodeId: 'target-b', branchId: 'b', label: 'B' },
            { id: 'edge-1', fromNodeId: 'match', toNodeId: 'new-node', branchId: 'a', label: 'A' },
            { id: 'edge-2', fromNodeId: 'new-node', toNodeId: 'target-a', branchId: undefined, label: undefined },
        ]);
    });
});
