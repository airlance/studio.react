import { ChangeEvent, useCallback, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_ACTIONS, ACTION_TABS } from "@/constants/automation";
import { ActionOption } from "@/types/automation";

interface AddActionModalProps {
    onSelect: (action: ActionOption) => void;
    onClose: () => void;
}

export function AddActionModal({ onSelect, onClose }: AddActionModalProps) {
    const [tab, setTab] = useState("Workflow");
    const [q, setQ] = useState("");

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            onClose();
        }
    }, [onClose]);

    const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setQ(event.target.value);
    }, []);

    const actions = ALL_ACTIONS.filter(
        (a) => a.tabs.includes(tab) && (a.label.toLowerCase().includes(q.toLowerCase()) || a.desc.toLowerCase().includes(q.toLowerCase()))
    );
    // dedupe by id for suggested tab
    const seen = new Set();
    const deduped = actions.filter((a) => { if (seen.has(a.id)) return false; seen.add(a.id); return true; });
    return (
        <Dialog open onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0" showCloseButton={false}>
                <DialogHeader className="px-6 pt-5 pb-4 mb-0 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-4">
                        <DialogTitle>Add an action</DialogTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                    </div>
                </DialogHeader>

                <div className="px-6 pt-4">
                    <div className="relative mb-4">
                        <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search for an action"
                            value={q}
                            onChange={handleSearchChange}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex border-b border-slate-100">
                        {ACTION_TABS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-3.5 py-2 text-sm border-b-2 transition-colors ${tab === t ? "border-blue-500 text-blue-700 font-semibold" : "border-transparent text-slate-500"}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-3 max-h-[420px] overflow-y-auto">
                    {deduped.map((a) => {
                        const Icon = a.Icon;
                        return (
                            <button
                                key={a.id + a.tabs[0]}
                                onClick={() => onSelect(a)}
                                className="flex w-full items-center gap-4 py-3.5 border-b border-slate-50 text-left hover:bg-slate-50 transition-colors"
                            >
                                <div className="size-11 rounded-full flex items-center justify-center shrink-0" style={{ background: a.bg }}>
                                    <Icon size={20} color="#fff" />
                                </div>
                                <div>
                                    <p className="text-[15px] font-medium text-slate-800">{a.label}</p>
                                    <p className="text-sm text-slate-500 mt-0.5">{a.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
