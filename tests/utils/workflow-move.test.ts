import { describe, it, expect } from "vitest";
import { WorkflowNode } from "@/components/workflow-builder/types";
import { moveNode, createInitial, makeEnd, uid } from "@/components/workflow-builder/utils";

describe("workflow utils - moveNode", () => {
    it("moves a node from next slot to another next slot", () => {
        const node1 = { id: "n1", type: "wait" as const, next: makeEnd() };
        const node2 = { id: "n2", type: "wait" as const, next: makeEnd() };
        
        // Initial: root -> n1 -> n2 -> end
        const flow: WorkflowNode = {
            id: "root",
            type: "workflow",
            next: { ...node1, next: node2 }
        };

        // Move n2 to be AFTER root (n2 -> n1 -> end)
        const result = moveNode(flow, "n2", { afterId: "root" });
        
        expect(result.next?.id).toBe("n2");
        expect(result.next?.next?.id).toBe("n1");
    });

    it("moves a node into an If/Else branch", () => {
        const node1 = { id: "n1", type: "wait" as const, next: makeEnd() };
        const ifelse = { 
            id: "if1", 
            type: "ifelse" as const, 
            yes: { id: "end-y", type: "end" as const }, 
            no: { id: "end-n", type: "end" as const } 
        };
        
        // Initial: root -> n1 -> if1
        const flow: WorkflowNode = {
            id: "root",
            type: "workflow",
            next: { ...node1, next: ifelse }
        };

        // Move n1 into the 'yes' branch of if1
        const result = moveNode(flow, "n1", { ifelseId: "if1", branch: "yes" });

        // root -> if1 (yes -> n1 -> end-y, no -> end-n)
        expect(result.next?.id).toBe("if1");
        expect(result.next?.yes?.id).toBe("n1");
        expect(result.next?.yes?.next?.id).toBe("end-y");
    });

    it("prevents moving a node to itself", () => {
        const node1 = { id: "n1", type: "wait" as const, next: makeEnd() };
        const flow: WorkflowNode = {
            id: "root",
            type: "workflow",
            next: node1
        };

        const result = moveNode(flow, "n1", { afterId: "n1" });
        expect(result).toEqual(flow);
    });
});
