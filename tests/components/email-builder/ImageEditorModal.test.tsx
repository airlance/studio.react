import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ImageEditorModal } from '@/components/email-builder/ImageEditorModal';
import * as aiImageMock from '@/utils/aiImageMock';

vi.mock('@/utils/aiImageMock', () => ({
    mockRemoveBackground: vi.fn(),
    mockAIUpscale: vi.fn(),
}));

describe('ImageEditorModal', () => {
    const onOpenChangeMock = vi.fn();
    const onSaveMock = vi.fn();

    beforeAll(() => {
        // JSDOM mock — HTMLCanvasElement.getContext not implemented in jsdom
        HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
            drawImage: vi.fn(),
            fillRect: vi.fn(),
            getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(400) })),
            putImageData: vi.fn(),
        })) as ReturnType<typeof vi.fn>;

        HTMLCanvasElement.prototype.toBlob = vi.fn((callback: BlobCallback) => {
            callback(new Blob(['mock data'], { type: 'image/png' }));
        });
    });

    it('renders modal content when open', () => {
        render(
            <ImageEditorModal
                open={true}
                onOpenChange={onOpenChangeMock}
                currentSrc="test.jpg"
                onSave={onSaveMock}
            />,
        );
        expect(screen.getByText('Image Editor')).toBeInTheDocument();
        expect(screen.getByText('Crop')).toBeInTheDocument();
        expect(screen.getByText('Adjust')).toBeInTheDocument();
        // Tab label is 'AI', not 'AI Magic'
        expect(screen.getByRole('button', { name: /^AI$/ })).toBeInTheDocument();
        expect(screen.getByText('Apply & Save')).toBeInTheDocument();
    });

    it('shows crop instructions on initial render', () => {
        render(
            <ImageEditorModal
                open={true}
                onOpenChange={onOpenChangeMock}
                currentSrc="test.jpg"
                onSave={onSaveMock}
            />,
        );
        expect(screen.getByText('Drag on the image to select a cropping area.')).toBeInTheDocument();
    });

    it('switches to Adjust tab and shows sliders', () => {
        render(
            <ImageEditorModal
                open={true}
                onOpenChange={onOpenChangeMock}
                currentSrc="test.jpg"
                onSave={onSaveMock}
            />,
        );
        fireEvent.click(screen.getByText('Adjust'));
        expect(screen.getByText('Brightness')).toBeInTheDocument();
        expect(screen.getByText('Contrast')).toBeInTheDocument();
        expect(screen.getByText('Saturation')).toBeInTheDocument();
        expect(screen.getByText('Blur')).toBeInTheDocument();
    });

    it('switches to AI tab and shows AI tools', () => {
        render(
            <ImageEditorModal
                open={true}
                onOpenChange={onOpenChangeMock}
                currentSrc="test.jpg"
                onSave={onSaveMock}
            />,
        );
        // Tab label is 'AI', not 'AI Magic'
        fireEvent.click(screen.getByRole('button', { name: /^AI$/ }));
        expect(screen.getByText('Remove Background')).toBeInTheDocument();
        expect(screen.getByText('AI Upscale')).toBeInTheDocument();
    });

    it('calls mockRemoveBackground when Remove Background is clicked in AI tab', async () => {
        vi.mocked(aiImageMock.mockRemoveBackground).mockResolvedValueOnce('ai-removed.png');

        render(
            <ImageEditorModal
                open={true}
                onOpenChange={onOpenChangeMock}
                currentSrc="test.jpg"
                onSave={onSaveMock}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: /^AI$/ }));
        fireEvent.click(screen.getByText('Remove Background'));

        expect(aiImageMock.mockRemoveBackground).toHaveBeenCalledWith('test.jpg');
        await waitFor(() => {
            expect(screen.getByText('Remove Background')).toBeInTheDocument();
        });
    });

    it('calls mockAIUpscale when AI Upscale is clicked in AI tab', async () => {
        vi.mocked(aiImageMock.mockAIUpscale).mockResolvedValueOnce('ai-upscaled.png');

        render(
            <ImageEditorModal
                open={true}
                onOpenChange={onOpenChangeMock}
                currentSrc="test.jpg"
                onSave={onSaveMock}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: /^AI$/ }));
        fireEvent.click(screen.getByText('AI Upscale'));

        expect(aiImageMock.mockAIUpscale).toHaveBeenCalledWith('test.jpg');
        await waitFor(() => {
            expect(screen.getByText('AI Upscale')).toBeInTheDocument();
        });
    });

    it('disables Apply & Save button in Stock tab', () => {
        render(
            <ImageEditorModal
                open={true}
                onOpenChange={onOpenChangeMock}
                currentSrc="test.jpg"
                onSave={onSaveMock}
            />,
        );
        fireEvent.click(screen.getByText('Stock'));
        expect(screen.getByText('Select image to apply')).toBeInTheDocument();
        expect(screen.getByText('Select image to apply').closest('button')).toBeDisabled();
    });
});