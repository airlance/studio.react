import { ChangeEvent, useCallback, useState } from "react";
import { Search } from "lucide-react";
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TRIGGERS, TRIGGER_CATS } from "@/constants/automation";
import { TriggerOption } from "@/types/automation";

interface SelectTriggerModalProps {
    onSelect: (trigger: TriggerOption) => void;
    onClose: () => void;
}

export function SelectTriggerModal({ onSelect, onClose }: SelectTriggerModalProps) {
    const [cat, setCat] = useState("View All");
    const [q, setQ] = useState("");

    const handleSheetOpenChange = useCallback((open: boolean) => {
        if (!open) {
            onClose();
        }
    }, [onClose]);

    const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setQ(event.target.value);
    }, []);

    const filtered = TRIGGERS.filter(
        (t) => (cat === "View All" || t.cat === cat) && t.label.toLowerCase().includes(q.toLowerCase())
    );

    return (
        <Sheet open onOpenChange={handleSheetOpenChange}>
            <SheetContent side="right" className="w-[860px] sm:max-w-[860px] p-0 gap-0">
                <SheetHeader className="px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <SheetTitle className="flex-1 text-lg">Select a Trigger</SheetTitle>
                        <div className="relative w-[220px]">
                            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search triggers"
                                value={q}
                                onChange={handleSearchChange}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </SheetHeader>

                <SheetBody className="p-0 grow">
                    <div className="flex h-full min-h-[560px]">
                        <div className="w-[180px] border-r border-slate-100 py-4 shrink-0">
                        <p className="text-[11px] font-semibold text-slate-400 px-4 pb-2 tracking-wider">TRIGGER CATEGORIES</p>
                        {TRIGGER_CATS.map((c) => (
                            <button
                                key={c}
                                onClick={() => setCat(c)}
                                className={`block w-full text-left px-4 py-2 text-sm border-l-[3px] ${cat === c ? "bg-sky-50 border-blue-500 text-blue-700" : "border-transparent text-slate-700"}`}
                            >
                                {c}
                            </button>
                        ))}
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <div className="grid grid-cols-3 gap-4 content-start">
                                {filtered.map((t) => {
                                    const Icon = t.Icon;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => onSelect(t)}
                                            className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-500 hover:bg-sky-50 transition-colors text-xs text-slate-700 text-center leading-snug"
                                        >
                                            <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Icon size={20} color="#1d4ed8" />
                                            </div>
                                            {t.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </SheetBody>

                <SheetFooter className="border-t border-slate-100 px-6 py-4 flex-row justify-end">
                    <Button onClick={onClose}>Start without a trigger</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
