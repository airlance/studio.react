import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useEmailBuilder } from '@/hooks/useEmailBuilder';

describe('useEmailBuilder', () => {
    it('adds a row and supports undo/redo', () => {
        const { result } = renderHook(() => useEmailBuilder());

        act(() => {
            result.current.addRow(1);
        });

        expect(result.current.template.rows).toHaveLength(1);
        expect(result.current.canUndo).toBe(true);

        act(() => {
            result.current.undo();
        });

        expect(result.current.template.rows).toHaveLength(0);
        expect(result.current.canRedo).toBe(true);

        act(() => {
            result.current.redo();
        });

        expect(result.current.template.rows).toHaveLength(1);
    });

    it('removes empty row when deleting last block', () => {
        const { result } = renderHook(() => useEmailBuilder());

        act(() => {
            result.current.addBlockToCanvas('heading');
        });

        const row = result.current.template.rows[0];
        const blockId = row.blocks[0][0].id;

        act(() => {
            result.current.deleteBlock(blockId);
        });

        expect(result.current.template.rows).toHaveLength(0);
        expect(result.current.selectedBlockId).toBeNull();
        expect(result.current.selectedRowId).toBeNull();
    });

    it('reorders block between rows', () => {
        const { result } = renderHook(() => useEmailBuilder());

        act(() => {
            result.current.addRow(1);
            result.current.addRow(1);
        });

        const firstRowId = result.current.template.rows[0].id;
        const secondRowId = result.current.template.rows[1].id;

        act(() => {
            result.current.addBlockToRow(firstRowId, 0, 'heading');
            result.current.addBlockToRow(secondRowId, 0, 'text');
        });

        act(() => {
            result.current.reorderBlock(firstRowId, 0, 0, secondRowId, 0, 1);
        });

        expect(result.current.template.rows).toHaveLength(1);
        expect(result.current.template.rows[0].id).toBe(secondRowId);
        expect(result.current.template.rows[0].blocks[0]).toHaveLength(2);
        expect(result.current.template.rows[0].blocks[0][1].type).toBe('heading');
    });
});
