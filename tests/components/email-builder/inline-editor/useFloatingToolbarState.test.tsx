import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useFloatingToolbarState } from '@/components/email-builder/inline-editor/useFloatingToolbarState';
import * as formatting from '@/components/email-builder/inline-editor/formatting';

describe('useFloatingToolbarState', () => {
    beforeEach(() => {
        // Stub all query helpers from the formatting module
        vi.spyOn(formatting, 'queryBold').mockReturnValue(true);
        vi.spyOn(formatting, 'queryItalic').mockReturnValue(false);
        vi.spyOn(formatting, 'queryUnderline').mockReturnValue(false);
        vi.spyOn(formatting, 'queryStrikethrough').mockReturnValue(false);
        vi.spyOn(formatting, 'queryOrderedList').mockReturnValue(true);
        vi.spyOn(formatting, 'queryUnorderedList').mockReturnValue(false);
        vi.spyOn(formatting, 'queryAlignLeft').mockReturnValue(false);
        vi.spyOn(formatting, 'queryAlignCenter').mockReturnValue(true);
        vi.spyOn(formatting, 'queryAlignRight').mockReturnValue(false);
        vi.spyOn(formatting, 'queryAlignJustify').mockReturnValue(false);
        vi.spyOn(formatting, 'queryLink').mockReturnValue(false);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('hides toolbar when selection is collapsed', () => {
        const editorEl = document.createElement('div');
        const mockSelection = { isCollapsed: true, anchorNode: editorEl, rangeCount: 1, getRangeAt: () => ({}) };
        vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as unknown as Selection);

        const editorRef = { current: editorEl };
        const savedRangeRef = { current: null };
        const showPersonalizationRef = { current: false };
        const showConditionalRef = { current: false };

        const { result } = renderHook(() => useFloatingToolbarState({
            editorRef, savedRangeRef, showPersonalizationRef, showConditionalRef,
        } as any));

        act(() => { result.current.updateToolbar(); });

        expect(result.current.toolbar.show).toBe(false);
    });

    it('shows toolbar and reads formatting state from formatting module', () => {
        const editorEl = document.createElement('div');

        const mockRange = {
            getBoundingClientRect: () => ({ left: 100, top: 100, width: 50, height: 20 }),
            cloneRange: () => ({}),
        };
        const mockSelection = {
            isCollapsed: false,
            anchorNode: editorEl,
            rangeCount: 1,
            getRangeAt: () => mockRange,
        };
        vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as unknown as Selection);

        const editorRef = { current: editorEl };
        const savedRangeRef = { current: null };
        const showPersonalizationRef = { current: false };
        const showConditionalRef = { current: false };

        const { result } = renderHook(() => useFloatingToolbarState({
            editorRef, savedRangeRef, showPersonalizationRef, showConditionalRef,
        } as any));

        act(() => { result.current.updateToolbar(); });

        expect(result.current.toolbar.show).toBe(true);
        expect(result.current.toolbar.bold).toBe(true);
        expect(result.current.toolbar.italic).toBe(false);
        expect(result.current.toolbar.orderedList).toBe(true);
        expect(result.current.toolbar.unorderedList).toBe(false);
        expect(result.current.toolbar.alignCenter).toBe(true);
        expect(result.current.toolbar.alignLeft).toBe(false);
        expect(result.current.toolbar.link).toBe(false);
    });

    it('does not update toolbar when personalization is open', () => {
        const editorEl = document.createElement('div');
        const editorRef = { current: editorEl };
        const savedRangeRef = { current: null };
        const showPersonalizationRef = { current: true }; // personalization open
        const showConditionalRef = { current: false };

        const { result } = renderHook(() => useFloatingToolbarState({
            editorRef, savedRangeRef, showPersonalizationRef, showConditionalRef,
        } as any));

        act(() => { result.current.updateToolbar(); });

        // Should remain in initial (hidden) state
        expect(result.current.toolbar.show).toBe(false);
    });

    it('saves range to savedRangeRef on update', () => {
        const editorEl = document.createElement('div');
        const clonedRange = { cloned: true };
        const mockRange = {
            getBoundingClientRect: () => ({ left: 50, top: 50, width: 40, height: 18 }),
            cloneRange: () => clonedRange,
        };
        const mockSelection = {
            isCollapsed: false,
            anchorNode: editorEl,
            rangeCount: 1,
            getRangeAt: () => mockRange,
        };
        vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as unknown as Selection);

        const editorRef = { current: editorEl };
        const savedRangeRef = { current: null as unknown };
        const showPersonalizationRef = { current: false };
        const showConditionalRef = { current: false };

        const { result } = renderHook(() => useFloatingToolbarState({
            editorRef, savedRangeRef, showPersonalizationRef, showConditionalRef,
        } as any));

        act(() => { result.current.updateToolbar(); });

        expect(savedRangeRef.current).toEqual(clonedRange);
    });
});