import { createRef } from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useInlineEditorKeyboard } from '@/components/email-builder/inline-editor/useInlineEditorKeyboard';

function createEvent(overrides: Partial<React.KeyboardEvent> = {}) {
    return {
        key: '',
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        ...overrides,
    } as unknown as React.KeyboardEvent;
}

describe('useInlineEditorKeyboard', () => {
    it('opens personalization on Ctrl+Space', () => {
        const editorEl = document.createElement('div');
        editorEl.getBoundingClientRect = () => ({
            left: 12,
            right: 100,
            top: 4,
            bottom: 24,
            width: 88,
            height: 20,
            x: 12,
            y: 4,
            toJSON: () => ({}),
        });
        const editorRef = { current: editorEl } as React.MutableRefObject<HTMLElement | null>;

        const openPersonalizationAt = vi.fn();
        const closeContextMenu = vi.fn();

        const { result } = renderHook(() => useInlineEditorKeyboard({
            editorRef,
            savedRangeRef: { current: null },
            selectedChipRef: { current: null },
            updateToolbar: vi.fn(),
            syncContent: vi.fn(),
            clearSelectedChip: vi.fn(),
            closeContextMenu,
            openPersonalizationAt,
            closeAllFloating: vi.fn(),
            setShowPersonalization: vi.fn(),
        }));

        const event = createEvent({ key: ' ', ctrlKey: true });
        act(() => {
            result.current(event);
        });

        expect(event.preventDefault).toHaveBeenCalled();
        expect(closeContextMenu).toHaveBeenCalled();
        expect(openPersonalizationAt).toHaveBeenCalledWith({ x: 12, y: 32 });
    });

    it('closes floating overlays on Escape', () => {
        const closeAllFloating = vi.fn();
        const clearSelectedChip = vi.fn();

        const { result } = renderHook(() => useInlineEditorKeyboard({
            editorRef: createRef<HTMLElement>(),
            savedRangeRef: { current: null },
            selectedChipRef: { current: null },
            updateToolbar: vi.fn(),
            syncContent: vi.fn(),
            clearSelectedChip,
            closeContextMenu: vi.fn(),
            openPersonalizationAt: vi.fn(),
            closeAllFloating,
            setShowPersonalization: vi.fn(),
        }));

        const event = createEvent({ key: 'Escape' });
        act(() => {
            result.current(event);
        });

        expect(closeAllFloating).toHaveBeenCalled();
        expect(clearSelectedChip).toHaveBeenCalled();
    });

    it('removes selected chip and syncs content on Delete', () => {
        const parent = document.createElement('div');
        const chip = document.createElement('span');
        parent.appendChild(chip);

        const selectedChipRef = { current: chip };
        const syncContent = vi.fn();
        const event = createEvent({ key: 'Delete' });

        const { result } = renderHook(() => useInlineEditorKeyboard({
            editorRef: createRef<HTMLElement>(),
            savedRangeRef: { current: null },
            selectedChipRef,
            updateToolbar: vi.fn(),
            syncContent,
            clearSelectedChip: vi.fn(),
            closeContextMenu: vi.fn(),
            openPersonalizationAt: vi.fn(),
            closeAllFloating: vi.fn(),
            setShowPersonalization: vi.fn(),
        }));

        act(() => {
            result.current(event);
        });

        expect(event.preventDefault).toHaveBeenCalled();
        expect(parent.childNodes.length).toBe(0);
        expect(selectedChipRef.current).toBeNull();
        expect(syncContent).toHaveBeenCalled();
    });
});
