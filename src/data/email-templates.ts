import { EmailTemplate } from '@/types/email-builder';

let idCounter = 1000;
const uid = () => `tpl-${++idCounter}-${Date.now()}`;

export interface StarterTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  build: () => EmailTemplate;
}

export const starterTemplates: StarterTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Onboard new users with a warm greeting',
    thumbnail: '👋',
    build: () => ({
      bgColor: '#F8FAFC',
      contentWidth: 600,
      fontFamily: 'Arial, Helvetica, sans-serif',
      rows: [
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'image', src: 'https://placehold.co/600x120/4F46E5/FFFFFF?text=Your+Logo', alt: 'Logo', width: 50, align: 'center' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'spacer', height: 16 },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'heading', content: 'Welcome aboard! 🎉', level: 'h1' as const, color: '#0F172A', align: 'center' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'text', content: "We're thrilled to have you join us. Your account is all set up and ready to go. Here's what you can do next to get the most out of your experience.", fontSize: 16, color: '#475569', align: 'center' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'spacer', height: 8 },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'button', text: 'Get Started →', url: '#', bgColor: '#4F46E5', textColor: '#FFFFFF', borderRadius: 8, align: 'center' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'spacer', height: 16 },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'text', content: 'Need help? Reply to this email or visit our help center.', fontSize: 13, color: '#94A3B8', align: 'center' as const },
          ]],
        },
      ],
    }),
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Share updates with a clean multi-section layout',
    thumbnail: '📰',
    build: () => ({
      bgColor: '#F8FAFC',
      contentWidth: 600,
      fontFamily: "'Georgia', Times, serif",
      rows: [
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'heading', content: '📬 Weekly Digest', level: 'h1' as const, color: '#0F172A', align: 'left' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'text', content: 'March 2026 · Issue #42', fontSize: 13, color: '#94A3B8', align: 'left' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'image', src: 'https://placehold.co/600x250/e2e8f0/475569?text=Featured+Article', alt: 'Featured', width: 100, align: 'center' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'heading', content: 'Featured: The Future of Design', level: 'h2' as const, color: '#0F172A', align: 'left' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'text', content: 'Explore the latest trends shaping how we build digital experiences. From AI-assisted workflows to new interaction patterns, the landscape is evolving rapidly.', fontSize: 15, color: '#475569', align: 'left' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'button', text: 'Read More', url: '#', bgColor: '#0F172A', textColor: '#FFFFFF', borderRadius: 6, align: 'left' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'spacer', height: 12 },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const },
          ]],
        },
        {
          id: uid(), columns: 2,
          blocks: [
            [
              { id: uid(), type: 'image', src: 'https://placehold.co/280x160/e2e8f0/475569?text=Article+2', alt: 'Article', width: 100, align: 'center' as const },
              { id: uid(), type: 'heading', content: 'Quick Tips & Tricks', level: 'h3' as const, color: '#0F172A', align: 'left' as const },
              { id: uid(), type: 'text', content: 'Five productivity hacks you can use today.', fontSize: 14, color: '#475569', align: 'left' as const },
            ],
            [
              { id: uid(), type: 'image', src: 'https://placehold.co/280x160/e2e8f0/475569?text=Article+3', alt: 'Article', width: 100, align: 'center' as const },
              { id: uid(), type: 'heading', content: 'Community Spotlight', level: 'h3' as const, color: '#0F172A', align: 'left' as const },
              { id: uid(), type: 'text', content: 'Meet the creators building amazing things.', fontSize: 14, color: '#475569', align: 'left' as const },
            ],
          ],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'spacer', height: 16 },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'text', content: 'You received this because you subscribed. Unsubscribe anytime.', fontSize: 12, color: '#94A3B8', align: 'center' as const },
          ]],
        },
      ],
    }),
  },
  {
    id: 'promotion',
    name: 'Promotion',
    description: 'Drive sales with a bold offer announcement',
    thumbnail: '🏷️',
    build: () => ({
      bgColor: '#F8FAFC',
      contentWidth: 600,
      fontFamily: 'Arial, Helvetica, sans-serif',
      rows: [
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'image', src: 'https://placehold.co/600x80/4F46E5/FFFFFF?text=BRAND', alt: 'Brand', width: 30, align: 'center' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'spacer', height: 12 },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'heading', content: 'Spring Sale — 40% Off', level: 'h1' as const, color: '#4F46E5', align: 'center' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'text', content: 'For a limited time, enjoy massive savings across our entire collection. Use code SPRING40 at checkout.', fontSize: 16, color: '#475569', align: 'center' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'spacer', height: 8 },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'button', text: 'Shop Now', url: '#', bgColor: '#4F46E5', textColor: '#FFFFFF', borderRadius: 24, align: 'center' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'spacer', height: 16 },
          ]],
        },
        {
          id: uid(), columns: 3,
          blocks: [
            [
              { id: uid(), type: 'image', src: 'https://placehold.co/180x180/e2e8f0/475569?text=Product+1', alt: 'Product', width: 100, align: 'center' as const },
              { id: uid(), type: 'text', content: 'Essential Tee\n$29 → $17', fontSize: 14, color: '#0F172A', align: 'center' as const },
            ],
            [
              { id: uid(), type: 'image', src: 'https://placehold.co/180x180/e2e8f0/475569?text=Product+2', alt: 'Product', width: 100, align: 'center' as const },
              { id: uid(), type: 'text', content: 'Classic Hoodie\n$59 → $35', fontSize: 14, color: '#0F172A', align: 'center' as const },
            ],
            [
              { id: uid(), type: 'image', src: 'https://placehold.co/180x180/e2e8f0/475569?text=Product+3', alt: 'Product', width: 100, align: 'center' as const },
              { id: uid(), type: 'text', content: 'Weekend Bag\n$89 → $53', fontSize: 14, color: '#0F172A', align: 'center' as const },
            ],
          ],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'spacer', height: 16 },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const },
          ]],
        },
        {
          id: uid(), columns: 1,
          blocks: [[
            { id: uid(), type: 'text', content: 'Offer valid until March 31, 2026. Cannot be combined with other discounts.', fontSize: 12, color: '#94A3B8', align: 'center' as const },
          ]],
        },
      ],
    }),
  },
];
