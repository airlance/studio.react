import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTemplateHistory } from '@/hooks/useTemplateHistory';
import { EmailTemplate } from '@/types/email-builder';

const makeTemplate = (bgColor = '#ffffff'): EmailTemplate => ({
    rows: [],
    bgColor,
    contentWidth: 600,
    fontFamily: 'Arial',
});

describe('useTemplateHistory', () => {
    it('initialises with default template when none provided', () => {
        const { result } = renderHook(() => useTemplateHistory());
        expect(result.current.template.rows).toHaveLength(0);
        expect(result.current.canUndo).toBe(false);
        expect(result.current.canRedo).toBe(false);
    });

    it('records undo history on setTemplate', () => {
        const { result } = renderHook(() => useTemplateHistory(makeTemplate('#aaa')));

        act(() => {
            result.current.setTemplate(makeTemplate('#bbb'));
        });

        expect(result.current.template.bgColor).toBe('#bbb');
        expect(result.current.canUndo).toBe(true);
        expect(result.current.canRedo).toBe(false);
    });

    it('restores previous state on undo', () => {
        const { result } = renderHook(() => useTemplateHistory(makeTemplate('#aaa')));

        act(() => {
            result.current.setTemplate(makeTemplate('#bbb'));
        });
        act(() => {
            result.current.undo();
        });

        expect(result.current.template.bgColor).toBe('#aaa');
        expect(result.current.canUndo).toBe(false);
        expect(result.current.canRedo).toBe(true);
    });

    it('restores redone state on redo', () => {
        const { result } = renderHook(() => useTemplateHistory(makeTemplate('#aaa')));

        act(() => { result.current.setTemplate(makeTemplate('#bbb')); });
        act(() => { result.current.undo(); });
        act(() => { result.current.redo(); });

        expect(result.current.template.bgColor).toBe('#bbb');
        expect(result.current.canRedo).toBe(false);
    });

    it('clears redo stack when a new change is made after undo', () => {
        const { result } = renderHook(() => useTemplateHistory(makeTemplate('#aaa')));

        act(() => { result.current.setTemplate(makeTemplate('#bbb')); });
        act(() => { result.current.undo(); });
        act(() => { result.current.setTemplate(makeTemplate('#ccc')); });

        expect(result.current.canRedo).toBe(false);
        expect(result.current.template.bgColor).toBe('#ccc');
    });

    it('supports functional updater form', () => {
        const { result } = renderHook(() => useTemplateHistory(makeTemplate('#aaa')));

        act(() => {
            result.current.setTemplate(prev => ({ ...prev, bgColor: '#ddd', contentWidth: prev.contentWidth + 100 }));
        });

        expect(result.current.template.bgColor).toBe('#ddd');
        expect(result.current.template.contentWidth).toBe(700);
    });

    it('does not crash when undo called with empty stack', () => {
        const { result } = renderHook(() => useTemplateHistory());
        expect(() => act(() => { result.current.undo(); })).not.toThrow();
    });

    it('does not crash when redo called with empty stack', () => {
        const { result } = renderHook(() => useTemplateHistory());
        expect(() => act(() => { result.current.redo(); })).not.toThrow();
    });
});