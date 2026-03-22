import { describe, it, expect } from 'vitest';
import { mockAiRewrite } from '@/utils/aiRewriteMock';

describe('mockAiRewrite', () => {
    it('returns shorter text when prompt includes "short"', async () => {
        const result = await mockAiRewrite('This is a very long text indeed', 'Make it shorter');
        expect(result).toBe('This is a...');
    });

    it('returns professional text when prompt includes "professional"', async () => {
        const result = await mockAiRewrite('this is awful', 'Make it professional');
        expect(result).toBe('Additionally, we have assessed that: this is awful. Please advise on the next steps.');
    });

    it('fixes spelling when prompt includes "fix" or "spell"', async () => {
        const result = await mockAiRewrite('teh dog don;t bite', 'Fix spelling');
        expect(result).toBe('the dog don\'t bite');
    });

    it('returns generic text otherwise', async () => {
        const result = await mockAiRewrite('Hello world', 'random prompt');
        expect(result).toBe('✨ AI rewritten version of: "Hello world" ✨');
    });
});
