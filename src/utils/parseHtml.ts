import { EmailTemplate, EmailRow, EmailBlock } from '@/types/email-builder';

let idCounter = 1000;
const uid = () => `imported-${++idCounter}-${Date.now()}`;

/**
 * Parse an HTML string into an EmailTemplate.
 * This is a best-effort parser that extracts content from HTML email files
 * and converts them into builder blocks.
 */
export function parseHtmlToTemplate(html: string): EmailTemplate {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Try to extract background color from body or wrapper
  const body = doc.body;
  const bgColor = body?.getAttribute('bgcolor') ||
    extractStyleProp(body?.getAttribute('style') || '', 'background-color') ||
    '#F8FAFC';

  const blocks: EmailBlock[] = [];

  // Walk through body elements and extract blocks
  const walker = doc.createTreeWalker(body, NodeFilter.SHOW_ELEMENT);
  const visited = new Set<Node>();

  function processElement(el: Element) {
    if (visited.has(el)) return;
    visited.add(el);

    const tag = el.tagName.toLowerCase();

    // Headings
    if (['h1', 'h2', 'h3'].includes(tag)) {
      blocks.push({
        id: uid(),
        type: 'heading',
        content: el.textContent?.trim() || 'Heading',
        level: tag as 'h1' | 'h2' | 'h3',
        color: extractStyleProp(el.getAttribute('style') || '', 'color') || '#0F172A',
        align: (extractStyleProp(el.getAttribute('style') || '', 'text-align') as any) || 'left',
      });
      return;
    }

    // Images
    if (tag === 'img') {
      blocks.push({
        id: uid(),
        type: 'image',
        src: el.getAttribute('src') || 'https://placehold.co/600x200',
        alt: el.getAttribute('alt') || 'Image',
        width: 100,
        align: 'center',
      });
      return;
    }

    // Links styled as buttons (common in email HTML)
    if (tag === 'a' && el.getAttribute('style')?.includes('background')) {
      blocks.push({
        id: uid(),
        type: 'button',
        text: el.textContent?.trim() || 'Click Me',
        url: el.getAttribute('href') || '#',
        bgColor: extractStyleProp(el.getAttribute('style') || '', 'background-color') || '#4F46E5',
        textColor: extractStyleProp(el.getAttribute('style') || '', 'color') || '#FFFFFF',
        borderRadius: 6,
        align: 'center',
      });
      return;
    }

    // Horizontal rules
    if (tag === 'hr') {
      blocks.push({
        id: uid(),
        type: 'divider',
        color: '#E2E8F0',
        thickness: 1,
        style: 'solid',
      });
      return;
    }

    // Paragraphs and text
    if (['p', 'span', 'div', 'td'].includes(tag) && el.textContent?.trim() && el.children.length === 0) {
      const text = el.textContent.trim();
      if (text.length > 0) {
        blocks.push({
          id: uid(),
          type: 'text',
          content: text,
          fontSize: 16,
          color: extractStyleProp(el.getAttribute('style') || '', 'color') || '#0F172A',
          align: (extractStyleProp(el.getAttribute('style') || '', 'text-align') as any) || 'left',
        });
      }
      return;
    }
  }

  let node = walker.nextNode();
  while (node) {
    processElement(node as Element);
    node = walker.nextNode();
  }

  // If no blocks found, add a text block with body content
  if (blocks.length === 0 && body?.textContent?.trim()) {
    blocks.push({
      id: uid(),
      type: 'text',
      content: body.textContent.trim().slice(0, 500),
      fontSize: 16,
      color: '#0F172A',
      align: 'left',
    });
  }

  // Wrap each block in its own row
  const rows: EmailRow[] = blocks.map(block => ({
    id: uid(),
    columns: 1 as const,
    blocks: [[block]],
  }));

  return {
    rows,
    bgColor,
    contentWidth: 600,
    fontFamily: 'Arial, Helvetica, sans-serif',
  };
}

function extractStyleProp(style: string, prop: string): string | null {
  const regex = new RegExp(`${prop}\\s*:\\s*([^;]+)`, 'i');
  const match = style.match(regex);
  return match ? match[1].trim() : null;
}
