import { EmailTemplate, EmailRow, EmailBlock } from '@/types/email-builder';

let idCounter = 2000;
const uid = () => `ai-${++idCounter}-${Date.now()}`;

/**
 * Mock AI template generator. Analyzes the prompt keywords and generates
 * a relevant template structure. Will be replaced with real AI API later.
 */
export function generateMockTemplate(prompt: string): EmailTemplate {
  const lower = prompt.toLowerCase();
  const rows: EmailRow[] = [];

  // Always start with a heading
  const headingText = extractHeading(lower);
  rows.push(makeRow([{
    id: uid(), type: 'heading', content: headingText,
    level: 'h1', color: '#0F172A', align: 'center',
  }]));

  // Add a spacer
  rows.push(makeRow([{ id: uid(), type: 'spacer', height: 16 }]));

  // Hero image if mentioned
  if (lower.includes('image') || lower.includes('hero') || lower.includes('product') || lower.includes('promotion') || lower.includes('sale')) {
    rows.push(makeRow([{
      id: uid(), type: 'image',
      src: 'https://placehold.co/600x250/4F46E5/FFFFFF?text=Hero+Image',
      alt: 'Hero Image', width: 100, align: 'center',
    }]));
    rows.push(makeRow([{ id: uid(), type: 'spacer', height: 16 }]));
  }

  // Intro text
  rows.push(makeRow([{
    id: uid(), type: 'text',
    content: generateIntroText(lower),
    fontSize: 16, color: '#334155', align: 'center',
  }]));

  rows.push(makeRow([{ id: uid(), type: 'spacer', height: 12 }]));

  // Features/highlights in columns if mentioned
  if (lower.includes('feature') || lower.includes('highlight') || lower.includes('grid') || lower.includes('article')) {
    const colRow: EmailRow = {
      id: uid(), columns: 3,
      blocks: [
        [{
          id: uid(), type: 'heading', content: '⚡ Feature One',
          level: 'h3', color: '#0F172A', align: 'center',
        }, {
          id: uid(), type: 'text', content: 'Brief description of the first key feature or benefit.',
          fontSize: 14, color: '#64748B', align: 'center',
        }],
        [{
          id: uid(), type: 'heading', content: '🎯 Feature Two',
          level: 'h3', color: '#0F172A', align: 'center',
        }, {
          id: uid(), type: 'text', content: 'Brief description of the second key feature or benefit.',
          fontSize: 14, color: '#64748B', align: 'center',
        }],
        [{
          id: uid(), type: 'heading', content: '🚀 Feature Three',
          level: 'h3', color: '#0F172A', align: 'center',
        }, {
          id: uid(), type: 'text', content: 'Brief description of the third key feature or benefit.',
          fontSize: 14, color: '#64748B', align: 'center',
        }],
      ],
    };
    rows.push(colRow);
    rows.push(makeRow([{ id: uid(), type: 'spacer', height: 16 }]));
  }

  // Discount/code section
  if (lower.includes('discount') || lower.includes('code') || lower.includes('coupon') || lower.includes('sale')) {
    rows.push(makeRow([{ id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const }]));
    rows.push(makeRow([{
      id: uid(), type: 'heading', content: 'Use code: SAVE20',
      level: 'h2', color: '#4F46E5', align: 'center',
    }]));
    rows.push(makeRow([{ id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const }]));
    rows.push(makeRow([{ id: uid(), type: 'spacer', height: 12 }]));
  }

  // CTA button
  const ctaText = lower.includes('shop') ? 'Shop Now' :
    lower.includes('get started') || lower.includes('sign') ? 'Get Started' :
    lower.includes('order') ? 'View Order' :
    lower.includes('read') || lower.includes('article') ? 'Read More' :
    'Learn More';

  rows.push(makeRow([{
    id: uid(), type: 'button', text: ctaText, url: '#',
    bgColor: '#4F46E5', textColor: '#FFFFFF', borderRadius: 6, align: 'center',
  }]));

  // Footer
  rows.push(makeRow([{ id: uid(), type: 'spacer', height: 24 }]));
  rows.push(makeRow([{ id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const }]));
  rows.push(makeRow([{
    id: uid(), type: 'text',
    content: 'You received this email because you signed up for our service. Unsubscribe',
    fontSize: 12, color: '#94A3B8', align: 'center',
  }]));

  return {
    rows,
    bgColor: '#F8FAFC',
    contentWidth: 600,
    fontFamily: 'Arial, Helvetica, sans-serif',
  };
}

function makeRow(blocks: EmailBlock[]): EmailRow {
  return { id: uid(), columns: 1, blocks: [blocks] };
}

function extractHeading(prompt: string): string {
  if (prompt.includes('welcome')) return 'Welcome to Our Platform! 👋';
  if (prompt.includes('newsletter')) return 'Weekly Newsletter';
  if (prompt.includes('promotion') || prompt.includes('sale')) return '🔥 Special Offer Inside!';
  if (prompt.includes('order') || prompt.includes('transactional')) return 'Order Confirmation';
  if (prompt.includes('launch') || prompt.includes('product')) return 'Introducing Something Amazing';
  if (prompt.includes('event') || prompt.includes('invite')) return "You're Invited!";
  return 'Your Email Template';
}

function generateIntroText(prompt: string): string {
  if (prompt.includes('welcome')) return "We're thrilled to have you on board! Here's everything you need to get started with our platform.";
  if (prompt.includes('newsletter')) return "Here's what's happening this week — the latest updates, articles, and insights curated just for you.";
  if (prompt.includes('promotion') || prompt.includes('sale')) return "Don't miss out on our biggest sale of the season. Limited time only — shop now and save big!";
  if (prompt.includes('order')) return "Thank you for your purchase! Here are the details of your order.";
  if (prompt.includes('launch') || prompt.includes('product')) return "We've been working hard on something special, and we can't wait to share it with you.";
  return "Thank you for being part of our community. Here's what we have for you today.";
}
