import { useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import { WorkflowNode } from "../types";
import { STYLES } from "../constants";

export function WaitCard({ node, onDelete, onClick }: { node: WorkflowNode; onDelete: () => void; onClick: () => void }) {
    const [hov, setHov] = useState(false);
    return (
        <div onClick={onClick} style={{ ...STYLES.card, position: "relative", cursor: "pointer" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {hov && (
                <div style={{ position: "absolute", top: -32, right: 0, display: "flex", gap: 4, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px" }}>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0f2544", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Clock size={16} color="#fff" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#1e293b" }}>
                    Wait for{" "}
                    <span style={{ background: "#e0f2fe", color: "#0369a1", borderRadius: 4, padding: "2px 8px", fontSize: 13, fontWeight: 600 }}>
                        {node.config?.amount} {node.config?.unit}
                    </span>
                </div>
            </div>
        </div>
    );
}
