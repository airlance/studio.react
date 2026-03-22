import { describe, expect, it } from 'vitest';
import { exportToHtml } from '@/utils/exportHtml';
import { EmailTemplate } from '@/types/email-builder';

describe('exportToHtml', () => {
    it('renders a full html document with basic blocks', () => {
        const template: EmailTemplate = {
            rows: [
                {
                    id: 'row-1',
                    columns: 1,
                    blocks: [[
                        {
                            id: 'h-1',
                            type: 'heading',
                            content: 'Hello',
                            level: 'h2',
                            color: '#111111',
                            align: 'left',
                        },
                        {
                            id: 't-1',
                            type: 'text',
                            content: 'World',
                            fontSize: 16,
                            color: '#222222',
                            align: 'left',
                        },
                    ]],
                },
            ],
            bgColor: '#F8FAFC',
            contentWidth: 600,
            fontFamily: 'Arial, Helvetica, sans-serif',
        };

        const html = exportToHtml(template);
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('<h2');
        expect(html).toContain('Hello');
        expect(html).toContain('World');
    });

    it('renders social icons from config and conditional tags', () => {
        const template: EmailTemplate = {
            rows: [
                {
                    id: 'row-1',
                    columns: 1,
                    blocks: [[
                        {
                            id: 's-1',
                            type: 'social',
                            links: [{ id: 'link-1', network: 'facebook', url: 'https://facebook.com/acme' }],
                            iconSize: 24,
                            iconColor: 'brand',
                            customColor: '#000000',
                            align: 'center',
                            gap: 12,
                        },
                        {
                            id: 'c-1',
                            type: 'conditional',
                            variable: 'first_name',
                            operator: 'equals',
                            value: 'John',
                            ifBlocks: [{
                                id: 'if-text',
                                type: 'text',
                                content: 'If branch',
                                fontSize: 16,
                                color: '#000000',
                                align: 'left',
                            }],
                            elseBlocks: [{
                                id: 'else-text',
                                type: 'text',
                                content: 'Else branch',
                                fontSize: 16,
                                color: '#000000',
                                align: 'left',
                            }],
                        },
                    ]],
                },
            ],
            bgColor: '#FFFFFF',
            contentWidth: 600,
            fontFamily: 'Arial, Helvetica, sans-serif',
        };

        const html = exportToHtml(template);
        expect(html).toContain('stroke="#1877F2"');
        expect(html).toContain('{{#ifEquals first_name "John"}}');
        expect(html).toContain('{{else}}');
        expect(html).toContain('{{/ifEquals}}');
    });

    it('injects Google Fonts link when selected font is from Google', () => {
        const template: EmailTemplate = {
            rows: [],
            bgColor: '#FFFFFF',
            contentWidth: 600,
            fontFamily: "'Roboto', Arial, Helvetica, sans-serif",
        };

        const html = exportToHtml(template);
        expect(html).toContain('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
    });

    it('skips Google Fonts links when includeGoogleFonts is false', () => {
        const template: EmailTemplate = {
            rows: [],
            bgColor: '#FFFFFF',
            contentWidth: 600,
            fontFamily: "'Roboto', Arial, Helvetica, sans-serif",
        };

        const html = exportToHtml(template, { includeGoogleFonts: false });
        expect(html).not.toContain('fonts.googleapis.com');
        expect(html).not.toContain('fonts.gstatic.com');
    });
});
