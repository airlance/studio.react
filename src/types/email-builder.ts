export type BlockType = 'heading' | 'text' | 'image' | 'button' | 'divider' | 'spacer';

export type ColumnLayout = 1 | 2 | 3;

export interface BlockBase {
  id: string;
  type: BlockType;
}

export interface HeadingBlock extends BlockBase {
  type: 'heading';
  content: string;
  level: 'h1' | 'h2' | 'h3';
  color: string;
  align: 'left' | 'center' | 'right';
}

export interface TextBlock extends BlockBase {
  type: 'text';
  content: string;
  fontSize: number;
  color: string;
  align: 'left' | 'center' | 'right';
}

export interface ImageBlock extends BlockBase {
  type: 'image';
  src: string;
  alt: string;
  width: number;
  align: 'left' | 'center' | 'right';
}

export interface ButtonBlock extends BlockBase {
  type: 'button';
  text: string;
  url: string;
  bgColor: string;
  textColor: string;
  borderRadius: number;
  align: 'left' | 'center' | 'right';
}

export interface DividerBlock extends BlockBase {
  type: 'divider';
  color: string;
  thickness: number;
  style: 'solid' | 'dashed' | 'dotted';
}

export interface SpacerBlock extends BlockBase {
  type: 'spacer';
  height: number;
}

export type EmailBlock = HeadingBlock | TextBlock | ImageBlock | ButtonBlock | DividerBlock | SpacerBlock;

export interface EmailRow {
  id: string;
  columns: ColumnLayout;
  blocks: EmailBlock[][]; // blocks[columnIndex][]
}

export const EMAIL_FONTS = [
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
  { value: "'Georgia', Times, serif", label: 'Georgia' },
  { value: "'Verdana', Geneva, sans-serif", label: 'Verdana' },
  { value: "'Trebuchet MS', Helvetica, sans-serif", label: 'Trebuchet MS' },
  { value: "'Times New Roman', Times, serif", label: 'Times New Roman' },
  { value: "'Courier New', Courier, monospace", label: 'Courier New' },
  { value: "'Tahoma', Geneva, sans-serif", label: 'Tahoma' },
  { value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif", label: 'Lucida Sans' },
  { value: "system-ui, -apple-system, sans-serif", label: 'System UI' },
] as const;

export interface EmailTemplate {
  rows: EmailRow[];
  bgColor: string;
  contentWidth: number;
  fontFamily: string;
}
