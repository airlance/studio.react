import { Plus } from "lucide-react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { DropTarget } from "@/utils/automation";

interface AddBtnProps {
    id: UniqueIdentifier;
    onClick: () => void;
    active?: boolean;
    data?: DropTarget;
}

export function AddBtn({ id, onClick, active, data }: AddBtnProps) {
    const { isOver, setNodeRef } = useDroppable({ id, data });
    const { active: activeDrag } = useDndContext();

    if (activeDrag) {
        return (
            <div
                ref={setNodeRef}
                className={`w-[300px] h-12 rounded-lg flex items-center justify-center text-xs font-medium my-2 border-2 border-dashed text-blue-500 transition-colors ${
                    isOver ? "border-blue-500 bg-blue-500/10" : "border-blue-500 bg-blue-500/5"
                }`}
            >
                {isOver ? "Drop here" : "Move here"}
            </div>
        );
    }

    return (
        <div className="h-8 flex items-center justify-center transition-[height] duration-200 overflow-hidden">
            <button
                ref={setNodeRef}
                onClick={onClick}
                className={`size-6 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                    active
                        ? "border-blue-500 bg-blue-500 text-white shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                        : "border-slate-200 bg-white text-slate-400 hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                }`}
            >
                <Plus size={12} />
            </button>
        </div>
    );
}
