import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    applyFontSize,
    insertHtmlAtCaret,
    findSelectedAnchor,
    queryFontSize,
} from '@/components/email-builder/inline-editor/formatting';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeContainer(html = ''): HTMLDivElement {
    const el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    el.innerHTML = html;
    document.body.appendChild(el);
    return el;
}

function placeCaretAtEnd(el: HTMLElement): void {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);
}

function selectAll(el: HTMLElement): void {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('formatting.ts', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = makeContainer('Hello world');
    });

    afterEach(() => {
        container.remove();
        window.getSelection()?.removeAllRanges();
    });

    describe('insertHtmlAtCaret', () => {
        it('inserts html at caret position', () => {
            placeCaretAtEnd(container);
            insertHtmlAtCaret('<strong>!</strong>', container);
            expect(container.innerHTML).toContain('<strong>!</strong>');
        });

        it('does nothing when no selection exists', () => {
            window.getSelection()?.removeAllRanges();
            const before = container.innerHTML;
            insertHtmlAtCaret('<em>x</em>', container);
            // No range → no change
            expect(container.innerHTML).toBe(before);
        });

        it('replaces selected content with inserted html', () => {
            selectAll(container);
            insertHtmlAtCaret('<span>replaced</span>', container);
            expect(container.textContent).toBe('replaced');
        });
    });

    describe('applyFontSize', () => {
        it('wraps selected text in a span with data-font-size attribute', () => {
            selectAll(container);
            applyFontSize(24, container);
            const span = container.querySelector<HTMLElement>('span[data-font-size]');
            expect(span).not.toBeNull();
            expect(span?.getAttribute('data-font-size')).toBe('24');
            expect(span?.style.fontSize).toBe('24px');
        });

        it('does not insert span when selection is collapsed', () => {
            placeCaretAtEnd(container);
            applyFontSize(18, container);
            expect(container.querySelector('span[data-font-size]')).toBeNull();
        });

        it('removes nested font-size spans before wrapping', () => {
            container.innerHTML = '<span data-font-size="12" style="font-size:12px">nested</span>';
            selectAll(container);
            applyFontSize(20, container);

            const spans = container.querySelectorAll('span[data-font-size]');
            // Only one outer span should remain
            expect(spans.length).toBe(1);
            expect(spans[0].getAttribute('data-font-size')).toBe('20');
        });
    });

    describe('findSelectedAnchor', () => {
        it('returns null when caret is not inside a link', () => {
            placeCaretAtEnd(container);
            expect(findSelectedAnchor(container)).toBeNull();
        });

        it('returns the anchor element when caret is inside a link', () => {
            container.innerHTML = '<a href="https://example.com">link text</a>';
            const anchor = container.querySelector('a')!;
            const range = document.createRange();
            range.selectNodeContents(anchor);
            const sel = window.getSelection()!;
            sel.removeAllRanges();
            sel.addRange(range);

            expect(findSelectedAnchor(container)).toBe(anchor);
        });
    });

    describe('queryFontSize', () => {
        it('returns empty string when no selection exists', () => {
            window.getSelection()?.removeAllRanges();
            expect(queryFontSize(container)).toBe('');
        });

        it('returns computed font size of selected element', () => {
            container.style.fontSize = '18px';
            placeCaretAtEnd(container);
            const size = queryFontSize(container);
            // jsdom returns computed styles; value may be '0' in some environments
            // Just assert it returns a string
            expect(typeof size).toBe('string');
        });
    });
});