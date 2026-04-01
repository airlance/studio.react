export function EndNode() {
    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1.5 shadow-sm">
                <div className="size-2 rounded-full bg-slate-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    End
                </span>
            </div>
        </div>
    );
}