import { describe, expect, it } from 'vitest';
import { mockRemoveBackground, mockAIUpscale } from '@/utils/aiImageMock';

describe('aiImageMock', () => {
    it('returns formatted URL for removed background', async () => {
        const result = await mockRemoveBackground('some-url.jpg');
        expect(result).toContain('transparent');
        expect(result).toContain('AI+No+Bg');
    });

    it('returns formatted URL for upscaled image', async () => {
        const result = await mockAIUpscale('some-url.jpg');
        expect(result).toContain('1200x800');
        expect(result).toContain('Upscaled');
    });
});
