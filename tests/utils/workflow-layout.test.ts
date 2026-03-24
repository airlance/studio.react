import { describe, expect, it } from 'vitest';
import { autoLayoutFlow } from '@/utils/workflow-layout';
import { FlowEdge, FlowNode } from '@/types/automation';

describe('autoLayoutFlow', () => {
    it('places nodes by graph depth from trigger', () => {
        const nodes: FlowNode[] = [
            { id: 't', type: 'trigger', position: { x: 0, y: 0 }, data: { triggerType: 'manual', label: 'Start', schedule: 'realtime', processingLimit: 'unlimited' } },
            { id: 'a', type: 'action', position: { x: 0, y: 0 }, data: { actionType: 'send_email', title: 'A', actor: 'Bot', object: 'Contact', description: '' } },
            { id: 'm', type: 'match', position: { x: 0, y: 0 }, data: { title: 'M', rules: [], defaultLabel: 'Else' } },
            { id: 'e', type: 'end', position: { x: 0, y: 0 }, data: {} },
        ];

        const edges: FlowEdge[] = [
            { id: 'e1', fromNodeId: 't', toNodeId: 'a' },
            { id: 'e2', fromNodeId: 'a', toNodeId: 'm' },
            { id: 'e3', fromNodeId: 'm', toNodeId: 'e', branchId: 'default', label: 'Else' },
        ];

        const result = autoLayoutFlow(nodes, edges, { startY: 100, rowGap: 200 });
        const byId = Object.fromEntries(result.map((node) => [node.id, node]));

        expect(byId.t.position.y).toBe(100);
        expect(byId.a.position.y).toBe(300);
        expect(byId.m.position.y).toBe(500);
        expect(byId.e.position.y).toBe(700);
    });

    it('spreads siblings on the same depth horizontally', () => {
        const nodes: FlowNode[] = [
            { id: 't', type: 'trigger', position: { x: 0, y: 0 }, data: { triggerType: 'manual', label: 'Start', schedule: 'realtime', processingLimit: 'unlimited' } },
            { id: 'a1', type: 'action', position: { x: 0, y: 0 }, data: { actionType: 'send_email', title: 'A1', actor: 'Bot', object: 'Contact', description: '' } },
            { id: 'a2', type: 'action', position: { x: 0, y: 0 }, data: { actionType: 'webhook', title: 'A2', actor: 'Bot', object: 'Webhook', description: '' } },
        ];

        const edges: FlowEdge[] = [
            { id: 'e1', fromNodeId: 't', toNodeId: 'a1' },
            { id: 'e2', fromNodeId: 't', toNodeId: 'a2' },
        ];

        const result = autoLayoutFlow(nodes, edges, { startX: 1000, columnGap: 300 });
        const byId = Object.fromEntries(result.map((node) => [node.id, node]));

        expect(byId.a1.position.y).toBe(byId.a2.position.y);
        expect(byId.a1.position.x).not.toBe(byId.a2.position.x);
    });
});
