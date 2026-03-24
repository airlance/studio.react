import { useState } from "react";
import { Plus } from "lucide-react";

export function AddBtn({ onClick, active }: { onClick: () => void; active?: boolean }) {
    const [hov, setHov] = useState(false);
    return (
        <button
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
