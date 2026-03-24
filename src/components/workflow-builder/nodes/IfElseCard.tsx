import { useState } from "react";
import { GitBranch, Trash2 } from "lucide-react";
import { WorkflowNode } from "../types";
import { STYLES } from "../constants";

export function IfElseCard({ node, onDelete, onClick }: { node: WorkflowNode; onDelete: () => void; onClick: () => void }) {
    const [hov, setHov] = useState(false);
    const c = node.config || {};
    return (
        <div onClick={onClick} style={{ ...STYLES.card, position: "relative", cursor: "pointer" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {hov && (
                <div style={{ position: "absolute", top: -32, right: 0, display: "flex", gap: 4, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px" }}>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#374151", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <GitBranch size={16} color="#fff" />
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>Does contact match these conditions?</div>
                    {c.field && (
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                            {c.field} {c.op?.toLowerCase()} {c.value}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
