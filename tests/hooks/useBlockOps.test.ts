import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useBlockOps } from '@/hooks/useBlockOps';
import { EmailTemplate } from '@/types/email-builder';

const emptyTemplate: EmailTemplate = {
    rows: [],
    bgColor: '#fff',
    contentWidth: 600,
    fontFamily: 'Arial',
};

describe('useBlockOps', () => {
    it('starts with no selection', () => {
        const setTemplate = vi.fn();
        const { result } = renderHook(() => useBlockOps(setTemplate));
        expect(result.current.selectedBlockId).toBeNull();
        expect(result.current.selectedRowId).toBeNull();
    });

    it('addBlockToCanvas calls setTemplate and sets selection', () => {
        const calls: unknown[] = [];
        const setTemplate = vi.fn((updater) => calls.push(updater));
        const { result } = renderHook(() => useBlockOps(setTemplate));

        act(() => {
            result.current.addBlockToCanvas('heading');
        });

        expect(setTemplate).toHaveBeenCalledOnce();
        expect(result.current.selectedBlockId).not.toBeNull();
        expect(result.current.selectedRowId).not.toBeNull();
    });

    it('addBlockToRow adds to the correct column', () => {
        const setTemplate = vi.fn();
        const { result } = renderHook(() => useBlockOps(setTemplate));

        act(() => {
            result.current.addBlockToRow('row-1', 2, 'button');
        });

        const updater = setTemplate.mock.calls[0][0] as (prev: EmailTemplate) => EmailTemplate;
        const before: EmailTemplate = {
            ...emptyTemplate,
            rows: [{ id: 'row-1', columns: 3, blocks: [[], [], []] }],
        };
        const after = updater(before);
        expect(after.rows[0].blocks[2]).toHaveLength(1);
        expect(after.rows[0].blocks[2][0].type).toBe('button');
    });

    it('updateBlock patches only the matching block', () => {
        const setTemplate = vi.fn();
        const { result } = renderHook(() => useBlockOps(setTemplate));

        act(() => { result.current.updateBlock('b1', { color: '#ff0000' } as any); });

        const updater = setTemplate.mock.calls[0][0] as (prev: EmailTemplate) => EmailTemplate;
        const before: EmailTemplate = {
            ...emptyTemplate,
            rows: [{
                id: 'r1', columns: 1,
                blocks: [[
                    { id: 'b1', type: 'heading', content: 'Hi', level: 'h1', color: '#000', align: 'left' },
                    { id: 'b2', type: 'heading', content: 'There', level: 'h2', color: '#000', align: 'left' },
                ]],
            }],
        };
        const after = updater(before);
        expect((after.rows[0].blocks[0][0] as any).color).toBe('#ff0000');
        expect((after.rows[0].blocks[0][1] as any).color).toBe('#000');
    });

    it('deleteBlock removes block and clears selection', () => {
        const setTemplate = vi.fn();
        const { result } = renderHook(() => useBlockOps(setTemplate));

        act(() => { result.current.deleteBlock('b1'); });

        expect(result.current.selectedBlockId).toBeNull();
        expect(result.current.selectedRowId).toBeNull();

        const updater = setTemplate.mock.calls[0][0] as (prev: EmailTemplate) => EmailTemplate;
        const before: EmailTemplate = {
            ...emptyTemplate,
            rows: [{
                id: 'r1', columns: 1,
                blocks: [[
                    { id: 'b1', type: 'spacer', height: 16 },
                ]],
            }],
        };
        const after = updater(before);
        // Row is removed because it becomes empty
        expect(after.rows).toHaveLength(0);
    });

    it('getSelectedBlock returns null when nothing selected', () => {
        const setTemplate = vi.fn();
        const { result } = renderHook(() => useBlockOps(setTemplate));
        expect(result.current.getSelectedBlock(emptyTemplate)).toBeNull();
    });

    it('reorderBlock moves block between rows and cleans empty rows', () => {
        const captured: ((prev: EmailTemplate) => EmailTemplate)[] = [];
        const setTemplate = vi.fn((updater) => captured.push(updater));
        const { result } = renderHook(() => useBlockOps(setTemplate));

        act(() => {
            result.current.reorderBlock('r1', 0, 0, 'r2', 0, 0);
        });

        const before: EmailTemplate = {
            ...emptyTemplate,
            rows: [
                { id: 'r1', columns: 1, blocks: [[{ id: 'b1', type: 'spacer', height: 8 }]] },
                { id: 'r2', columns: 1, blocks: [[{ id: 'b2', type: 'spacer', height: 16 }]] },
            ],
        };
        const after = captured[0](before);
        // r1 is now empty and removed
        expect(after.rows).toHaveLength(1);
        expect(after.rows[0].id).toBe('r2');
        expect(after.rows[0].blocks[0]).toHaveLength(2);
        expect(after.rows[0].blocks[0][0].id).toBe('b1');
    });
});