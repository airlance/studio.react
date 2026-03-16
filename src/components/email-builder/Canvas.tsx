import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronUp, ChevronDown, Trash2, Columns2, Columns3, Square, Plus, GripVertical } from 'lucide-react';
import { EmailTemplate, EmailRow, BlockType, ColumnLayout, EmailBlock } from '@/types/email-builder';
import { BlockRenderer } from './BlockRenderer';

interface CanvasProps {
  template: EmailTemplate;
  selectedBlockId: string | null;
  selectedRowId: string | null;
  onSelectBlock: (blockId: string, rowId: string) => void;
  onDeselectAll: () => void;
  onMoveRow: (rowId: string, direction: 'up' | 'down') => void;
  onMoveBlock: (rowId: string, colIndex: number, blockId: string, direction: 'up' | 'down') => void;
  onDeleteBlock: (blockId: string) => void;
  onDeleteRow: (rowId: string) => void;
  onChangeRowColumns: (rowId: string, columns: ColumnLayout) => void;
  onAddBlockToRow: (rowId: string, colIndex: number, type: BlockType) => void;
  onUpdateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
}

function ColumnLayoutSelector({ row, onChange }: { row: EmailRow; onChange: (c: ColumnLayout) => void }) {
  const layouts: { c: ColumnLayout; icon: React.ElementType }[] = [
    { c: 1, icon: Square },
    { c: 2, icon: Columns2 },
    { c: 3, icon: Columns3 },
  ];
  return (
    <div className="flex gap-0.5">
      {layouts.map(({ c, icon: Icon }) => (
        <button
          key={c}
          onClick={(e) => { e.stopPropagation(); onChange(c); }}
          className={`rounded p-1 transition-colors ${row.columns === c ? 'bg-primary text-primary-foreground' : 'text-icon hover:bg-secondary'}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

function SortableBlock({
  block,
  rowId,
  colIndex,
  blockIndex,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
  onInlineUpdate,
}: {
  block: EmailBlock;
  rowId: string;
  colIndex: number;
  blockIndex: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onInlineUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: { source: 'canvas', rowId, colIndex, blockIndex, block },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      className={`group/block relative rounded-md border transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-primary ring-offset-1 border-primary' : 'border-transparent hover:border-border'
      }`}
    >
      <div className="flex items-start">
        <button
          {...attributes}
          {...listeners}
          className="shrink-0 p-1 mt-1 cursor-grab active:cursor-grabbing text-icon opacity-0 group-hover/block:opacity-100 transition-opacity"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 px-1 py-1">
          <BlockRenderer block={block} isSelected={isSelected} onInlineUpdate={onInlineUpdate} />
        </div>
      </div>

      {isSelected && (
        <div className="absolute -right-1 -top-1 flex gap-0.5 rounded-md border border-border bg-card p-0.5 shadow-sm z-10">
          <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={!canMoveUp} className="rounded p-1 text-icon transition-colors hover:bg-secondary disabled:opacity-30">
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={!canMoveDown} className="rounded p-1 text-icon transition-colors hover:bg-secondary disabled:opacity-30">
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="rounded p-1 text-destructive transition-colors hover:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function DroppableColumn({
  rowId,
  colIndex,
  children,
  showBorder,
}: {
  rowId: string;
  colIndex: number;
  children: React.ReactNode;
  showBorder: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${rowId}-${colIndex}`,
    data: { rowId, colIndex },
  });

  return (
    <div
      ref={setNodeRef}
      className={`group/col min-h-[40px] rounded-md transition-colors ${
        showBorder ? 'border border-dashed border-border/50 p-1' : ''
      } ${isOver ? 'bg-primary/5 border-primary/30' : ''}`}
    >
      {children}
    </div>
  );
}

export function Canvas({
  template,
  selectedBlockId,
  selectedRowId,
  onSelectBlock,
  onDeselectAll,
  onMoveRow,
  onMoveBlock,
  onDeleteBlock,
  onDeleteRow,
  onChangeRowColumns,
  onAddBlockToRow,
  onUpdateBlock,
}: CanvasProps) {
  const { setNodeRef: setCanvasRef, isOver: isCanvasOver } = useDroppable({
    id: 'canvas-drop',
    data: { target: 'canvas' },
  });

  return (
    <div className="flex-1 overflow-auto bg-canvas p-8" onClick={onDeselectAll}>
      <div
        ref={setCanvasRef}
        className={`mx-auto rounded-lg bg-card shadow-sm border transition-colors ${isCanvasOver && template.rows.length === 0 ? 'border-primary/50 bg-primary/5' : 'border-border'}`}
        style={{ maxWidth: template.contentWidth, fontFamily: template.fontFamily }}
      >
        <div className="p-6">
          {template.rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="rounded-full bg-secondary p-4 mb-4">
                <Plus className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium">Start building your email</p>
              <p className="text-xs mt-1">Drag blocks from the left panel or click to add</p>
            </div>
          ) : (
            <div className="space-y-2">
              {template.rows.map((row, rowIndex) => (
                <div
                  key={row.id}
                  onClick={(e) => e.stopPropagation()}
                  className={`group relative rounded-md border transition-all ${
                    selectedRowId === row.id && !selectedBlockId
                      ? 'border-primary/50 bg-primary/[0.02]'
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  {/* Row toolbar */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <ColumnLayoutSelector row={row} onChange={(c) => onChangeRowColumns(row.id, c)} />
                    <div className="w-px h-4 bg-border mx-1" />
                    <button onClick={() => onMoveRow(row.id, 'up')} disabled={rowIndex === 0} className="rounded p-1 text-icon hover:bg-secondary disabled:opacity-30 transition-colors">
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => onMoveRow(row.id, 'down')} disabled={rowIndex === template.rows.length - 1} className="rounded p-1 text-icon hover:bg-secondary disabled:opacity-30 transition-colors">
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => onDeleteRow(row.id)} className="rounded p-1 text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Columns */}
                  <div className={`grid gap-2 p-2 pt-4 ${
                    row.columns === 1 ? 'grid-cols-1' : row.columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
                  }`}>
                    {row.blocks.map((col, colIndex) => (
                      <DroppableColumn key={colIndex} rowId={row.id} colIndex={colIndex} showBorder={row.columns > 1}>
                        {col.map((block, blockIndex) => (
                          <SortableBlock
                            key={block.id}
                            block={block}
                            rowId={row.id}
                            colIndex={colIndex}
                            blockIndex={blockIndex}
                            isSelected={selectedBlockId === block.id}
                            onSelect={() => onSelectBlock(block.id, row.id)}
                            onMoveUp={() => onMoveBlock(row.id, colIndex, block.id, 'up')}
                            onMoveDown={() => onMoveBlock(row.id, colIndex, block.id, 'down')}
                            onDelete={() => onDeleteBlock(block.id)}
                            canMoveUp={blockIndex > 0}
                            canMoveDown={blockIndex < col.length - 1}
                            onInlineUpdate={onUpdateBlock}
                          />
                        ))}
                      </DroppableColumn>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
