import { Clock } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { WorkflowNode } from "@/types/automation";
import { NodeCardMenu } from "../components/NodeCardMenu.tsx";

export function WaitCard({ node, onDelete, onClick }: { node: WorkflowNode; onDelete: () => void; onClick: () => void }) {
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
            <div className="flex items-center gap-3 px-5 py-4">
                <div className="size-10 rounded-full bg-[#0f2544] flex items-center justify-center shrink-0">
                    <Clock size={18} color="#fff" />
                </div>
                <div className="text-sm font-medium text-slate-800">
                    Wait for{" "}
                    <span className="bg-sky-100 text-sky-700 rounded px-2 py-0.5 text-[13px] font-semibold">
                        {node.config?.amount} {node.config?.unit}
                    </span>
                </div>
            </div>
        </div>
    );
}
