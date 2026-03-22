import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { ImageContextMenu } from '@/components/email-builder/ImageContextMenu';
import { ImageBlock, TextBlock } from '@/types/email-builder';
import * as aiImageMock from '@/utils/aiImageMock';

vi.mock('@/utils/aiImageMock', () => ({
    mockRemoveBackground: vi.fn(),
}));

describe('ImageContextMenu', () => {
    beforeAll(() => {
        if (typeof window.DOMRect === 'undefined') {
            window.DOMRect = {
                fromRect: () => ({
                    top: 0, left: 0, bottom: 0, right: 0,
                    width: 0, height: 0, x: 0, y: 0,
                    toJSON: () => {},
                }),
            } as unknown as typeof DOMRect;
        }

        window.HTMLElement.prototype.getBoundingClientRect = () => ({
            bottom: 0, left: 0, right: 0, top: 0,
            width: 0, height: 0, x: 0, y: 0,
            toJSON: () => {},
        });

        class MockPointerEvent extends Event {
            button: number;
            ctrlKey: boolean;
            pointerType: string;
            constructor(type: string, props: PointerEventInit = {}) {
                super(type, props);
                this.button = props.button ?? 0;
                this.ctrlKey = props.ctrlKey ?? false;
                this.pointerType = props.pointerType ?? 'mouse';
            }
        }
        window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
    });

    const defaultBlock: ImageBlock = {
        id: 'img1',
        type: 'image',
        src: 'test.jpg',
        alt: '',
        width: 100,
        align: 'center',
    };

    const onUpdateMock = vi.fn();
    const onTriggerEditMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders children but no menu for non-image blocks', () => {
        const textBlock: TextBlock = {
            id: 't1',
            type: 'text',
            content: 'hello',
            fontSize: 16,
            color: '#000',
            align: 'left',
        };
        render(
            <ImageContextMenu
                block={textBlock}
                onUpdate={onUpdateMock}
                onTriggerEdit={onTriggerEditMock}
            >
                <div data-testid="child">content</div>
            </ImageContextMenu>,
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
        fireEvent.contextMenu(screen.getByTestId('child'));
        expect(screen.queryByText('Edit & AI Magic')).not.toBeInTheDocument();
    });

    it('opens context menu on right click for image block', async () => {
        render(
            <ImageContextMenu
                block={defaultBlock}
                onUpdate={onUpdateMock}
                onTriggerEdit={onTriggerEditMock}
            >
                <div data-testid="child">content</div>
            </ImageContextMenu>,
        );
        fireEvent.contextMenu(screen.getByTestId('child'));
        expect(await screen.findByText('Edit & AI Magic')).toBeInTheDocument();
        expect(screen.getByText('1-Click Remove BG')).toBeInTheDocument();
        expect(screen.getByText('Make Full Width')).toBeInTheDocument();
    });

    it('calls onTriggerEdit when Edit & AI Magic is clicked', async () => {
        render(
            <ImageContextMenu
                block={defaultBlock}
                onUpdate={onUpdateMock}
                onTriggerEdit={onTriggerEditMock}
            >
                <div data-testid="child">content</div>
            </ImageContextMenu>,
        );
        fireEvent.contextMenu(screen.getByTestId('child'));
        fireEvent.click(await screen.findByText('Edit & AI Magic'));
        expect(onTriggerEditMock).toHaveBeenCalledTimes(1);
    });

    it('calls mockRemoveBackground and onUpdate when 1-Click Remove BG is clicked', async () => {
        vi.mocked(aiImageMock.mockRemoveBackground).mockResolvedValueOnce('new-bg-removed-url.png');

        render(
            <ImageContextMenu
                block={defaultBlock}
                onUpdate={onUpdateMock}
                onTriggerEdit={onTriggerEditMock}
            >
                <div data-testid="child">content</div>
            </ImageContextMenu>,
        );
        fireEvent.contextMenu(screen.getByTestId('child'));
        fireEvent.click(await screen.findByText('1-Click Remove BG'));

        expect(aiImageMock.mockRemoveBackground).toHaveBeenCalledWith('test.jpg');
        await waitFor(() => {
            expect(onUpdateMock).toHaveBeenCalledWith({ src: 'new-bg-removed-url.png' });
        });
    });

    it('updates alignment when Align Center is clicked', async () => {
        render(
            <ImageContextMenu
                block={defaultBlock}
                onUpdate={onUpdateMock}
                onTriggerEdit={onTriggerEditMock}
            >
                <div data-testid="child">content</div>
            </ImageContextMenu>,
        );
        fireEvent.contextMenu(screen.getByTestId('child'));
        fireEvent.click(await screen.findByText('Align Center'));
        expect(onUpdateMock).toHaveBeenCalledWith({ align: 'center' });
    });

    it('sets width to 100 when Make Full Width is clicked', async () => {
        render(
            <ImageContextMenu
                block={defaultBlock}
                onUpdate={onUpdateMock}
                onTriggerEdit={onTriggerEditMock}
            >
                <div data-testid="child">content</div>
            </ImageContextMenu>,
        );
        fireEvent.contextMenu(screen.getByTestId('child'));
        fireEvent.click(await screen.findByText('Make Full Width'));
        expect(onUpdateMock).toHaveBeenCalledWith({ width: 100 });
    });
});