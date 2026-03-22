import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ContextMenu } from '@/components/email-builder/inline-editor/Toolbar';

describe('InlineEditor ContextMenu', () => {
    const baseProps = {
        state: { show: true, x: 40, y: 40 },
        onClose: vi.fn(),
        onOpenPersonalization: vi.fn(),
        onOpenConditional: vi.fn(),
    };

    it('renders link-specific action when contextType is link', () => {
        const onUnlink = vi.fn();
        render(
            <ContextMenu
                {...baseProps}
                contextType="link"
                onUnlink={onUnlink}
            />,
        );

        const button = screen.getByText('Remove link');
        fireEvent.mouseDown(button);
        expect(onUnlink).toHaveBeenCalled();
    });

    it('renders chip-specific actions when contextType is chip', () => {
        const onRemoveChip = vi.fn();
        const onConvertChipToText = vi.fn();
        render(
            <ContextMenu
                {...baseProps}
                contextType="chip"
                onRemoveChip={onRemoveChip}
                onConvertChipToText={onConvertChipToText}
            />,
        );

        fireEvent.mouseDown(screen.getByText('Convert to plain text'));
        fireEvent.mouseDown(screen.getByText('Remove chip'));

        expect(onConvertChipToText).toHaveBeenCalled();
        expect(onRemoveChip).toHaveBeenCalled();
    });
});
