import {
    ActionNodeData,
    AutomationStatus,
    FlowEdge,
    FlowNode,
    MatchNodeData,
    TriggerNodeData,
    WorkflowRuntimeSettings,
} from '@/types/automation';

export interface WorkflowGraphPreset {
    id: string;
    recipeId?: string;
    name: string;
    status: AutomationStatus;
    trigger: string;
    enrolled: number;
    completed: number;
    emailsSent: number;
    openRate: number;
    runtime: WorkflowRuntimeSettings;
    nodes: FlowNode[];
    edges: FlowEdge[];
}

function buildRuntime(): WorkflowRuntimeSettings {
    return {
        queueMode: 'sequential',
        retries: 3,
        retryBackoff: 'exponential',
        timeoutSeconds: 120,
        paused: false,
    };
}

export const WORKFLOW_GRAPH_PRESETS: WorkflowGraphPreset[] = [
    {
        id: '1',
        recipeId: 'welcome',
        name: 'Welcome Series',
        status: 'active',
        trigger: 'List signup',
        enrolled: 1240,
        completed: 820,
        emailsSent: 3200,
        openRate: 48.2,
        runtime: buildRuntime(),
        nodes: [
            {
                id: 'wf-trigger',
                type: 'trigger',
                position: { x: 1540, y: 120 },
                data: {
                    triggerType: 'list_signup',
                    label: 'Contact added to selected list',
                    schedule: 'realtime',
                    processingLimit: 'unlimited',
                } satisfies TriggerNodeData,
            },
            {
                id: 'wf-match',
                type: 'match',
                position: { x: 1540, y: 340 },
                data: {
                    title: 'Route by profile',
                    rules: [
                        { id: 'branch-qualified', label: 'Qualified lead', field: 'lead_score', operator: 'greater_than', value: '70' },
                        { id: 'branch-existing', label: 'Existing customer', field: 'lifecycle_stage', operator: 'equals', value: 'customer' },
                    ],
                    defaultLabel: 'Fallback',
                } satisfies MatchNodeData,
            },
            {
                id: 'wf-sequence',
                type: 'action',
                position: { x: 1200, y: 620 },
                data: {
                    actionType: 'send_email',
                    title: 'Send onboarding email',
                    actor: 'Marketing team',
                    object: 'Contact',
                    description: 'Welcome sequence #1',
                } satisfies ActionNodeData,
            },
            {
                id: 'wf-owner',
                type: 'action',
                position: { x: 1540, y: 620 },
                data: {
                    actionType: 'update_contact',
                    title: 'Assign account owner',
                    actor: 'Workflow bot',
                    object: 'Contact',
                    description: 'Set owner to inbound SDR',
                } satisfies ActionNodeData,
            },
            {
                id: 'wf-webhook',
                type: 'action',
                position: { x: 1880, y: 620 },
                data: {
                    actionType: 'webhook',
                    title: 'Send CRM webhook',
                    actor: 'Workflow bot',
                    object: 'Webhook',
                    description: 'POST /crm/prospect-created',
                } satisfies ActionNodeData,
            },
            {
                id: 'wf-end',
                type: 'end',
                position: { x: 1540, y: 860 },
                data: {},
            },
        ],
        edges: [
            { id: 'e-1', fromNodeId: 'wf-trigger', toNodeId: 'wf-match' },
            { id: 'e-2', fromNodeId: 'wf-match', toNodeId: 'wf-sequence', branchId: 'branch-qualified', label: 'Qualified lead' },
            { id: 'e-3', fromNodeId: 'wf-match', toNodeId: 'wf-owner', branchId: 'branch-existing', label: 'Existing customer' },
            { id: 'e-4', fromNodeId: 'wf-match', toNodeId: 'wf-webhook', branchId: 'default', label: 'Fallback' },
            { id: 'e-5', fromNodeId: 'wf-sequence', toNodeId: 'wf-end' },
            { id: 'e-6', fromNodeId: 'wf-owner', toNodeId: 'wf-end' },
            { id: 'e-7', fromNodeId: 'wf-webhook', toNodeId: 'wf-end' },
        ],
    },
    {
        id: '5',
        recipeId: 'abandoned-cart',
        name: 'Abandoned Cart',
        status: 'active',
        trigger: 'Tag: cart_abandoned',
        enrolled: 910,
        completed: 430,
        emailsSent: 2140,
        openRate: 45.0,
        runtime: buildRuntime(),
        nodes: [
            {
                id: 'ac-trigger',
                type: 'trigger',
                position: { x: 1540, y: 120 },
                data: {
                    triggerType: 'tag_added',
                    label: 'Tag cart_abandoned added',
                    schedule: 'realtime',
                    processingLimit: 'unlimited',
                } satisfies TriggerNodeData,
            },
            {
                id: 'ac-delay-1',
                type: 'delay',
                position: { x: 1540, y: 330 },
                data: { amount: 1, unit: 'hours' },
            },
            {
                id: 'ac-email-1',
                type: 'action',
                position: { x: 1540, y: 540 },
                data: {
                    actionType: 'send_email',
                    title: 'Send cart reminder #1',
                    actor: 'Lifecycle team',
                    object: 'Contact',
                    description: 'Remind about pending cart items',
                } satisfies ActionNodeData,
            },
            {
                id: 'ac-delay-2',
                type: 'delay',
                position: { x: 1540, y: 750 },
                data: { amount: 1, unit: 'days' },
            },
            {
                id: 'ac-match',
                type: 'match',
                position: { x: 1540, y: 960 },
                data: {
                    title: 'Order completed?',
                    rules: [
                        { id: 'branch-bought', label: 'Purchased', field: 'order_completed', operator: 'equals', value: 'true' },
                    ],
                    defaultLabel: 'Not purchased',
                } satisfies MatchNodeData,
            },
            {
                id: 'ac-end',
                type: 'end',
                position: { x: 1370, y: 1180 },
                data: {},
            },
            {
                id: 'ac-email-2',
                type: 'action',
                position: { x: 1710, y: 1180 },
                data: {
                    actionType: 'send_email',
                    title: 'Send final discount offer',
                    actor: 'Lifecycle team',
                    object: 'Contact',
                    description: 'Offer limited promo to recover cart',
                } satisfies ActionNodeData,
            },
        ],
        edges: [
            { id: 'ac-e1', fromNodeId: 'ac-trigger', toNodeId: 'ac-delay-1' },
            { id: 'ac-e2', fromNodeId: 'ac-delay-1', toNodeId: 'ac-email-1' },
            { id: 'ac-e3', fromNodeId: 'ac-email-1', toNodeId: 'ac-delay-2' },
            { id: 'ac-e4', fromNodeId: 'ac-delay-2', toNodeId: 'ac-match' },
            { id: 'ac-e5', fromNodeId: 'ac-match', toNodeId: 'ac-end', branchId: 'branch-bought', label: 'Purchased' },
            { id: 'ac-e6', fromNodeId: 'ac-match', toNodeId: 'ac-email-2', branchId: 'default', label: 'Not purchased' },
        ],
    },
    {
        id: '6',
        recipeId: 'lead-nurture',
        name: 'Lead Nurture',
        status: 'draft',
        trigger: 'Tag: lead',
        enrolled: 0,
        completed: 0,
        emailsSent: 0,
        openRate: 0,
        runtime: { ...buildRuntime(), paused: true },
        nodes: [
            {
                id: 'ln-trigger',
                type: 'trigger',
                position: { x: 1540, y: 120 },
                data: {
                    triggerType: 'tag_added',
                    label: 'Tag lead added',
                    schedule: 'realtime',
                    processingLimit: 'unlimited',
                } satisfies TriggerNodeData,
            },
            {
                id: 'ln-email',
                type: 'action',
                position: { x: 1540, y: 360 },
                data: {
                    actionType: 'send_email',
                    title: 'Send lead magnet',
                    actor: 'Growth team',
                    object: 'Contact',
                    description: 'Deliver first nurture email',
                } satisfies ActionNodeData,
            },
        ],
        edges: [{ id: 'ln-e1', fromNodeId: 'ln-trigger', toNodeId: 'ln-email' }],
    },
    {
        id: '2',
        recipeId: 'post-purchase',
        name: 'Post-purchase Follow-up',
        status: 'active',
        trigger: 'Tag: purchased',
        enrolled: 340,
        completed: 290,
        emailsSent: 680,
        openRate: 41.5,
        runtime: buildRuntime(),
        nodes: [
            {
                id: 'pp-trigger',
                type: 'trigger',
                position: { x: 1540, y: 120 },
                data: {
                    triggerType: 'tag_added',
                    label: 'Tag purchased is added',
                    schedule: 'realtime',
                    processingLimit: 'unlimited',
                } satisfies TriggerNodeData,
            },
            {
                id: 'pp-delay',
                type: 'delay',
                position: { x: 1540, y: 340 },
                data: { amount: 2, unit: 'days' },
            },
            {
                id: 'pp-mail',
                type: 'action',
                position: { x: 1540, y: 540 },
                data: {
                    actionType: 'send_email',
                    title: 'Send thank-you email',
                    actor: 'Lifecycle team',
                    object: 'Contact',
                    description: 'Request review and suggest related products',
                } satisfies ActionNodeData,
            },
            {
                id: 'pp-end',
                type: 'end',
                position: { x: 1540, y: 760 },
                data: {},
            },
        ],
        edges: [
            { id: 'pp-e1', fromNodeId: 'pp-trigger', toNodeId: 'pp-delay' },
            { id: 'pp-e2', fromNodeId: 'pp-delay', toNodeId: 'pp-mail' },
            { id: 'pp-e3', fromNodeId: 'pp-mail', toNodeId: 'pp-end' },
        ],
    },
    {
        id: '3',
        recipeId: 'winback',
        name: 'Win-back Campaign',
        status: 'paused',
        trigger: 'Inactive 90 days',
        enrolled: 2890,
        completed: 1200,
        emailsSent: 5800,
        openRate: 22.1,
        runtime: { ...buildRuntime(), paused: true },
        nodes: [
            {
                id: 'wb-trigger',
                type: 'trigger',
                position: { x: 1540, y: 120 },
                data: {
                    triggerType: 'manual',
                    label: 'No opens in 90 days',
                    schedule: 'daily',
                    processingLimit: '1000',
                } satisfies TriggerNodeData,
            },
            {
                id: 'wb-match',
                type: 'match',
                position: { x: 1540, y: 340 },
                data: {
                    title: 'Has recent purchase?',
                    rules: [
                        { id: 'branch-purchased', label: 'Purchased in 30d', field: 'last_purchase_days', operator: 'less_than', value: '30' },
                    ],
                    defaultLabel: 'No purchase',
                } satisfies MatchNodeData,
            },
            {
                id: 'wb-tag',
                type: 'action',
                position: { x: 1370, y: 560 },
                data: {
                    actionType: 'tag',
                    title: 'Tag as warm',
                    actor: 'Retention bot',
                    object: 'Contact',
                    description: 'Set warm segment tag',
                } satisfies ActionNodeData,
            },
            {
                id: 'wb-mail',
                type: 'action',
                position: { x: 1710, y: 560 },
                data: {
                    actionType: 'send_email',
                    title: 'Send win-back offer',
                    actor: 'Retention team',
                    object: 'Contact',
                    description: 'Limited-time comeback offer',
                } satisfies ActionNodeData,
            },
        ],
        edges: [
            { id: 'wb-e1', fromNodeId: 'wb-trigger', toNodeId: 'wb-match' },
            { id: 'wb-e2', fromNodeId: 'wb-match', toNodeId: 'wb-tag', branchId: 'branch-purchased', label: 'Purchased in 30d' },
            { id: 'wb-e3', fromNodeId: 'wb-match', toNodeId: 'wb-mail', branchId: 'default', label: 'No purchase' },
        ],
    },
    {
        id: '4',
        recipeId: 'birthday',
        name: 'Birthday Greetings',
        status: 'draft',
        trigger: 'Date field: birthday',
        enrolled: 0,
        completed: 0,
        emailsSent: 0,
        openRate: 0,
        runtime: { ...buildRuntime(), paused: true },
        nodes: [
            {
                id: 'bd-trigger',
                type: 'trigger',
                position: { x: 1540, y: 120 },
                data: {
                    triggerType: 'date_field',
                    label: 'Birthday is today',
                    schedule: 'daily',
                    processingLimit: '100',
                } satisfies TriggerNodeData,
            },
            {
                id: 'bd-mail',
                type: 'action',
                position: { x: 1540, y: 360 },
                data: {
                    actionType: 'send_email',
                    title: 'Send birthday email',
                    actor: 'Marketing team',
                    object: 'Contact',
                    description: 'Gift coupon + celebration copy',
                } satisfies ActionNodeData,
            },
        ],
        edges: [{ id: 'bd-e1', fromNodeId: 'bd-trigger', toNodeId: 'bd-mail' }],
    },
];

export function clonePresetFlow(preset: WorkflowGraphPreset): Pick<WorkflowGraphPreset, 'name' | 'status' | 'runtime' | 'nodes' | 'edges'> {
    return {
        name: preset.name,
        status: preset.status,
        runtime: { ...preset.runtime },
        nodes: preset.nodes.map((node) => ({
            ...node,
            position: { ...node.position },
            data: JSON.parse(JSON.stringify(node.data)) as FlowNode['data'],
        })),
        edges: preset.edges.map((edge) => ({ ...edge })),
    };
}

export function findPresetById(id: string | undefined): WorkflowGraphPreset | undefined {
    if (!id) {
        return undefined;
    }
    return WORKFLOW_GRAPH_PRESETS.find((preset) => preset.id === id);
}

export function findPresetByRecipe(recipeId: string | undefined): WorkflowGraphPreset | undefined {
    if (!recipeId) {
        return undefined;
    }
    return WORKFLOW_GRAPH_PRESETS.find((preset) => preset.recipeId === recipeId);
}
