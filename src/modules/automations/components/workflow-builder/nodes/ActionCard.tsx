import { useState } from "react";
import { Trash2, Zap, LucideIcon } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { WorkflowNode } from "@/types/automation";

interface ActionCardProps {
    node: WorkflowNode;
    onDelete: () => void;
    onClick: () => void;
    icon?: LucideIcon;
    bg: string;
    label: string;
    sub: string;
}

export function ActionCard({ node, onDelete, onClick, icon: Icon = Zap, bg, label, sub }: ActionCardProps) {
    const [hov, setHov] = useState(false);
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: node.id,
        data: { node },
    });

    const dragStyle = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 1,
    };

    return (
        <div 
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={onClick} 
            style={dragStyle}
            className="relative bg-white border border-slate-200 rounded-lg min-w-[260px] max-w-[300px] shadow-[0_1px_3px_rgba(0,0,0,0.07)] cursor-grab"
            onMouseEnter={() => setHov(true)} 
            onMouseLeave={() => setHov(false)}
        >
            {hov && !isDragging && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="absolute top-2 right-2 bg-white border border-slate-200 rounded-full size-6 flex items-center justify-center cursor-pointer text-red-500 shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                >
                    <Trash2 size={12} />
                </button>
            )}
            <div className="flex items-start gap-3 px-5 py-4">
                <div className="size-10 rounded-full flex items-center justify-center shrink-0" style={{ background: bg }}>
                    <Icon size={18} color="#fff" />
                </div>
                <div>
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="text-sm font-semibold text-slate-800 leading-[1.4]">{sub}</div>
                </div>
            </div>
        </div>
    );
}
