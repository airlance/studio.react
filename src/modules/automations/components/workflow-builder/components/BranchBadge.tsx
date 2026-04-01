interface BranchBadgeProps {
    label: string;
    color: string;
    variant?: "circle" | "rectangle";
}

export function BranchBadge({ label, color, variant = "circle" }: BranchBadgeProps) {
    if (variant === "rectangle") {
        return (
            <div
                className="min-w-[140px] h-[52px] rounded-xl bg-white border-2 flex items-center justify-center px-4 text-sm font-bold shrink-0 leading-[1.2] text-center shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
                style={{ borderColor: color, color }}
            >
                {label}
            </div>
        );
    }

    return (
        <div
            className="size-10 rounded-full bg-white border-2 flex items-center justify-center text-[13px] font-bold shrink-0"
            style={{ borderColor: color, color }}
        >
            {label}
        </div>
    );
}
