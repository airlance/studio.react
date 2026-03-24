import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { WorkflowNode } from "../types";
import { TRIGGERS, TRIGGER_LABEL, STYLES } from "../constants";

export function TriggerCard({ node, onDelete, onClick }: { node: WorkflowNode; onDelete: () => void; onClick: () => void }) {
    const [hov, setHov] = useState(false);
    const triggerConfigId = node.config?.triggerId;
    const t = TRIGGERS.find((t) => t.id === triggerConfigId);
    const Icon = t?.Icon || Eye;
    
    return (
        <div
            onClick={onClick}
            style={{ ...STYLES.card, position: "relative", cursor: "pointer" }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            {hov && (
                <div style={{ position: "absolute", top: -32, right: 0, display: "flex", gap: 4, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px" }}>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color="#fff" />
                </div>
                <div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>Start automation when</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
                        {triggerConfigId ? TRIGGER_LABEL[triggerConfigId] : "Unknown trigger"}
                    </div>
                </div>
            </div>
        </div>
    );
}
