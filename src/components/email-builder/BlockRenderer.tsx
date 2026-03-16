import { EmailBlock } from '@/types/email-builder';
import { InlineEditor } from './InlineEditor';

interface BlockRendererProps {
  block: EmailBlock;
  isPreview?: boolean;
  onInlineUpdate?: (blockId: string, updates: Partial<EmailBlock>) => void;
  isSelected?: boolean;
}
export function BlockRenderer({ block, isPreview, onInlineUpdate, isSelected }: BlockRendererProps) {
  const canInlineEdit = !isPreview && !!onInlineUpdate && isSelected;

  switch (block.type) {
    case 'heading': {
      const sizes = { h1: 'text-2xl', h2: 'text-xl', h3: 'text-lg' };
      if (canInlineEdit) {
        return (
          <InlineEditor
            value={block.content}
            onChange={(v) => onInlineUpdate(block.id, { content: v })}
            style={{ color: block.color, textAlign: block.align }}
            className={`${sizes[block.level]} font-bold py-1`}
          />
        );
      }
      return (
        <div style={{ color: block.color, textAlign: block.align }} className={`${sizes[block.level]} font-bold py-1`}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );
    }
    case 'text':
      if (canInlineEdit) {
        return (
          <InlineEditor
            value={block.content}
            onChange={(v) => onInlineUpdate(block.id, { content: v })}
            style={{ color: block.color, fontSize: block.fontSize, textAlign: block.align }}
            className="py-1 leading-relaxed"
            tag="p"
          />
        );
      }
      return (
        <p style={{ color: block.color, fontSize: block.fontSize, textAlign: block.align }} className="py-1 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );
    case 'image':
      return (
        <div style={{ textAlign: block.align }} className="py-1">
          <img src={block.src} alt={block.alt} style={{ maxWidth: `${block.width}%` }} className="inline-block h-auto" />
        </div>
      );
    case 'button':
      if (canInlineEdit) {
        return (
          <div style={{ textAlign: block.align }} className="py-2">
            <InlineEditor
              value={block.text}
              onChange={(v) => onInlineUpdate(block.id, { text: v })}
              style={{
                backgroundColor: block.bgColor,
                color: block.textColor,
                borderRadius: block.borderRadius,
                display: 'inline-block',
              }}
              className="px-7 py-3 font-semibold text-base"
              tag="span"
            />
          </div>
        );
      }
      return (
        <div style={{ textAlign: block.align }} className="py-2">
          <a
            href={block.url}
            onClick={e => e.preventDefault()}
            style={{
              backgroundColor: block.bgColor,
              color: block.textColor,
              borderRadius: block.borderRadius,
            }}
            className="inline-block px-7 py-3 font-semibold text-base no-underline"
            dangerouslySetInnerHTML={{ __html: block.text }}
          />
        </div>
      );
    case 'divider':
      return (
        <hr
          style={{
            borderTop: `${block.thickness}px ${block.style} ${block.color}`,
          }}
          className="my-3 border-0"
        />
      );
    case 'spacer':
      return <div style={{ height: block.height }} />;
  }
}
