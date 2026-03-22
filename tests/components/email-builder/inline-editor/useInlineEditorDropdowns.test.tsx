import { createRef } from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useInlineEditorDropdowns } from '@/components/email-builder/inline-editor/useInlineEditorDropdowns';

describe('useInlineEditorDropdowns', () => {
    it('opens and closes context menu with mirrored ref state', () => {
        const editorRef = createRef<HTMLElement>();
        const { result } = renderHook(() => useInlineEditorDropdowns({ editorRef }));

        act(() => {
            result.current.openContextMenu(100, 120);
        });

        expect(result.current.contextMenu.show).toBe(true);
        expect(result.current.contextMenu.x).toBe(100);
        expect(result.current.contextMenuRef.current).toBe(true);

        act(() => {
            result.current.closeContextMenu();
        });

        expect(result.current.contextMenu.show).toBe(false);
        expect(result.current.contextMenuRef.current).toBe(false);
    });

    it('opens personalization anchored to context menu', () => {
        const editorRef = createRef<HTMLElement>();
        const { result } = renderHook(() => useInlineEditorDropdowns({ editorRef }));

        act(() => {
            result.current.openContextMenu(40, 60);
        });

        act(() => {
            result.current.openPersonalizationFromContextMenu();
        });

        expect(result.current.showPersonalization).toBe(true);
        expect(result.current.persAnchor).toEqual({ x: 40, y: 68 });
    });

    it('closes all floating overlays in one call', () => {
        const editorRef = createRef<HTMLElement>();
        const { result } = renderHook(() => useInlineEditorDropdowns({ editorRef }));

        act(() => {
            result.current.openContextMenu(20, 20);
            result.current.openPersonalizationAt({ x: 20, y: 40 });
            result.current.openConditionalAt({ x: 20, y: 50 });
        });

        act(() => {
            result.current.closeAllFloating();
        });

        expect(result.current.contextMenu.show).toBe(false);
        expect(result.current.showPersonalization).toBe(false);
        expect(result.current.showConditional).toBe(false);
        expect(result.current.persAnchor).toBeNull();
        expect(result.current.condAnchor).toBeNull();
    });
});
