import { BlockType, EmailBlock } from '@/types/email-builder';
import { uid } from '@/utils/uid';

// Default deadline = 7 days from now, formatted for datetime-local input
function defaultDeadline(): string {
    const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // Format as YYYY-MM-DDTHH:mm (datetime-local input format)
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function createDefaultBlock(type: BlockType): EmailBlock {
    const id = uid();
    switch (type) {
        case 'heading':
            return { id, type, content: 'Heading', level: 'h1', color: '#0F172A', align: 'left' };
        case 'text':
            return { id, type, content: 'Enter your text here...', fontSize: 16, color: '#0F172A', align: 'left' };
        case 'image':
            return {
                id, type,
                src: 'https://placehold.co/600x200/e2e8f0/64748b?text=Your+Image',
                alt: 'Image', href: '', width: 100, align: 'center',
            };
        case 'button':
            return { id, type, text: 'Click Me', url: '#', bgColor: '#4F46E5', textColor: '#FFFFFF', borderRadius: 6, align: 'center' };
        case 'divider':
            return { id, type, color: '#E2E8F0', thickness: 1, style: 'solid' };
        case 'spacer':
            return { id, type, height: 24 };
        case 'html':
            return { id, type, content: '<div style="padding:16px;background:#f1f5f9;border-radius:4px;text-align:center;color:#64748b;">Your custom HTML here</div>' };
        case 'social':
            return { id, type: 'social', links: [], iconSize: 32, iconColor: 'brand', customColor: '#000000', align: 'center', gap: 12 };
        case 'conditional':
            return { id, type: 'conditional', variable: '', operator: 'is_set', value: '', ifBlocks: [], elseBlocks: [] };
        case 'hero':
            return {
                id, type,
                imageUrl: 'https://placehold.co/600x260/0F172A/FFFFFF?text=Hero+Banner',
                imageAlt: 'Hero banner',
                title: 'Launch Your Next Campaign',
                description: 'Create a high-converting email in minutes with clear messaging and a strong call to action.',
                buttonText: 'Get Started', buttonUrl: '#',
                titleColor: '#0F172A', textColor: '#334155',
                buttonBgColor: '#2563EB', buttonTextColor: '#FFFFFF',
                align: 'center',
            };
        case 'product-card':
            return {
                id, type,
                imageUrl: 'https://placehold.co/480x280/E2E8F0/475569?text=Product+Image',
                imageAlt: 'Product image',
                name: 'Featured Product',
                description: 'A short product description highlighting the key value for your subscriber.',
                price: '$49.00', oldPrice: '$69.00',
                buttonText: 'Shop Now', buttonUrl: '#',
                titleColor: '#0F172A', textColor: '#475569',
                priceColor: '#DC2626', buttonBgColor: '#0F172A', buttonTextColor: '#FFFFFF',
                align: 'left',
            };
        case 'coupon':
            return {
                id, type,
                title: 'Limited Time Offer', code: 'SAVE20',
                description: 'Use this coupon at checkout and enjoy an instant discount on your next order.',
                buttonText: 'Apply Coupon', buttonUrl: '#',
                bgColor: '#FFF7ED', borderColor: '#FDBA74',
                titleColor: '#9A3412', textColor: '#7C2D12',
                codeBgColor: '#FFFFFF', codeTextColor: '#9A3412',
                align: 'center',
            };
        case 'survey':
            return {
                id, type,
                surveyType: 'stars',
                question: 'How would you rate your experience?',
                baseUrl: 'https://example.com/survey?rating=',
                starCount: 5,
                starColor: '#F59E0B',
                textColor: '#0F172A',
                labelLow: 'Not likely',
                labelHigh: 'Very likely',
                align: 'center',
            };
        case 'timer':
            return {
                id, type,
                deadline: defaultDeadline(),
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
        case 'video':
            return {
                id, type,
                url: '',
                thumbnailUrl: 'https://placehold.co/600x338/0F172A/FFFFFF?text=▶+Video',
                altText: 'Video thumbnail',
                align: 'center',
                showPlayButton: true,
                playButtonColor: '#FFFFFF',
                playButtonBgColor: 'rgba(0,0,0,0.7)',
                width: 100,
            };
    }
}