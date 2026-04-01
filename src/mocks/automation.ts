import { WorkflowNode } from "@/types/automation";
import { uid, makeEnd } from "@/utils/automation";

export const WORKFLOW_RECIPES: Record<string, WorkflowNode> = {
    "welcome": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "list_signup" } }
        ],
        next: {
            id: uid(),
            type: "send_email",
            config: { name: "Welcome Email", subject: "Welcome to our newsletter!" },
            next: {
                id: uid(),
                type: "wait",
                config: { amount: 1, unit: "days" },
                next: {
                    id: uid(),
                    type: "send_email",
                    config: { name: "Second Email", subject: "Here is your first tip" },
                    next: makeEnd()
                }
            }
        }
    },
    "abandoned-cart": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "tag_added" } }
        ],
        next: {
            id: uid(),
            type: "wait",
            config: { amount: 1, unit: "hours" },
            next: {
                id: uid(),
                type: "send_email",
                config: { name: "Cart Reminder", subject: "Did you forget something?" },
                next: {
                    id: uid(),
                    type: "ifelse",
                    config: { name: "Check Purchase", field: "order_completed", op: "equals", value: "true" },
                    yes: makeEnd(),
                    no: {
                        id: uid(),
                        type: "wait",
                        config: { amount: 1, unit: "days" },
                        next: {
                            id: uid(),
                            type: "send_email",
                            config: { name: "Final Offer", subject: "Come back and get 10% off" },
                            next: makeEnd()
                        }
                    }
                }
            }
        }
    },
    "re-engagement": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "reads_email" } }
        ],
        next: {
            id: uid(),
            type: "wait",
            config: { amount: 3, unit: "days" },
            next: {
                id: uid(),
                type: "ifelse",
                config: { field: "Last Name", op: "Is not empty", value: "" },
                yes: {
                    id: uid(),
                    type: "send_email",
                    config: { name: "Re-Engagement Personal", subject: "We picked this just for you" },
                    next: makeEnd()
                },
                no: {
                    id: uid(),
                    type: "send_email",
                    config: { name: "Re-Engagement Generic", subject: "We miss you — here is what is new" },
                    next: makeEnd()
                }
            }
        }
    },
    "lead-nurture-match": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "submits_form" } }
        ],
        next: {
            id: uid(),
            type: "match",
            config: {
                field: "Country",
                op: "Is",
                value: "dynamic",
                cases: ["Romania", "Italy", "Other"]
            },
            matchBranches: [
                {
                    id: uid(),
                    label: "Romania",
                    next: {
                        id: uid(),
                        type: "send_email",
                        config: { name: "RO Welcome", subject: "Bine ai venit!" },
                        next: makeEnd()
                    }
                },
                {
                    id: uid(),
                    label: "Italy",
                    next: {
                        id: uid(),
                        type: "send_email",
                        config: { name: "IT Welcome", subject: "Benvenuto!" },
                        next: makeEnd()
                    }
                },
                {
                    id: uid(),
                    label: "Other",
                    next: {
                        id: uid(),
                        type: "send_email",
                        config: { name: "Global Welcome", subject: "Welcome to our community" },
                        next: makeEnd()
                    }
                }
            ]
        }
    },
    "vip-routing": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "tag_added", tag: "vip" } }
        ],
        next: {
            id: uid(),
            type: "notify",
            config: { name: "Notify Sales Team" },
            next: {
                id: uid(),
                type: "add_tag",
                config: { tag: "priority-support" },
                next: {
                    id: uid(),
                    type: "webhook",
                    config: { url: "https://example.com/hooks/vip-contact" },
                    next: makeEnd()
                }
            }
        }
    },
    "webinar-reminder": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "event" } }
        ],
        next: {
            id: uid(),
            type: "wait",
            config: { amount: 1, unit: "days" },
            next: {
                id: uid(),
                type: "send_email",
                config: { name: "Webinar Reminder 24h", subject: "Your webinar starts tomorrow" },
                next: {
                    id: uid(),
                    type: "wait",
                    config: { amount: 2, unit: "hours" },
                    next: {
                        id: uid(),
                        type: "send_email",
                        config: { name: "Webinar Reminder 2h", subject: "We start in 2 hours" },
                        next: makeEnd()
                    }
                }
            }
        }
    },
    "post-purchase-followup": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "event" } }
        ],
        next: {
            id: uid(),
            type: "ifelse",
            config: { field: "Country", op: "Is", value: "Romania" },
            yes: {
                id: uid(),
                type: "match",
                config: { field: "Tag", op: "Contains", value: "customer", cases: ["VIP", "Standard"] },
                matchBranches: [
                    {
                        id: uid(),
                        label: "VIP",
                        next: {
                            id: uid(),
                            type: "send_email",
                            config: { name: "VIP Thank You", subject: "Thank you for your premium order" },
                            next: makeEnd()
                        }
                    },
                    {
                        id: uid(),
                        label: "Standard",
                        next: {
                            id: uid(),
                            type: "send_email",
                            config: { name: "Thank You", subject: "Thanks for your purchase" },
                            next: makeEnd()
                        }
                    }
                ]
            },
            no: {
                id: uid(),
                type: "webhook",
                config: { url: "https://example.com/hooks/post-purchase" },
                next: makeEnd()
            }
        }
    },
    "multi-trigger-escalation": {
        id: "root",
        type: "workflow",
        triggers: [
            { id: uid(), type: "trigger", config: { triggerId: "subscribes", runs: "Many times" } },
            { id: uid(), type: "trigger", config: { triggerId: "clicks_link", runs: "Once" } },
            { id: uid(), type: "trigger", config: { triggerId: "webpage_visit", runs: "Many times" } }
        ],
        next: {
            id: uid(),
            type: "match",
            config: {
                field: "Tag",
                op: "Contains",
                value: "segment",
                cases: ["Enterprise", "SMB", "Trial", "Other"]
            },
            matchBranches: [
                {
                    id: uid(),
                    label: "Enterprise",
                    next: {
                        id: uid(),
                        type: "notify",
                        config: { name: "Alert Enterprise CSM" },
                        next: {
                            id: uid(),
                            type: "send_email",
                            config: { name: "Enterprise Follow-up", subject: "Let’s plan your onboarding" },
                            next: makeEnd()
                        }
                    }
                },
                {
                    id: uid(),
                    label: "SMB",
                    next: {
                        id: uid(),
                        type: "wait",
                        config: { amount: 6, unit: "hours" },
                        next: {
                            id: uid(),
                            type: "send_email",
                            config: { name: "SMB Nurture", subject: "Get more from your account" },
                            next: makeEnd()
                        }
                    }
                },
                {
                    id: uid(),
                    label: "Trial",
                    next: {
                        id: uid(),
                        type: "ifelse",
                        config: { field: "Email Address", op: "Contains", value: "@company.com" },
                        yes: {
                            id: uid(),
                            type: "add_tag",
                            config: { tag: "trial-business" },
                            next: makeEnd()
                        },
                        no: {
                            id: uid(),
                            type: "webhook",
                            config: { url: "https://example.com/hooks/trial-lead" },
                            next: makeEnd()
                        }
                    }
                },
                {
                    id: uid(),
                    label: "Other",
                    next: {
                        id: uid(),
                        type: "send_email",
                        config: { name: "General Onboarding", subject: "Welcome — here’s where to start" },
                        next: makeEnd()
                    }
                }
            ]
        }
    }
};
