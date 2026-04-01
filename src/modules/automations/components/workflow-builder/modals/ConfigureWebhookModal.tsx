import { ChangeEvent, useCallback, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NodeConfig } from "@/types/automation";

interface ConfigureWebhookModalProps {
    config?: NodeConfig;
    onSave: (config: NodeConfig) => void;
    onBack: () => void;
    onClose: () => void;
}

export function ConfigureWebhookModal({ config, onSave, onBack, onClose }: ConfigureWebhookModalProps) {
    const [url, setUrl] = useState(config?.url || "");

    const handleUrlChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    }, []);

    const handleSave = useCallback(() => {
        onSave({ url: url || "https://your-webhook-url.com" });
    }, [onSave, url]);

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            onClose();
        }
    }, [onClose]);

    return (
        <Dialog open onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0" showCloseButton={false}>
                <DialogHeader className="flex-row items-start gap-2 border-b border-border px-6 py-5 mb-0 space-y-0">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-500 hover:text-blue-600" onClick={onBack}>
                        <ChevronLeft className="size-4" />
                        Back
                    </Button>
                    <div className="flex-1">
                        <DialogTitle>{config ? "Edit Webhook" : "Webhook"}</DialogTitle>
                        <DialogDescription className="mt-2">Post contact data to a URL of your choice</DialogDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="size-8 text-slate-400 hover:text-slate-600" onClick={onClose}>
                        <X className="size-5" />
                    </Button>
                </DialogHeader>
                <div className="px-6 pt-5 pb-16">
                    <p className="text-sm font-medium text-slate-700 mb-2.5">Enter the URL to post to</p>
                    <Input
                        placeholder="https://your-webhook-url.com"
                        value={url}
                        onChange={handleUrlChange}
                    />
                </div>
                <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-2.5">
                    <Button variant="ghost" className="bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>{config ? "Save Changes" : "Save"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
