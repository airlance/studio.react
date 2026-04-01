import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useDndContext } from "@dnd-kit/core";
import { BranchBadge } from "./BranchBadge.tsx";

interface SortableMatchBranchBadgeProps {
    branchId: string;
    matchId: string;
    label: string;
}

export function SortableMatchBranchBadge({ branchId, matchId, label }: SortableMatchBranchBadgeProps) {
    const { active } = useDndContext();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
        id: branchId,
        data: {
            dragType: "match-branch",
            branchId,
            matchId,
        },
    });
    const activeData = active?.data.current as { dragType?: string; matchId?: string; branchId?: string } | undefined;
    const isMatchBranchDrag = activeData?.dragType === "match-branch";
    const isSameMatchDrag = isMatchBranchDrag && activeData?.matchId === matchId;
    const isSelf = activeData?.branchId === branchId;
    const isValidTarget = isSameMatchDrag && !isSelf;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.65 : 1,
        zIndex: isDragging ? 20 : 1,
    };

    const targetClass = isValidTarget
        ? (isOver ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent" : "ring-2 ring-blue-300/70 ring-offset-2 ring-offset-transparent")
        : "";

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`cursor-grab active:cursor-grabbing touch-none rounded-xl transition-all ${targetClass}`}
        >
            <div {...attributes} {...listeners}>
                <BranchBadge label={label} color="#4f46e5" variant="rectangle" />
            </div>
        </div>
    );
}
