import { FlowEdge, FlowNode } from '@/types/automation';

interface LayoutOptions {
    rootId?: string;
    startX?: number;
    startY?: number;
    columnGap?: number;
    rowGap?: number;
}

interface QueueItem {
    nodeId: string;
    depth: number;
}

export function autoLayoutFlow(nodes: FlowNode[], edges: FlowEdge[], options: LayoutOptions = {}): FlowNode[] {
    if (nodes.length === 0) {
        return nodes;
    }

    const {
        rootId = nodes.find((node) => node.type === 'trigger')?.id || nodes[0].id,
        startX = 1540,
        startY = 120,
        columnGap = 320,
        rowGap = 220,
    } = options;

    const outgoing = new Map<string, FlowEdge[]>();
    edges.forEach((edge) => {
        const list = outgoing.get(edge.fromNodeId) || [];
        list.push(edge);
        outgoing.set(edge.fromNodeId, list);
    });

    const depthMap = new Map<string, number>();
    const orderByDepth = new Map<number, string[]>();
    const queue: QueueItem[] = [{ nodeId: rootId, depth: 0 }];
    const visited = new Set<string>();

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
            continue;
        }

        const { nodeId, depth } = current;
        if (visited.has(nodeId)) {
            const existingDepth = depthMap.get(nodeId);
            if (typeof existingDepth === 'number' && depth > existingDepth) {
                depthMap.set(nodeId, depth);
            }
            continue;
        }

        visited.add(nodeId);
        depthMap.set(nodeId, depth);

        const level = orderByDepth.get(depth) || [];
        level.push(nodeId);
        orderByDepth.set(depth, level);

        const children = outgoing.get(nodeId) || [];
        children.forEach((edge) => {
            queue.push({ nodeId: edge.toNodeId, depth: depth + 1 });
        });
    }

    // Place orphan nodes after the deepest level so nothing overlaps.
    let maxDepth = Math.max(...Array.from(depthMap.values()), 0);
    nodes.forEach((node) => {
        if (depthMap.has(node.id)) {
            return;
        }

        maxDepth += 1;
        depthMap.set(node.id, maxDepth);
        orderByDepth.set(maxDepth, [node.id]);
    });

    const positioned = new Map<string, { x: number; y: number }>();

    Array.from(orderByDepth.entries())
        .sort((a, b) => a[0] - b[0])
        .forEach(([depth, levelNodes]) => {
            const count = levelNodes.length;
            levelNodes.forEach((nodeId, index) => {
                const offsetIndex = index - (count - 1) / 2;
                positioned.set(nodeId, {
                    x: startX + offsetIndex * columnGap,
                    y: startY + depth * rowGap,
                });
            });
        });

    return nodes.map((node) => ({
        ...node,
        position: positioned.get(node.id) || node.position,
    }));
}
