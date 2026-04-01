import { ChangeEvent, useCallback, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NodeConfig } from "@/types/automation";

interface ConfigureEmailModalProps {
    config?: NodeConfig;
    onSave: (config: NodeConfig) => void;
    onBack: () => void;
    onClose: () => void;
}

export function ConfigureEmailModal({ config, onSave, onBack, onClose }: ConfigureEmailModalProps) {
    const [name, setName] = useState(config?.name || "New Campaign");
    const [subject, setSubject] = useState(config?.subject || "");

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            onClose();
        }
    }, [onClose]);

    const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);

    const handleSubjectChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSubject(event.target.value);
    }, []);

    const handleSave = useCallback(() => {
        onSave({ name, subject });
    }, [name, onSave, subject]);

    return (
        <Dialog open onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[640px] p-0 gap-0" showCloseButton={false}>
                <DialogHeader className="border-b border-slate-100 px-6 py-5 mb-0">
                    <div className="flex items-start gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-500 hover:text-blue-600" onClick={onBack}>
                            <ChevronLeft className="size-4" />
                            Back
                        </Button>
                        <div className="flex-1">
                            <DialogTitle>{config ? "Edit email" : "Send an email"}</DialogTitle>
                            <DialogDescription className="mt-2">A marketing email for subscribed contacts</DialogDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                    </div>
                </DialogHeader>

                <div className="px-6 pt-1 pb-6">
                    <div className="flex items-center border-b border-slate-100 py-2">
                        <div className="w-[120px] text-sm font-medium text-slate-700">Email name</div>
                        <Input value={name} onChange={handleNameChange} className="border-0 shadow-none px-0 focus-visible:ring-0" />
                    </div>
                    <div className="flex items-center border-b border-slate-100 py-2">
                        <div className="w-[120px] text-sm font-medium text-slate-700">Subject line</div>
                        <Input placeholder="Write your subject line" value={subject} onChange={handleSubjectChange} className="border-0 shadow-none px-0 focus-visible:ring-0" />
                    </div>
                    <div className="flex items-center border-b border-slate-100 py-2">
                        <div className="w-[120px] text-sm font-medium text-slate-700">From</div>
                        <span className="text-sm text-slate-700">user@example.com</span>
                    </div>
                    <div className="flex items-center border-b border-slate-100 py-2">
                        <div className="w-[120px] text-sm font-medium text-slate-700">Send</div>
                        <div className="flex gap-2">
                            <Button className="rounded-full">Immediately</Button>
                            <Button variant="ghost" className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200">Predictive Send</Button>
                        </div>
                    </div>

                    <div className="mt-4 border border-slate-200 rounded-lg p-6 text-center text-sm text-slate-400">
                        <div className="text-2xl font-bold text-slate-300 mb-2">LOGO</div>
                        <div className="font-semibold text-slate-700 mb-2">Design your email here!</div>
                        <div className="text-xs">Click to open the email editor</div>
                    </div>
                </div>

                <div className="border-t border-slate-100 px-6 py-4 flex justify-between">
                    <Button variant="ghost" className="bg-slate-100 text-slate-700 hover:bg-slate-200">Send a test</Button>
                    <div className="flex gap-2.5">
                        <Button variant="ghost" className="bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={onClose}>Cancel</Button>
                        <Button variant="ghost" className="bg-slate-100 text-slate-400 hover:bg-slate-200">Save as draft</Button>
                        <Button onClick={handleSave}>{config ? "Save Changes" : "Finish"}</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
