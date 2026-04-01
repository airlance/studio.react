import { ChangeEvent, useCallback, useState } from "react";
import { GitBranch, ChevronLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COND_FIELDS, COND_OPS } from "@/constants/automation";
import { NodeConfig } from "@/types/automation";

interface ConfigureIfElseModalProps {
    config?: NodeConfig;
    onSave: (config: NodeConfig) => void;
    onBack: () => void;
    onClose: () => void;
}

export function ConfigureIfElseModal({ config, onSave, onBack, onClose }: ConfigureIfElseModalProps) {
    const [field, setField] = useState(config?.field || "Email Address");
    const [op, setOp] = useState(config?.op || "Is");
    const [value, setValue] = useState(config?.value || "");

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            onClose();
        }
    }, [onClose]);

    const handleFieldChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setField(event.target.value);
    }, []);

    const handleOpChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setOp(event.target.value);
    }, []);

    const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    const handleSave = useCallback(() => {
        onSave({ field, op, value });
    }, [field, onSave, op, value]);

    return (
        <Dialog open onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[680px] p-0 gap-0" showCloseButton={false}>
                <DialogHeader className="border-b border-slate-100 px-6 py-5 mb-0">
                    <div className="flex items-start gap-3">
                        {!config && (
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-500 hover:text-blue-600" onClick={onBack}>
                                <ChevronLeft className="size-4" />
                                Back
                            </Button>
                        )}
                        <div className="flex-1 flex items-center gap-2.5">
                            <div className="size-10 rounded-full bg-slate-700 flex items-center justify-center">
                                <GitBranch size={18} color="#fff" />
                            </div>
                            <div>
                                <DialogTitle>{config ? "Edit conditions" : "Does contact match these conditions?"}</DialogTitle>
                                <DialogDescription className="mt-1">Split the automation based on conditions</DialogDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                    </div>
                </DialogHeader>

                <div className="px-6 py-6">
                    <div className="flex justify-end mb-3">
                        <button className="text-sm text-red-500">Clear all conditions</button>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-4 mb-4">
                        <div className="flex gap-2 items-center">
                            <select value={field} onChange={handleFieldChange} className="flex-[2] px-3 py-2.5 border border-slate-200 rounded-md text-sm">
                                {COND_FIELDS.map((currentField) => <option key={currentField}>{currentField}</option>)}
                            </select>
                            <select value={op} onChange={handleOpChange} className="flex-1 px-3 py-2.5 border border-slate-200 rounded-md text-sm">
                                {COND_OPS.map((currentOp) => <option key={currentOp}>{currentOp}</option>)}
                            </select>
                            <Input
                                placeholder="Enter value..."
                                value={value}
                                onChange={handleValueChange}
                                className="flex-[2] border-blue-500"
                            />
                        </div>
                        <button className="text-sm text-blue-500 mt-2">+ Add another condition</button>
                    </div>
                    <Button variant="ghost" className="bg-slate-100 text-slate-700 hover:bg-slate-200 mb-5">Add condition group</Button>
                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-sm font-medium text-slate-700 mb-2.5">Select a segment to use its conditions</p>
                        <div className="border border-slate-200 rounded-lg px-4 py-3 flex items-center gap-2 text-slate-700">
                            <ArrowRight size={16} color="#94a3b8" />
                            <span className="text-sm">Saved Segments</span>
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
