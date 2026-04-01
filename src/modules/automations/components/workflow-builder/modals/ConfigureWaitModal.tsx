import { ChangeEvent, useCallback, useState } from "react";
import { Clock, ChevronLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WAIT_UNITS } from "@/constants/automation";
import { NodeConfig } from "@/types/automation";

interface ConfigureWaitModalProps {
    config?: NodeConfig;
    onSave: (config: NodeConfig) => void;
    onBack: () => void;
    onClose: () => void;
}

export function ConfigureWaitModal({ config, onSave, onBack, onClose }: ConfigureWaitModalProps) {
    const [step, setStep] = useState(config ? "amount" : "type");
    const [amount, setAmount] = useState(config?.amount || 1);
    const [unit, setUnit] = useState(config?.unit || "day(s)");

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            onClose();
        }
    }, [onClose]);

    const handleAmountChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(event.target.value));
    }, []);

    const handleUnitChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setUnit(event.target.value);
    }, []);

    const handleSave = useCallback(() => {
        onSave({ amount, unit });
    }, [amount, onSave, unit]);

    if (step === "type") {
        const opts = [
            { id: "period", label: "A set period of time", sub: "e.g. 2 weeks, 1 day, 6 hours, 1 hour and 30 minutes" },
            { id: "date", label: "Until a specific day and/or time", sub: "e.g. November 24th at 8:00 AM" },
            { id: "datefield", label: "Until a custom date field matches", sub: 'e.g. Until 3 days before "Webinar date"' },
            { id: "conditions", label: "Until specific conditions are met", sub: "Build a custom segment with any of your fields" },
        ];
        return (
            <Dialog open onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[600px] p-0 gap-0" showCloseButton={false}>
                    <DialogHeader className="border-b border-slate-100 px-6 py-5 mb-0">
                        <div className="flex items-start gap-3">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-500 hover:text-blue-600" onClick={onBack}>
                                <ChevronLeft className="size-4" />
                                Back
                            </Button>
                            <div className="flex-1 flex items-center gap-2.5">
                                <div className="size-10 rounded-full bg-slate-900 flex items-center justify-center">
                                    <Clock size={18} color="#fff" />
                                </div>
                                <div>
                                    <DialogTitle>Add a Wait Condition</DialogTitle>
                                    <DialogDescription className="mt-1">Wait for a period of time, a specific date, or for conditions</DialogDescription>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                        </div>
                    </DialogHeader>
                    <div className="px-6 py-5">
                        <p className="text-base font-semibold text-slate-800 mb-4">The contact will wait:</p>
                        {opts.map((currentOption) => (
                            <button
                                key={currentOption.id}
                                onClick={() => setStep(currentOption.id)}
                                className="block w-full text-left p-4 border border-slate-200 rounded-xl bg-white mb-2.5 hover:border-blue-500 hover:bg-sky-50 transition-colors"
                            >
                                <p className="text-sm font-medium text-slate-800">{currentOption.label}</p>
                                <p className="text-sm text-slate-500 mt-1">{currentOption.sub}</p>
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-2.5">
                        <Button variant="ghost" className="bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={onClose}>Cancel</Button>
                        <Button variant="ghost" className="bg-slate-200 text-slate-400 hover:bg-slate-200" disabled>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
    return (
        <Dialog open onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0" showCloseButton={false}>
                <DialogHeader className="border-b border-slate-100 px-6 py-5 mb-0">
                    <div className="flex items-start gap-3">
                        {!config && (
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-500 hover:text-blue-600" onClick={() => setStep("type")}>
                                <ChevronLeft className="size-4" />
                                Back
                            </Button>
                        )}
                        <div className="flex-1 flex items-center gap-2.5">
                            <div className="size-10 rounded-full bg-slate-900 flex items-center justify-center">
                                <Clock size={18} color="#fff" />
                            </div>
                            <div>
                                <DialogTitle>{config ? "Edit Wait" : "Wait for a set period of time"}</DialogTitle>
                                <DialogDescription className="mt-1">e.g. 2 weeks, 1 day, 6 hours, 1 hour and 30 minutes</DialogDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                    </div>
                </DialogHeader>
                <div className="px-6 pt-7 pb-10">
                    <p className="text-sm font-medium text-slate-700 mb-3">Wait for</p>
                    <div className="flex gap-3">
                        <Input type="number" min={1} value={amount} onChange={handleAmountChange} className="w-20" />
                        <select value={unit} onChange={handleUnitChange} className="px-3 py-2.5 border border-slate-200 rounded-md text-sm">
                            {WAIT_UNITS.map((currentUnit) => <option key={currentUnit}>{currentUnit}</option>)}
                        </select>
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
