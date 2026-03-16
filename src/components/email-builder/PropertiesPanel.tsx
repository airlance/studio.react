import { EmailBlock, EmailTemplate, HeadingBlock, TextBlock, ImageBlock, ButtonBlock, DividerBlock, SpacerBlock, EMAIL_FONTS } from '@/types/email-builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

interface PropertiesPanelProps {
  block: EmailBlock | null;
  onUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
  template: EmailTemplate;
  onUpdateTemplate: (updates: Partial<EmailTemplate>) => void;
}

function AlignSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">Alignment</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="left">Left</SelectItem>
          <SelectItem value="center">Center</SelectItem>
          <SelectItem value="right">Right</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-2 mt-1">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="h-9 w-9 rounded border border-border cursor-pointer" />
        <Input value={value} onChange={e => onChange(e.target.value)} className="flex-1 font-mono text-xs" />
      </div>
    </div>
  );
}

function HeadingProps({ block, onUpdate }: { block: HeadingBlock; onUpdate: (u: Partial<HeadingBlock>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Content</Label>
        <Input value={block.content} onChange={e => onUpdate({ content: e.target.value })} className="mt-1" />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Level</Label>
        <Select value={block.level} onValueChange={v => onUpdate({ level: v as 'h1' | 'h2' | 'h3' })}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="h1">H1</SelectItem>
            <SelectItem value="h2">H2</SelectItem>
            <SelectItem value="h3">H3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ColorInput label="Color" value={block.color} onChange={v => onUpdate({ color: v })} />
      <AlignSelect value={block.align} onChange={v => onUpdate({ align: v as 'left' | 'center' | 'right' })} />
    </div>
  );
}

function TextProps({ block, onUpdate }: { block: TextBlock; onUpdate: (u: Partial<TextBlock>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Content</Label>
        <Textarea value={block.content} onChange={e => onUpdate({ content: e.target.value })} className="mt-1" rows={4} />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Font Size: {block.fontSize}px</Label>
        <Slider value={[block.fontSize]} onValueChange={v => onUpdate({ fontSize: v[0] })} min={10} max={36} step={1} className="mt-2" />
      </div>
      <ColorInput label="Color" value={block.color} onChange={v => onUpdate({ color: v })} />
      <AlignSelect value={block.align} onChange={v => onUpdate({ align: v as 'left' | 'center' | 'right' })} />
    </div>
  );
}

function ImageProps({ block, onUpdate }: { block: ImageBlock; onUpdate: (u: Partial<ImageBlock>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Image URL</Label>
        <Input value={block.src} onChange={e => onUpdate({ src: e.target.value })} className="mt-1" />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Alt Text</Label>
        <Input value={block.alt} onChange={e => onUpdate({ alt: e.target.value })} className="mt-1" />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Width: {block.width}%</Label>
        <Slider value={[block.width]} onValueChange={v => onUpdate({ width: v[0] })} min={10} max={100} step={5} className="mt-2" />
      </div>
      <AlignSelect value={block.align} onChange={v => onUpdate({ align: v as 'left' | 'center' | 'right' })} />
    </div>
  );
}

function ButtonProps({ block, onUpdate }: { block: ButtonBlock; onUpdate: (u: Partial<ButtonBlock>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Button Text</Label>
        <Input value={block.text} onChange={e => onUpdate({ text: e.target.value })} className="mt-1" />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">URL</Label>
        <Input value={block.url} onChange={e => onUpdate({ url: e.target.value })} className="mt-1" />
      </div>
      <ColorInput label="Background" value={block.bgColor} onChange={v => onUpdate({ bgColor: v })} />
      <ColorInput label="Text Color" value={block.textColor} onChange={v => onUpdate({ textColor: v })} />
      <div>
        <Label className="text-xs text-muted-foreground">Border Radius: {block.borderRadius}px</Label>
        <Slider value={[block.borderRadius]} onValueChange={v => onUpdate({ borderRadius: v[0] })} min={0} max={32} step={1} className="mt-2" />
      </div>
      <AlignSelect value={block.align} onChange={v => onUpdate({ align: v as 'left' | 'center' | 'right' })} />
    </div>
  );
}

function DividerProps({ block, onUpdate }: { block: DividerBlock; onUpdate: (u: Partial<DividerBlock>) => void }) {
  return (
    <div className="space-y-4">
      <ColorInput label="Color" value={block.color} onChange={v => onUpdate({ color: v })} />
      <div>
        <Label className="text-xs text-muted-foreground">Thickness: {block.thickness}px</Label>
        <Slider value={[block.thickness]} onValueChange={v => onUpdate({ thickness: v[0] })} min={1} max={6} step={1} className="mt-2" />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Style</Label>
        <Select value={block.style} onValueChange={v => onUpdate({ style: v as 'solid' | 'dashed' | 'dotted' })}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function SpacerProps({ block, onUpdate }: { block: SpacerBlock; onUpdate: (u: Partial<SpacerBlock>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Height: {block.height}px</Label>
        <Slider value={[block.height]} onValueChange={v => onUpdate({ height: v[0] })} min={8} max={120} step={4} className="mt-2" />
      </div>
    </div>
  );
}

function TemplateSettings({ template, onUpdate }: { template: EmailTemplate; onUpdate: (u: Partial<EmailTemplate>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Font Family</Label>
        <Select value={template.fontFamily} onValueChange={v => onUpdate({ fontFamily: v })}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            {EMAIL_FONTS.map(f => (
              <SelectItem key={f.value} value={f.value}>
                <span style={{ fontFamily: f.value }}>{f.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Background Color</Label>
        <div className="flex gap-2 mt-1">
          <input type="color" value={template.bgColor} onChange={e => onUpdate({ bgColor: e.target.value })} className="h-9 w-9 rounded border border-border cursor-pointer" />
          <Input value={template.bgColor} onChange={e => onUpdate({ bgColor: e.target.value })} className="flex-1 font-mono text-xs" />
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Content Width: {template.contentWidth}px</Label>
        <Slider value={[template.contentWidth]} onValueChange={v => onUpdate({ contentWidth: v[0] })} min={400} max={800} step={10} className="mt-2" />
      </div>
    </div>
  );
}

export function PropertiesPanel({ block, onUpdate, template, onUpdateTemplate }: PropertiesPanelProps) {
  if (!block) {
    return (
      <div className="p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Template Settings
        </h3>
        <TemplateSettings template={template} onUpdate={onUpdateTemplate} />
      </div>
    );
  }

  const handleUpdate = (updates: Partial<EmailBlock>) => {
    onUpdate(block.id, updates);
  };

  const blockLabels: Record<string, string> = {
    heading: 'Heading',
    text: 'Text',
    image: 'Image',
    button: 'Button',
    divider: 'Divider',
    spacer: 'Spacer',
  };

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        {blockLabels[block.type]} Properties
      </h3>
      {block.type === 'heading' && <HeadingProps block={block} onUpdate={handleUpdate} />}
      {block.type === 'text' && <TextProps block={block} onUpdate={handleUpdate} />}
      {block.type === 'image' && <ImageProps block={block} onUpdate={handleUpdate} />}
      {block.type === 'button' && <ButtonProps block={block} onUpdate={handleUpdate} />}
      {block.type === 'divider' && <DividerProps block={block} onUpdate={handleUpdate} />}
      {block.type === 'spacer' && <SpacerProps block={block} onUpdate={handleUpdate} />}
    </div>
  );
}
