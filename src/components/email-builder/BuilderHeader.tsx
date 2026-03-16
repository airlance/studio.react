import { Button } from '@/components/ui/button';
import { Eye, Code, Mail, Undo2, Redo2, Plus, FileUp, Sparkles, LayoutTemplate, ChevronDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { EmailTemplate } from '@/types/email-builder';

interface BuilderHeaderProps {
  onPreview: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onStartScratch: () => void;
  onUploadHtml: () => void;
  onGenerateAI: () => void;
  onSelectTemplate: (template: EmailTemplate) => void;
  onOpenTemplates: () => void;
}

export function BuilderHeader({ onPreview, onExport, onUndo, onRedo, canUndo, canRedo, onStartScratch, onUploadHtml, onGenerateAI, onSelectTemplate, onOpenTemplates }: BuilderHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Mail className="h-5 w-5 text-primary" />
          <h1 className="text-base font-semibold text-foreground">Email Builder</h1>
        </div>
        <div className="flex items-center gap-0.5 ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onUndo} disabled={!canUndo}>
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRedo} disabled={!canRedo}>
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <LayoutTemplate className="h-4 w-4 mr-1.5" />
              New
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onStartScratch}>
              <Plus className="h-4 w-4 mr-2" />
              Start from Scratch
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onUploadHtml}>
              <FileUp className="h-4 w-4 mr-2" />
              Upload HTML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGenerateAI}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with AI
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onOpenTemplates}>
              <LayoutTemplate className="h-4 w-4 mr-2" />
              Templates
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" onClick={onPreview}>
          <Eye className="h-4 w-4 mr-1.5" />
          Preview
        </Button>
        <Button size="sm" onClick={onExport} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Code className="h-4 w-4 mr-1.5" />
          Export HTML
        </Button>
      </div>
    </header>
  );
}
