import { useState } from "react";
import { Plus } from "lucide-react";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { STYLES } from "../constants";

interface AddBtnProps {
    id: string;
    onClick: () => void;
    active?: boolean;
    data?: any;
}

export function AddBtn({ id, onClick, active, data }: AddBtnProps) {
    const [hov, setHov] = useState(false);
    const { isOver, setNodeRef } = useDroppable({ id, data });
    const { active: activeDrag } = useDndContext();

    if (activeDrag) {
        return (
            <div
                ref={setNodeRef}
                style={{
                    ...STYLES.dropZone,
                    borderColor: isOver ? "#3b82f6" : "#cbd5e1",
                    background: isOver ? "rgba(59, 130, 246, 0.1)" : "rgba(241, 245, 249, 0.5)",
                    color: isOver ? "#3b82f6" : "#64748b",
                    fontSize: 12,
                    fontWeight: 500,
                }}
            >
                {isOver ? "Drop here" : "Move here"}
            </div>
        );
    }

    return (
        <button
            ref={setNodeRef}
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: 30, height: 30, borderRadius: "50%",
                border: `2px solid ${hov || active ? "#3b82f6" : "#b0bec5"}`,
                background: hov || active ? "#3b82f6" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: hov || active ? "#fff" : "#607d8b",
                transition: "all 0.15s", flexShrink: 0,
            }}
        >
            <Plus size={14} />
        </button>
    );
}
