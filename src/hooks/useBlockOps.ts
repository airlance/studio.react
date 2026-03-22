import { useCallback, useState } from 'react';
import { BlockType, EmailBlock, EmailRow, EmailTemplate } from '@/types/email-builder';
import { createDefaultBlock } from './createDefaultBlock';
import { uid } from '@/utils/uid';

type SetTemplate = (updater: (prev: EmailTemplate) => EmailTemplate) => void;

export function useBlockOps(setTemplate: SetTemplate) {
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const addBlockToRow = useCallback(
        (rowId: string, columnIndex: number, type: BlockType) => {
            const block = createDefaultBlock(type);
            setTemplate(prev => ({
                ...prev,
                rows: prev.rows.map(row => {
                    if (row.id !== rowId) return row;
                    const newBlocks = row.blocks.map((col, i) =>
                        i === columnIndex ? [...col, block] : col,
                    );
                    return { ...row, blocks: newBlocks };
                }),
            }));
            setSelectedBlockId(block.id);
            setSelectedRowId(rowId);
        },
        [setTemplate],
    );

    const addBlockToCanvas = useCallback(
        (type: BlockType) => {
            const block = createDefaultBlock(type);
            const row: EmailRow = { id: uid('row'), columns: 1, blocks: [[block]] };
            setTemplate(prev => ({ ...prev, rows: [...prev.rows, row] }));
            setSelectedBlockId(block.id);
            setSelectedRowId(row.id);
        },
        [setTemplate],
    );

    const updateBlock = useCallback(
        (blockId: string, updates: Partial<EmailBlock>) => {
            setTemplate(prev => ({
                ...prev,
                rows: prev.rows.map(row => ({
                    ...row,
                    blocks: row.blocks.map(col =>
                        col.map(b => (b.id === blockId ? ({ ...b, ...updates } as EmailBlock) : b)),
                    ),
                })),
            }));
        },
        [setTemplate],
    );

    const deleteBlock = useCallback(
        (blockId: string) => {
            setTemplate(prev => {
                const newRows = prev.rows
                    .map(row => ({
                        ...row,
                        blocks: row.blocks.map(col => col.filter(b => b.id !== blockId)),
                    }))
                    .filter(row => row.blocks.some(col => col.length > 0));
                return { ...prev, rows: newRows };
            });
            setSelectedBlockId(null);
            setSelectedRowId(null);
        },
        [setTemplate],
    );

    const moveBlock = useCallback(
        (rowId: string, colIndex: number, blockId: string, direction: 'up' | 'down') => {
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
        },
        [setTemplate],
    );

    const reorderBlock = useCallback(
        (
            fromRowId: string, fromColIndex: number, fromBlockIndex: number,
            toRowId: string, toColIndex: number, toBlockIndex: number,
        ) => {
            setTemplate(prev => {
                const newRows = prev.rows.map(r => ({ ...r, blocks: r.blocks.map(col => [...col]) }));
                const fromRow = newRows.find(r => r.id === fromRowId);
                const toRow = newRows.find(r => r.id === toRowId);
                if (!fromRow || !toRow) return prev;
                const [block] = fromRow.blocks[fromColIndex].splice(fromBlockIndex, 1);
                if (!block) return prev;
                let adjustedIndex = toBlockIndex;
                if (fromRowId === toRowId && fromColIndex === toColIndex && fromBlockIndex < toBlockIndex) {
                    adjustedIndex--;
                }
                toRow.blocks[toColIndex].splice(adjustedIndex, 0, block);
                return { ...prev, rows: newRows.filter(r => r.blocks.some(col => col.length > 0)) };
            });
        },
        [setTemplate],
    );

    const insertBlock = useCallback(
        (rowId: string, colIndex: number, index: number, block: EmailBlock) => {
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
        },
        [setTemplate],
    );

    const getSelectedBlock = useCallback(
        (template: EmailTemplate): EmailBlock | null => {
            if (!selectedBlockId) return null;
            for (const row of template.rows) {
                for (const col of row.blocks) {
                    const block = col.find(b => b.id === selectedBlockId);
                    if (block) return block;
                }
            }
            return null;
        },
        [selectedBlockId],
    );

    return {
        selectedBlockId, setSelectedBlockId,
        selectedRowId, setSelectedRowId,
        addBlockToRow, addBlockToCanvas,
        updateBlock, deleteBlock,
        moveBlock, reorderBlock, insertBlock,
        getSelectedBlock,
    };
}