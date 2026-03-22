import { describe, it, expect } from 'vitest';
import { exportSurveyHtml } from '@/components/email-builder/blocks/survey/exportHtml';
import { SurveyBlock } from '@/types/email-builder';

const baseBlock: SurveyBlock = {
    id: 'survey-1',
    type: 'survey',
    surveyType: 'stars',
    question: 'How did we do?',
    baseUrl: 'https://example.com/rate?r=',
    starCount: 5,
    starColor: '#F59E0B',
    textColor: '#0F172A',
    labelLow: 'Not likely',
    labelHigh: 'Very likely',
    align: 'center',
};

describe('exportSurveyHtml', () => {
    describe('stars mode', () => {
        it('renders the question text', () => {
            const html = exportSurveyHtml(baseBlock, 'Arial');
            expect(html).toContain('How did we do?');
        });

        it('renders the correct number of star links', () => {
            const html = exportSurveyHtml(baseBlock, 'Arial');
            // Each star is a link with rating appended
            expect(html).toContain('?r=1');
            expect(html).toContain('?r=5');
            expect(html).not.toContain('?r=6');
        });

        it('uses the star color from block config', () => {
            const html = exportSurveyHtml(baseBlock, 'Arial');
            expect(html).toContain('#F59E0B');
        });

        it('renders star unicode character', () => {
            const html = exportSurveyHtml(baseBlock, 'Arial');
            expect(html).toContain('&#9733;');
        });

        it('respects custom starCount', () => {
            const html = exportSurveyHtml({ ...baseBlock, starCount: 3 }, 'Arial');
            expect(html).toContain('?r=3');
            expect(html).not.toContain('?r=4');
        });
    });

    describe('nps mode', () => {
        const npsBlock: SurveyBlock = { ...baseBlock, surveyType: 'nps' };

        it('renders 11 rating links (0–10)', () => {
            const html = exportSurveyHtml(npsBlock, 'Arial');
            for (let i = 0; i <= 10; i++) {
                expect(html).toContain(`?r=${i}`);
            }
        });

        it('renders low and high labels', () => {
            const html = exportSurveyHtml(npsBlock, 'Arial');
            expect(html).toContain('Not likely');
            expect(html).toContain('Very likely');
        });

        it('does not render star unicode', () => {
            const html = exportSurveyHtml(npsBlock, 'Arial');
            expect(html).not.toContain('&#9733;');
        });
    });

    describe('thumbs mode', () => {
        const thumbsBlock: SurveyBlock = { ...baseBlock, surveyType: 'thumbs' };

        it('renders thumbs up and down emoji links', () => {
            const html = exportSurveyHtml(thumbsBlock, 'Arial');
            expect(html).toContain('👍');
            expect(html).toContain('👎');
            expect(html).toContain('?r=up');
            expect(html).toContain('?r=down');
        });
    });

    describe('alignment', () => {
        it('uses left align when specified', () => {
            const html = exportSurveyHtml({ ...baseBlock, align: 'left' }, 'Arial');
            expect(html).toContain('text-align:left');
        });

        it('uses right align when specified', () => {
            const html = exportSurveyHtml({ ...baseBlock, align: 'right' }, 'Arial');
            expect(html).toContain('text-align:right');
        });
    });

    describe('question', () => {
        it('skips question row when question is empty', () => {
            const html = exportSurveyHtml({ ...baseBlock, question: '' }, 'Arial');
            expect(html).not.toContain('font-weight:600');
        });
    });
});