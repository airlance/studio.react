import { useState, useCallback, useRef } from 'react';
import { EmailTemplate, EmailRow, EmailBlock, BlockType, ColumnLayout } from '@/types/email-builder';

let idCounter = 0;
const uid = () => `block-${++idCounter}-${Date.now()}`;

const MAX_HISTORY = 50;

export function createDefaultBlock(type: BlockType): EmailBlock {
  const id = uid();
  switch (type) {
    case 'heading':
      return { id, type, content: 'Heading', level: 'h1', color: '#0F172A', align: 'left' };
    case 'text':
      return { id, type, content: 'Enter your text here...', fontSize: 16, color: '#0F172A', align: 'left' };
    case 'image':
      return { id, type, src: 'https://placehold.co/600x200/e2e8f0/64748b?text=Your+Image', alt: 'Image', width: 100, align: 'center' };
    case 'button':
      return { id, type, text: 'Click Me', url: '#', bgColor: '#4F46E5', textColor: '#FFFFFF', borderRadius: 6, align: 'center' };
    case 'divider':
      return { id, type, color: '#E2E8F0', thickness: 1, style: 'solid' };
    case 'spacer':
      return { id, type, height: 24 };
  }
}

function cloneTemplate(t: EmailTemplate): EmailTemplate {
  return JSON.parse(JSON.stringify(t));
}

export function useEmailBuilder() {
  const [template, setTemplateRaw] = useState<EmailTemplate>({
    rows: [],
    bgColor: '#F8FAFC',
    contentWidth: 600,
    fontFamily: 'Arial, Helvetica, sans-serif',
  });

  const undoStack = useRef<EmailTemplate[]>([]);
  const redoStack = useRef<EmailTemplate[]>([]);
  const skipHistory = useRef(false);

  const setTemplate = useCallback((updater: EmailTemplate | ((prev: EmailTemplate) => EmailTemplate)) => {
    setTemplateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (!skipHistory.current) {
        undoStack.current.push(cloneTemplate(prev));
        if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
        redoStack.current = [];
      }
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    setTemplateRaw(prev => {
      redoStack.current.push(cloneTemplate(prev));
      return undoStack.current.pop()!;
    });
  }, []);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    setTemplateRaw(prev => {
      undoStack.current.push(cloneTemplate(prev));
      return redoStack.current.pop()!;
    });
  }, []);

  const canUndo = undoStack.current.length > 0;
  const canRedo = redoStack.current.length > 0;

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const addRow = useCallback((columns: ColumnLayout = 1) => {
    const row: EmailRow = {
      id: uid(),
      columns,
      blocks: Array.from({ length: columns }, () => []),
    };
    setTemplate(prev => ({ ...prev, rows: [...prev.rows, row] }));
  }, [setTemplate]);

  const addBlockToRow = useCallback((rowId: string, columnIndex: number, type: BlockType) => {
    const block = createDefaultBlock(type);
    setTemplate(prev => ({
      ...prev,
      rows: prev.rows.map(row => {
        if (row.id !== rowId) return row;
        const newBlocks = row.blocks.map((col, i) => i === columnIndex ? [...col, block] : col);
        return { ...row, blocks: newBlocks };
      }),
    }));
    setSelectedBlockId(block.id);
    setSelectedRowId(rowId);
  }, [setTemplate]);

  const addBlockToCanvas = useCallback((type: BlockType) => {
    const block = createDefaultBlock(type);
    const row: EmailRow = {
      id: uid(),
      columns: 1,
      blocks: [[block]],
    };
    setTemplate(prev => ({ ...prev, rows: [...prev.rows, row] }));
    setSelectedBlockId(block.id);
    setSelectedRowId(row.id);
  }, [setTemplate]);

  const updateBlock = useCallback((blockId: string, updates: Partial<EmailBlock>) => {
    setTemplate(prev => ({
      ...prev,
      rows: prev.rows.map(row => ({
        ...row,
        blocks: row.blocks.map(col =>
          col.map(block => block.id === blockId ? { ...block, ...updates } as EmailBlock : block)
        ),
      })),
    }));
  }, [setTemplate]);

  const deleteBlock = useCallback((blockId: string) => {
    setTemplate(prev => {
      const newRows = prev.rows.map(row => ({
        ...row,
        blocks: row.blocks.map(col => col.filter(b => b.id !== blockId)),
      })).filter(row => row.blocks.some(col => col.length > 0));
      return { ...prev, rows: newRows };
    });
    setSelectedBlockId(null);
    setSelectedRowId(null);
  }, [setTemplate]);

  const deleteRow = useCallback((rowId: string) => {
    setTemplate(prev => ({
      ...prev,
      rows: prev.rows.filter(r => r.id !== rowId),
    }));
    if (selectedRowId === rowId) {
      setSelectedBlockId(null);
      setSelectedRowId(null);
    }
  }, [selectedRowId, setTemplate]);

  const moveRow = useCallback((rowId: string, direction: 'up' | 'down') => {
    setTemplate(prev => {
      const idx = prev.rows.findIndex(r => r.id === rowId);
      if (idx === -1) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.rows.length) return prev;
      const newRows = [...prev.rows];
      [newRows[idx], newRows[newIdx]] = [newRows[newIdx], newRows[idx]];
      return { ...prev, rows: newRows };
    });
  }, [setTemplate]);

  const moveBlock = useCallback((rowId: string, colIndex: number, blockId: string, direction: 'up' | 'down') => {
    setTemplate(prev => ({
      ...prev,
      rows: prev.rows.map(row => {
        if (row.id !== rowId) return row;
        const newBlocks = row.blocks.map((col, ci) => {
          if (ci !== colIndex) return col;
          const idx = col.findIndex(b => b.id === blockId);
          if (idx === -1) return col;
          const newIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (newIdx < 0 || newIdx >= col.length) return col;
          const newCol = [...col];
          [newCol[idx], newCol[newIdx]] = [newCol[newIdx], newCol[idx]];
          return newCol;
        });
        return { ...row, blocks: newBlocks };
      }),
    }));
  }, [setTemplate]);

  const changeRowColumns = useCallback((rowId: string, columns: ColumnLayout) => {
    setTemplate(prev => ({
      ...prev,
      rows: prev.rows.map(row => {
        if (row.id !== rowId) return row;
        const newBlocks: EmailBlock[][] = Array.from({ length: columns }, (_, i) => row.blocks[i] || []);
        return { ...row, columns, blocks: newBlocks };
      }),
    }));
  }, [setTemplate]);

  // Insert a pre-created block into a specific row/col/index
  const insertBlock = useCallback((rowId: string, colIndex: number, index: number, block: EmailBlock) => {
    setTemplate(prev => ({
      ...prev,
      rows: prev.rows.map(row => {
        if (row.id !== rowId) return row;
        const newBlocks = row.blocks.map((col, ci) => {
          if (ci !== colIndex) return col;
          const newCol = [...col];
          newCol.splice(index, 0, block);
          return newCol;
        });
        return { ...row, blocks: newBlocks };
      }),
    }));
    setSelectedBlockId(block.id);
    setSelectedRowId(rowId);
  }, [setTemplate]);

  // Remove block without pushing history (for drag reorder within same template update)
  const removeBlockRaw = useCallback((blockId: string): { block: EmailBlock; rowId: string; colIndex: number; index: number } | null => {
    let found: { block: EmailBlock; rowId: string; colIndex: number; index: number } | null = null;
    setTemplateRaw(prev => {
      for (const row of prev.rows) {
        for (let ci = 0; ci < row.blocks.length; ci++) {
          const idx = row.blocks[ci].findIndex(b => b.id === blockId);
          if (idx !== -1) {
            found = { block: row.blocks[ci][idx], rowId: row.id, colIndex: ci, index: idx };
          }
        }
      }
      return prev; // don't actually modify
    });
    return found;
  }, []);

  const getSelectedBlock = useCallback((): EmailBlock | null => {
    if (!selectedBlockId) return null;
    for (const row of template.rows) {
      for (const col of row.blocks) {
        const block = col.find(b => b.id === selectedBlockId);
        if (block) return block;
      }
    }
    return null;
  }, [selectedBlockId, template.rows]);

  const getSelectedRow = useCallback((): EmailRow | null => {
    if (!selectedRowId) return null;
    return template.rows.find(r => r.id === selectedRowId) || null;
  }, [selectedRowId, template.rows]);

  // Reorder block within or across columns via drag
  const reorderBlock = useCallback((
    fromRowId: string, fromColIndex: number, fromBlockIndex: number,
    toRowId: string, toColIndex: number, toBlockIndex: number
  ) => {
    setTemplate(prev => {
      const newRows = prev.rows.map(r => ({
        ...r,
        blocks: r.blocks.map(col => [...col]),
      }));

      const fromRow = newRows.find(r => r.id === fromRowId);
      const toRow = newRows.find(r => r.id === toRowId);
      if (!fromRow || !toRow) return prev;

      const [block] = fromRow.blocks[fromColIndex].splice(fromBlockIndex, 1);
      if (!block) return prev;

      // Adjust target index if same column and removing shifted indices
      let adjustedIndex = toBlockIndex;
      if (fromRowId === toRowId && fromColIndex === toColIndex && fromBlockIndex < toBlockIndex) {
        adjustedIndex--;
      }

      toRow.blocks[toColIndex].splice(adjustedIndex, 0, block);

      // Clean up empty rows
      const cleaned = newRows.filter(r => r.blocks.some(col => col.length > 0));
      return { ...prev, rows: cleaned };
    });
  }, [setTemplate]);

  return {
    template,
    setTemplate,
    selectedBlockId,
    setSelectedBlockId,
    selectedRowId,
    setSelectedRowId,
    addRow,
    addBlockToRow,
    addBlockToCanvas,
    updateBlock,
    deleteBlock,
    deleteRow,
    moveRow,
    moveBlock,
    changeRowColumns,
    getSelectedBlock,
    getSelectedRow,
    undo,
    redo,
    canUndo,
    canRedo,
    insertBlock,
    reorderBlock,
  };
}
