import { describe, expect, it } from "vitest";
import {
    createInitial,
    insertAfterNode,
    insertMatchBranchStart,
    reorderMatchBranches,
    moveNode,
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
        const root = createInitial();
        const withEmail = insertAfterNode(root, "root", "send_email", { name: "Start email" });
        const emailId = withEmail.next?.id;
        if (!emailId) {
            throw new Error("Expected inserted email node id");
        }

        const withMatch = insertAfterNode(withEmail, emailId, "match", { cases: ["One", "Two"] });
        const matchNode = withMatch.next?.next;

        if (!matchNode || matchNode.type !== "match" || !matchNode.matchBranches || matchNode.matchBranches.length === 0) {
            throw new Error("Expected a match node with branches");
        }

        const moved = moveNode(withMatch, emailId, {
            matchId: matchNode.id,
            matchBranchId: matchNode.matchBranches[0].id,
        });

        const updatedMatchNode = moved.next;
        if (!updatedMatchNode || updatedMatchNode.type !== "match" || !updatedMatchNode.matchBranches) {
            throw new Error("Expected updated match node");
        }

        expect(updatedMatchNode.matchBranches[0].next?.type).toBe("send_email");
        expect(updatedMatchNode.matchBranches[0].next?.config?.name).toBe("Start email");
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
});
