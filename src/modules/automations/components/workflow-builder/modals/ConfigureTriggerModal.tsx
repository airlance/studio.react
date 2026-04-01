import { ChangeEvent, useCallback, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TriggerOption, NodeConfig } from "@/types/automation";

interface ConfigureTriggerModalProps {
    trigger: TriggerOption;
    config?: NodeConfig;
    onSave: (config: NodeConfig) => void;
    onBack: () => void;
    onClose: () => void;
}

export function ConfigureTriggerModal({ trigger, config, onSave, onBack, onClose }: ConfigureTriggerModalProps) {
    const [runs, setRuns] = useState(config?.runs || "Once");

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            onClose();
        }
    }, [onClose]);

    const handleRunsChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setRuns(event.target.value);
    }, []);

    const handleSave = useCallback(() => {
        onSave({ runs });
    }, [onSave, runs]);

    return (
        <Dialog open onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[560px] p-0 gap-0" showCloseButton={false}>
                <DialogHeader className="border-b border-slate-100 px-6 py-5 mb-0">
                    <div className="flex items-start gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-500 hover:text-blue-600" onClick={onBack}>
                            <ChevronLeft className="size-4" />
                            Back
                        </Button>
                        <div className="flex-1">
                            <DialogTitle>{config ? "Edit trigger" : "Action option"}</DialogTitle>
                            <DialogDescription className="mt-2">({trigger.label})</DialogDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                    </div>
                </DialogHeader>

                <div className="px-6 py-6">
                    <div className="flex items-center gap-3 mb-5">
                        <label className="text-sm font-medium text-slate-700 w-24">Select email</label>
                        <select className="px-3 py-2 border border-slate-200 rounded-md text-sm">
                            <option>Any 1:1 email</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <label className="text-sm font-medium text-slate-700 w-24">Runs</label>
                        <select value={runs} onChange={handleRunsChange} className="px-3 py-2 border border-slate-200 rounded-md text-sm">
                            <option>Once</option>
                            <option>Many times</option>
                        </select>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mb-6">
                        <p className="text-xs font-bold text-blue-500 mb-3">ADVANCED</p>
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" />
                            Segment the contacts entering this automation
                        </label>
                    </div>
                </div>

                <div className="border-t border-slate-100 px-6 py-4 flex justify-between">
                    <Button variant="ghost" className="bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={onBack}>
                        {config ? "Cancel" : "Back"}
                    </Button>
                    <Button onClick={handleSave}>{config ? "Save Changes" : "Add Start"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
