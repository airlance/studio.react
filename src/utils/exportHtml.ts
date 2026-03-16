import { EmailTemplate, EmailBlock, EmailRow } from '@/types/email-builder';

function renderBlock(block: EmailBlock, fontFamily: string): string {
  switch (block.type) {
    case 'heading': {
      const tag = block.level;
      const sizes = { h1: '28px', h2: '22px', h3: '18px' };
      return `<${tag} style="margin:0;padding:8px 0;color:${block.color};text-align:${block.align};font-family:${fontFamily};font-size:${sizes[block.level]};font-weight:700;">${block.content}</${tag}>`;
    }
    case 'text':
      return `<p style="margin:0;padding:8px 0;color:${block.color};font-size:${block.fontSize}px;text-align:${block.align};font-family:${fontFamily};line-height:1.6;">${block.content}</p>`;
    case 'image':
      return `<div style="text-align:${block.align};padding:8px 0;"><img src="${block.src}" alt="${block.alt}" style="max-width:${block.width}%;height:auto;display:inline-block;" /></div>`;
    case 'button':
      return `<div style="text-align:${block.align};padding:12px 0;"><a href="${block.url}" style="display:inline-block;background:${block.bgColor};color:${block.textColor};padding:12px 28px;text-decoration:none;border-radius:${block.borderRadius}px;font-family:${fontFamily};font-weight:600;font-size:16px;">${block.text}</a></div>`;
    case 'divider':
      return `<hr style="border:none;border-top:${block.thickness}px ${block.style} ${block.color};margin:12px 0;" />`;
    case 'spacer':
      return `<div style="height:${block.height}px;"></div>`;
  }
}

function renderRow(row: EmailRow, contentWidth: number, fontFamily: string): string {
  const colWidth = Math.floor(100 / row.columns);
  const cols = row.blocks.map((col, i) => {
    const blocksHtml = col.map(b => renderBlock(b, fontFamily)).join('\n');
    return `<td style="width:${colWidth}%;vertical-align:top;padding:0 8px;">${blocksHtml}</td>`;
  }).join('\n');

  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${cols}</tr></table>`;
}

export function exportToHtml(template: EmailTemplate): string {
  const rowsHtml = template.rows.map(row => renderRow(row, template.contentWidth, template.fontFamily)).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Email</title>
</head>
<body style="margin:0;padding:0;background-color:${template.bgColor};font-family:${template.fontFamily};">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${template.bgColor};">
<tr><td align="center" style="padding:20px 0;">
<table width="${template.contentWidth}" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
<tr><td style="padding:24px;">
${rowsHtml}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
