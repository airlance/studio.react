import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TimerRenderer } from '@/components/email-builder/blocks/timer/Renderer';
import { TimerBlock } from '@/types/email-builder';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFutureDeadline(daysFromNow = 10): string {
    const d = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const BASE_BLOCK: TimerBlock = {
    id: 'timer-1',
    type: 'timer',
    deadline: makeFutureDeadline(),
    bgColor: '#0F172A',
    digitBgColor: '#1E293B',
    digitColor: '#FFFFFF',
    labelColor: '#94A3B8',
    separatorColor: '#475569',
    align: 'center',
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    labels: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
};

function separatorsIn(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>('span')).filter(
        (s) => s.textContent === ':',
    );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('TimerRenderer', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    describe('unit labels', () => {
        it('renders all four labels when every unit is enabled', () => {
            render(<TimerRenderer block={BASE_BLOCK} />);
            expect(screen.getByText('Days')).toBeInTheDocument();
            expect(screen.getByText('Hours')).toBeInTheDocument();
            expect(screen.getByText('Minutes')).toBeInTheDocument();
            expect(screen.getByText('Seconds')).toBeInTheDocument();
        });

        it('hides disabled units', () => {
            render(
                <TimerRenderer block={{ ...BASE_BLOCK, showDays: false, showSeconds: false }} />,
            );
            expect(screen.queryByText('Days')).not.toBeInTheDocument();
            expect(screen.queryByText('Seconds')).not.toBeInTheDocument();
            expect(screen.getByText('Hours')).toBeInTheDocument();
            expect(screen.getByText('Minutes')).toBeInTheDocument();
        });

        it('renders nothing when all units are disabled', () => {
            const { container } = render(
                <TimerRenderer
                    block={{
                        ...BASE_BLOCK,
                        showDays: false,
                        showHours: false,
                        showMinutes: false,
                        showSeconds: false,
                    }}
                />,
            );
            expect(separatorsIn(container)).toHaveLength(0);
            expect(screen.queryByText('Days')).not.toBeInTheDocument();
        });
    });

    describe('separators', () => {
        it('renders 3 separators for 4 units (units − 1)', () => {
            const { container } = render(<TimerRenderer block={BASE_BLOCK} />);
            expect(separatorsIn(container)).toHaveLength(3);
        });

        it('renders 1 separator for 2 units', () => {
            const { container } = render(
                <TimerRenderer
                    block={{ ...BASE_BLOCK, showDays: false, showSeconds: false }}
                />,
            );
            expect(separatorsIn(container)).toHaveLength(1);
        });

        it('renders no separator when only one unit is visible', () => {
            const { container } = render(
                <TimerRenderer
                    block={{
                        ...BASE_BLOCK,
                        showHours: false,
                        showMinutes: false,
                        showSeconds: false,
                    }}
                />,
            );
            expect(separatorsIn(container)).toHaveLength(0);
        });
    });

    describe('past deadline', () => {
        it('shows zeroed digits when deadline has passed', () => {
            render(<TimerRenderer block={{ ...BASE_BLOCK, deadline: '2000-01-01T00:00' }} />);
            const zeros = screen.getAllByText('00');
            // 4 units × 1 digit box each
            expect(zeros.length).toBeGreaterThanOrEqual(4);
        });
    });

    describe('React key correctness', () => {
        it('does not emit React key-related warnings when rendering a list of units', () => {
            render(<TimerRenderer block={BASE_BLOCK} />);
            const keyWarnings = consoleErrorSpy.mock.calls.filter(
                (args) =>
                    typeof args[0] === 'string' &&
                    args[0].toLowerCase().includes('key'),
            );
            expect(keyWarnings).toHaveLength(0);
        });
    });

    describe('custom labels', () => {
        it('renders custom unit label text', () => {
            render(
                <TimerRenderer
                    block={{
                        ...BASE_BLOCK,
                        showHours: false,
                        showMinutes: false,
                        showSeconds: false,
                        labels: { ...BASE_BLOCK.labels, days: 'Дней' },
                    }}
                />,
            );
            expect(screen.getByText('Дней')).toBeInTheDocument();
        });
    });
});