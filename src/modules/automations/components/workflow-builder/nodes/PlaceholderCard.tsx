export function PlaceholderCard({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="bg-transparent border-2 border-dashed border-slate-400 hover:border-blue-500 rounded-lg px-6 py-3.5 cursor-pointer text-slate-500 hover:text-blue-500 text-sm font-medium flex items-center gap-2 transition-all"
        >
            Add a start trigger
        </button>
    );
}
