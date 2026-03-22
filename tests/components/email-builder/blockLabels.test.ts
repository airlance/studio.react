import { describe, it, expect } from 'vitest';
import { BLOCK_LABELS } from '@/components/email-builder/properties-panel/constants';
import { BlockType } from '@/types/email-builder';

// Keep this list in sync with the BlockType union in src/types/email-builder.ts
const ALL_BLOCK_TYPES: BlockType[] = [
    'heading',
    'text',
    'image',
    'button',
    'hero',
    'product-card',
    'coupon',
    'divider',
    'spacer',
    'html',
    'social',
    'conditional',
    'survey',
    'timer',
    'video',
];

describe('BLOCK_LABELS', () => {
    it('has a non-empty label for every BlockType', () => {
        for (const type of ALL_BLOCK_TYPES) {
            expect(
                BLOCK_LABELS[type],
                `BLOCK_LABELS is missing an entry for block type "${type}"`,
            ).toBeDefined();
            expect(
                BLOCK_LABELS[type].length,
                `BLOCK_LABELS["${type}"] must not be an empty string`,
            ).toBeGreaterThan(0);
        }
    });

    it('has the correct label for timer', () => {
        expect(BLOCK_LABELS['timer']).toBe('Timer');
    });

    it('has the correct label for video', () => {
        expect(BLOCK_LABELS['video']).toBe('Video');
    });

    it('does not have unknown keys that are not BlockTypes', () => {
        const knownKeys = new Set<string>(ALL_BLOCK_TYPES);
        for (const key of Object.keys(BLOCK_LABELS)) {
            expect(
                knownKeys.has(key),
                `BLOCK_LABELS has an unexpected key "${key}" that is not a BlockType`,
            ).toBe(true);
        }
    });
});