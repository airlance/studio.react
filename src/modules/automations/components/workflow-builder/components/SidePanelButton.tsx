export function SidePanelButton({ label, onClick }: { label: string; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="bg-transparent border-2 border-dashed border-slate-400 hover:border-blue-500 rounded-lg px-5 py-3 cursor-pointer text-slate-500 hover:text-blue-500 text-sm font-medium transition-all whitespace-nowrap"
        >
            {label}
        </button>
    );
}
