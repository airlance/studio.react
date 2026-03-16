import { useState, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEmailBuilder, createDefaultBlock } from '@/hooks/useEmailBuilder';
import { BuilderHeader } from '@/components/email-builder/BuilderHeader';
import { BlockPalette } from '@/components/email-builder/BlockPalette';
import { RowControls } from '@/components/email-builder/RowControls';
import { Canvas } from '@/components/email-builder/Canvas';
import { PropertiesPanel } from '@/components/email-builder/PropertiesPanel';
import { PreviewModal } from '@/components/email-builder/PreviewModal';
import { ExportModal } from '@/components/email-builder/ExportModal';
import { WelcomeScreen } from '@/components/email-builder/WelcomeScreen';
import { UploadHtmlModal } from '@/components/email-builder/UploadHtmlModal';
import { AIGenerateModal } from '@/components/email-builder/AIGenerateModal';
import { TemplatePickerModal } from '@/components/email-builder/TemplatePickerModal';
import { BlockRenderer } from '@/components/email-builder/BlockRenderer';
import { BlockType, EmailBlock, EmailTemplate } from '@/types/email-builder';

const Index = () => {
  const builder = useEmailBuilder();
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showAIGenerate, setShowAIGenerate] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [dragOverlay, setDragOverlay] = useState<EmailBlock | null>(null);

  const isEmpty = builder.template.rows.length === 0;
  const selectedBlock = builder.getSelectedBlock();

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          builder.redo();
        } else {
          builder.undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        builder.redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [builder.undo, builder.redo]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.source === 'palette') {
      setDragOverlay(createDefaultBlock(data.blockType as BlockType));
    } else if (data?.source === 'canvas' && data?.block) {
      setDragOverlay(data.block);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setDragOverlay(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.source === 'palette') {
      const blockType = activeData.blockType as BlockType;
      if (overData?.rowId !== undefined && overData?.colIndex !== undefined) {
        builder.addBlockToRow(overData.rowId, overData.colIndex, blockType);
      } else {
        builder.addBlockToCanvas(blockType);
      }
      return;
    }

    if (activeData?.source === 'canvas') {
      const fromRowId = activeData.rowId as string;
      const fromColIndex = activeData.colIndex as number;
      const fromBlockIndex = activeData.blockIndex as number;

      if (overData?.rowId !== undefined && overData?.colIndex !== undefined) {
        const toRowId = overData.rowId as string;
        const toColIndex = overData.colIndex as number;
        const targetRow = builder.template.rows.find(r => r.id === toRowId);
        const toBlockIndex = targetRow?.blocks[toColIndex]?.length ?? 0;
        if (fromRowId !== toRowId || fromColIndex !== toColIndex || fromBlockIndex !== toBlockIndex) {
          builder.reorderBlock(fromRowId, fromColIndex, fromBlockIndex, toRowId, toColIndex, toBlockIndex);
        }
        return;
      }

      if (over.data.current?.source === 'canvas') {
        const toRowId = over.data.current.rowId as string;
        const toColIndex = over.data.current.colIndex as number;
        const toBlockIndex = over.data.current.blockIndex as number;
        if (fromRowId !== toRowId || fromColIndex !== toColIndex || fromBlockIndex !== toBlockIndex) {
          builder.reorderBlock(fromRowId, fromColIndex, fromBlockIndex, toRowId, toColIndex, toBlockIndex);
        }
      }
    }
  }, [builder]);

  const handleStartScratch = useCallback(() => {
    builder.addRow(1);
  }, [builder]);

  const handleImportTemplate = useCallback((template: EmailTemplate) => {
    builder.setTemplate(template);
  }, [builder]);

  const allBlockIds = builder.template.rows.flatMap(r => r.blocks.flatMap(col => col.map(b => b.id)));

  return (
    <div className="flex h-screen flex-col bg-canvas">
      <BuilderHeader
        onPreview={() => setShowPreview(true)}
        onExport={() => setShowExport(true)}
        onStartScratch={handleStartScratch}
        onUploadHtml={() => setShowUpload(true)}
        onGenerateAI={() => setShowAIGenerate(true)}
        onSelectTemplate={handleImportTemplate}
        onOpenTemplates={() => setShowTemplates(true)}
        onUndo={builder.undo}
        onRedo={builder.redo}
        canUndo={builder.canUndo}
        canRedo={builder.canRedo}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-hidden">
          {isEmpty ? (
            <WelcomeScreen
              onStartScratch={handleStartScratch}
              onUploadHtml={() => setShowUpload(true)}
              onGenerateAI={() => setShowAIGenerate(true)}
              onSelectTemplate={handleImportTemplate}
            />
          ) : (
            <>
              {/* Left Panel */}
              <div className="w-56 shrink-0 overflow-y-auto border-r border-border bg-card p-4">
                <BlockPalette onAddBlock={builder.addBlockToCanvas} />
                <RowControls onAddRow={builder.addRow} />
              </div>

              {/* Center - Canvas */}
              <SortableContext items={allBlockIds} strategy={verticalListSortingStrategy}>
                <Canvas
                  template={builder.template}
                  selectedBlockId={builder.selectedBlockId}
                  selectedRowId={builder.selectedRowId}
                  onSelectBlock={(blockId, rowId) => {
                    builder.setSelectedBlockId(blockId);
                    builder.setSelectedRowId(rowId);
                  }}
                  onDeselectAll={() => {
                    builder.setSelectedBlockId(null);
                    builder.setSelectedRowId(null);
                  }}
                  onMoveRow={builder.moveRow}
                  onMoveBlock={builder.moveBlock}
                  onDeleteBlock={builder.deleteBlock}
                  onDeleteRow={builder.deleteRow}
                  onChangeRowColumns={builder.changeRowColumns}
                  onAddBlockToRow={builder.addBlockToRow}
                  onUpdateBlock={builder.updateBlock}
                />
              </SortableContext>

              {/* Right Panel */}
              <div className="w-72 shrink-0 overflow-y-auto border-l border-border bg-card">
                <PropertiesPanel
                  block={selectedBlock}
                  onUpdate={builder.updateBlock}
                  template={builder.template}
                  onUpdateTemplate={(updates) => builder.setTemplate(prev => ({ ...prev, ...updates }))}
                />
              </div>
            </>
          )}
        </div>

        <DragOverlay>
          {dragOverlay && (
            <div className="rounded-md border border-primary bg-card p-2 shadow-lg opacity-90 max-w-[300px]">
              <BlockRenderer block={dragOverlay} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <PreviewModal open={showPreview} onOpenChange={setShowPreview} template={builder.template} />
      <ExportModal open={showExport} onOpenChange={setShowExport} template={builder.template} />
      <UploadHtmlModal open={showUpload} onOpenChange={setShowUpload} onImport={handleImportTemplate} />
      <AIGenerateModal open={showAIGenerate} onOpenChange={setShowAIGenerate} onGenerate={handleImportTemplate} />
      <TemplatePickerModal open={showTemplates} onOpenChange={setShowTemplates} onSelectTemplate={handleImportTemplate} />
    </div>
  );
};

export default Index;
