import { describe, expect, it } from "vitest";
import {
    createInitial,
    insertAfterNode,
    insertBranchStart,
    insertMatchBranchStart,
    reorderMatchBranches,
    moveNode,
    syncMatchBranches,
    deleteNode,
} from "../../src/utils/automation";
import { NodeConfig, WorkflowNode } from "../../src/types/automation";

const getFirstNonTriggerNode = (root: WorkflowNode): WorkflowNode => {
    if (!root.next) {
        throw new Error("Expected root.next to exist");
    }
    return root.next;
};

describe("automation utils - match node", () => {
    it("creates a match node with dynamic branches from config.cases", () => {
        const root = createInitial();
        const config: NodeConfig = {
            field: "Country",
            op: "Is",
            value: "RO",
            cases: ["Romania", "Ukraine", "Italy", "Spain"],
        };

        const updated = insertAfterNode(root, "root", "match", config);
        const matchNode = getFirstNonTriggerNode(updated);

        expect(matchNode.type).toBe("match");
        expect(matchNode.matchBranches).toHaveLength(4);
        expect(matchNode.matchBranches?.map((branch) => branch.label)).toEqual(["Romania", "Ukraine", "Italy", "Spain"]);
    });

    it("inserts an action at the start of a specific match branch", () => {
        const root = createInitial();
        const withMatch = insertAfterNode(root, "root", "match", { cases: ["A", "B", "C"] });
        const matchNode = getFirstNonTriggerNode(withMatch);

        if (!matchNode.matchBranches || matchNode.matchBranches.length < 2) {
            throw new Error("Expected at least two match branches");
        }

        const targetBranch = matchNode.matchBranches[1];
        const updated = insertMatchBranchStart(withMatch, matchNode.id, targetBranch.id, "send_email", { name: "Branch Email" });
        const updatedMatch = getFirstNonTriggerNode(updated);

        expect(updatedMatch.matchBranches?.[1].next?.type).toBe("send_email");
        expect(updatedMatch.matchBranches?.[1].next?.config?.name).toBe("Branch Email");
    });

    it("moves an existing node into a match branch drop target", () => {
        const root: WorkflowNode = {
            id: "root",
            type: "workflow",
            triggers: [
                {
                    id: "trigger-1",
                    type: "trigger",
                    config: { triggerId: "list_signup" },
                    next: {
                        id: "email-node",
                        type: "send_email",
                        config: { name: "Start email" },
                        next: { id: "email-end", type: "end" },
                    },
                },
            ],
            next: {
                id: "match-1",
                type: "match",
                config: { cases: ["One", "Two"] },
                matchBranches: [
                    { id: "branch-1", label: "One", next: { id: "branch-1-end", type: "end" } },
                    { id: "branch-2", label: "Two", next: { id: "branch-2-end", type: "end" } },
                ],
            },
        };

        const moved = moveNode(root, "email-node", {
            matchId: "match-1",
            matchBranchId: "branch-1",
        });

        if (!moved.next || moved.next.type !== "match" || !moved.next.matchBranches) {
            throw new Error("Expected updated match node");
        }

        expect(moved.next.matchBranches[0].next?.type).toBe("send_email");
        expect(moved.next.matchBranches[0].next?.config?.name).toBe("Start email");
    });

    it("does not delete an ifelse node when both branches contain non-empty subtrees", () => {
        const root = createInitial();
        const withIfElse = insertAfterNode(root, "root", "ifelse", { field: "Country", op: "Is", value: "RO" });
        const ifElseNode = getFirstNonTriggerNode(withIfElse);

        if (ifElseNode.type !== "ifelse") {
            throw new Error("Expected ifelse node");
        }

        const withYes = insertBranchStart(withIfElse, ifElseNode.id, "yes", "send_email", { name: "Yes branch email" });
        const withBoth = insertBranchStart(withYes, ifElseNode.id, "no", "wait", { amount: 1, unit: "days" });

        const result = deleteNode(withBoth, ifElseNode.id);
        if (!result || !result.next || result.next.type !== "ifelse") {
            throw new Error("Expected ifelse node to be preserved");
        }

        expect(result.next.yes?.type).toBe("send_email");
        expect(result.next.no?.type).toBe("wait");
    });

    it("reorders match branches while preserving branch data", () => {
        const root = createInitial();
        const withMatch = insertAfterNode(root, "root", "match", { cases: ["A", "B", "C"] });
        const matchNode = getFirstNonTriggerNode(withMatch);

        if (matchNode.type !== "match" || !matchNode.matchBranches) {
            throw new Error("Expected match node");
        }

        const [first, second, third] = matchNode.matchBranches;
        const reordered = reorderMatchBranches(withMatch, matchNode.id, first.id, third.id);
        const updatedMatch = getFirstNonTriggerNode(reordered);

        expect(updatedMatch.matchBranches?.map((branch) => branch.label)).toEqual(["B", "C", "A"]);
        expect(updatedMatch.matchBranches?.[2].id).toBe(first.id);
        expect(updatedMatch.matchBranches?.[0].id).toBe(second.id);
    });

    it("prevents moving a node into its own descendant target", () => {
        const root = createInitial();
        const withEmail = insertAfterNode(root, "root", "send_email", { name: "Email" });
        const emailId = withEmail.next?.id;
        if (!emailId) {
            throw new Error("Expected inserted email node");
        }

        const withWait = insertAfterNode(withEmail, emailId, "wait", { amount: 1, unit: "days" });
        const waitId = withWait.next?.next?.id;
        if (!waitId) {
            throw new Error("Expected inserted wait node");
        }

        const moved = moveNode(withWait, emailId, { afterId: waitId });
        expect(moved).toEqual(withWait);
    });

    it("syncs match branches when adding a new case and preserves existing branch ids", () => {
        const root = createInitial();
        const withMatch = insertAfterNode(root, "root", "match", { cases: ["A", "B"] });
        const matchNode = getFirstNonTriggerNode(withMatch);

        if (matchNode.type !== "match" || !matchNode.matchBranches) {
            throw new Error("Expected match node");
        }

        const [first, second] = matchNode.matchBranches;
        const synced = syncMatchBranches(matchNode.matchBranches, ["A", "B", "C"]);

        expect(synced).toHaveLength(3);
        expect(synced[0].id).toBe(first.id);
        expect(synced[1].id).toBe(second.id);
        expect(synced[0].label).toBe("A");
        expect(synced[1].label).toBe("B");
        expect(synced[2].label).toBe("C");
    });

    it("syncs match branches when removing cases and keeps existing branch next chains", () => {
        const root = createInitial();
        const withMatch = insertAfterNode(root, "root", "match", { cases: ["A", "B", "C"] });
        const matchNode = getFirstNonTriggerNode(withMatch);

        if (matchNode.type !== "match" || !matchNode.matchBranches) {
            throw new Error("Expected match node");
        }

        const branchWithAction = matchNode.matchBranches[1];
        branchWithAction.next = {
            id: "custom-action",
            type: "send_email",
            config: { name: "Existing chain" },
            next: { id: "custom-end", type: "end" },
        };

        const synced = syncMatchBranches(matchNode.matchBranches, ["First", "Second"]);

        expect(synced).toHaveLength(2);
        expect(synced[0].label).toBe("First");
        expect(synced[1].label).toBe("Second");
        expect(synced[1].next?.id).toBe("custom-action");
        expect(synced[1].next?.type).toBe("send_email");
    });
});
