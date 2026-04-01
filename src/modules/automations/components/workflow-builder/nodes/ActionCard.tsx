import { Zap, LucideIcon } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { WorkflowNode } from "@/types/automation";
import { NodeCardMenu } from "../components/NodeCardMenu.tsx";

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
        >
            {!isDragging && <NodeCardMenu onEdit={onClick} onDelete={onDelete} />}
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
