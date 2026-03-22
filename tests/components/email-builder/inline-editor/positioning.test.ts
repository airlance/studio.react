import { describe, expect, it } from 'vitest';
import { clampFloatingPoint, clampValue } from '@/components/email-builder/inline-editor/positioning';

describe('inline-editor positioning', () => {
    it('clamps scalar value to range', () => {
        expect(clampValue(5, 10, 20)).toBe(10);
        expect(clampValue(30, 10, 20)).toBe(20);
        expect(clampValue(15, 10, 20)).toBe(15);
    });

    it('keeps floating element inside viewport bounds', () => {
        const result = clampFloatingPoint(
            { x: 760, y: 580 },
            { width: 260, height: 120 },
            8,
            { width: 800, height: 600 },
        );

        expect(result.x).toBe(532);
        expect(result.y).toBe(472);
    });

    it('uses margin as fallback when floating size exceeds viewport', () => {
        const result = clampFloatingPoint(
            { x: -100, y: -100 },
            { width: 1200, height: 900 },
            8,
            { width: 800, height: 600 },
        );

        expect(result.x).toBe(8);
        expect(result.y).toBe(8);
    });
});
