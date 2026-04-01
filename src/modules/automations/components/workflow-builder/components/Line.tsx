export function Line({ h = 28 }: { h?: number }) {
    return <div className="w-0.5 bg-slate-300 shrink-0 self-center" style={{ height: h }} />;
}
