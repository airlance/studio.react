import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { ChevronLeft, Split } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COND_FIELDS, COND_OPS } from "@/constants/automation";
import { MatchBranch, NodeConfig } from "@/types/automation";

interface ConfigureMatchModalProps {
    config?: NodeConfig;
    branches?: MatchBranch[];
    onSave: (config: NodeConfig) => void;
    onBack: () => void;
    onClose: () => void;
}

const DEFAULT_CASES = ["Match 1", "Match 2", "Match 3"];

export function ConfigureMatchModal({ config, branches, onSave, onBack, onClose }: ConfigureMatchModalProps) {
    const initialCases = useMemo(() => {
        if (Array.isArray(config?.cases) && config.cases.length > 0) {
            return config.cases;
        }
        if (branches && branches.length > 0) {
            return branches.map((branch) => branch.label);
        }
        return DEFAULT_CASES;
    }, [branches, config?.cases]);

    const [field, setField] = useState(config?.field || "Email Address");
    const [op, setOp] = useState(config?.op || "Is");
    const [value, setValue] = useState(config?.value || "");
    const [cases, setCases] = useState<string[]>(initialCases);

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            onClose();
        }
    }, [onClose]);

    const handleSave = useCallback(() => {
        const normalisedCases = cases
            .map((currentCase) => currentCase.trim())
            .filter((currentCase) => currentCase.length > 0);

        onSave({
            field,
            op,
            value,
            cases: normalisedCases.length > 0 ? normalisedCases : DEFAULT_CASES,
        });
    }, [cases, field, onSave, op, value]);

    const handleCaseChange = useCallback((index: number, event: ChangeEvent<HTMLInputElement>) => {
        setCases((prev) => prev.map((item, currentIndex) => (currentIndex === index ? event.target.value : item)));
    }, []);

    const handleRemoveCase = useCallback((index: number) => {
        setCases((prev) => (prev.length > 2 ? prev.filter((_, currentIndex) => currentIndex !== index) : prev));
    }, []);

    const handleAddCase = useCallback(() => {
        setCases((prev) => [...prev, `Match ${prev.length + 1}`]);
    }, []);

    return (
        <Dialog open onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[720px] p-0 gap-0" showCloseButton={false}>
                <DialogHeader className="border-b border-slate-100 px-6 py-5 mb-0">
                    <div className="flex items-start gap-3">
                        {!config && (
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-500 hover:text-blue-600" onClick={onBack}>
                                <ChevronLeft className="size-4" />
                                Back
                            </Button>
                        )}
                        <div className="flex-1 flex items-center gap-2.5">
                            <div className="size-10 rounded-full bg-indigo-600 flex items-center justify-center">
                                <Split size={18} color="#fff" />
                            </div>
                            <div>
                                <DialogTitle>{config ? "Edit match" : "Split by match"}</DialogTitle>
                                <DialogDescription className="mt-1">Route contacts across any number of branches</DialogDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                    </div>
                </DialogHeader>

                <div className="px-6 py-6 space-y-4">
                    <div className="grid grid-cols-[2fr_1fr_2fr] gap-2 items-center">
                        <select value={field} onChange={(event) => setField(event.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-md text-sm">
                            {COND_FIELDS.map((currentField) => <option key={currentField}>{currentField}</option>)}
                        </select>
                        <select value={op} onChange={(event) => setOp(event.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-md text-sm">
                            {COND_OPS.map((currentOp) => <option key={currentOp}>{currentOp}</option>)}
                        </select>
                        <Input
                            placeholder="Enter value..."
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                        />
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-slate-800">Branches</p>
                            <Button variant="ghost" size="sm" onClick={handleAddCase}>Add branch</Button>
                        </div>
                        <div className="space-y-2">
                            {cases.map((currentCase, index) => (
                                <div key={`${index}-${currentCase}`} className="flex items-center gap-2">
                                    <Input value={currentCase} onChange={(event) => handleCaseChange(index, event)} />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-500 hover:text-slate-700"
                                        onClick={() => handleRemoveCase(index)}
                                        disabled={cases.length <= 2}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-2.5">
                    <Button variant="ghost" className="bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>{config ? "Save Changes" : "Save"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
