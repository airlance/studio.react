export type EmailFontSource = 'system' | 'google';

export interface EmailFontConfig {
    key: string;
    label: string;
    cssStack: string;
    primaryFamily: string;
    source: EmailFontSource;
    googleFamily?: string;
}

export const EMAIL_FONT_CONFIG: EmailFontConfig[] = [
    { key: 'arial', label: 'Arial', cssStack: 'Arial, Helvetica, sans-serif', primaryFamily: 'arial', source: 'system' },
    { key: 'georgia', label: 'Georgia', cssStack: "'Georgia', Times, serif", primaryFamily: 'georgia', source: 'system' },
    { key: 'verdana', label: 'Verdana', cssStack: "'Verdana', Geneva, sans-serif", primaryFamily: 'verdana', source: 'system' },
    { key: 'trebuchet', label: 'Trebuchet MS', cssStack: "'Trebuchet MS', Helvetica, sans-serif", primaryFamily: 'trebuchet ms', source: 'system' },
    { key: 'times', label: 'Times New Roman', cssStack: "'Times New Roman', Times, serif", primaryFamily: 'times new roman', source: 'system' },
    { key: 'courier', label: 'Courier New', cssStack: "'Courier New', Courier, monospace", primaryFamily: 'courier new', source: 'system' },
    { key: 'tahoma', label: 'Tahoma', cssStack: "'Tahoma', Geneva, sans-serif", primaryFamily: 'tahoma', source: 'system' },
    { key: 'lucida', label: 'Lucida Sans', cssStack: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif", primaryFamily: 'lucida sans unicode', source: 'system' },
    { key: 'system', label: 'System UI', cssStack: 'system-ui, -apple-system, sans-serif', primaryFamily: 'system-ui', source: 'system' },
    { key: 'roboto', label: 'Roboto', cssStack: "'Roboto', Arial, Helvetica, sans-serif", primaryFamily: 'roboto', source: 'google', googleFamily: 'Roboto:wght@400;500;700' },
    { key: 'open-sans', label: 'Open Sans', cssStack: "'Open Sans', Arial, Helvetica, sans-serif", primaryFamily: 'open sans', source: 'google', googleFamily: 'Open+Sans:wght@400;600;700' },
    { key: 'lato', label: 'Lato', cssStack: "'Lato', Arial, Helvetica, sans-serif", primaryFamily: 'lato', source: 'google', googleFamily: 'Lato:wght@400;700' },
    { key: 'montserrat', label: 'Montserrat', cssStack: "'Montserrat', Arial, Helvetica, sans-serif", primaryFamily: 'montserrat', source: 'google', googleFamily: 'Montserrat:wght@400;600;700' },
    { key: 'poppins', label: 'Poppins', cssStack: "'Poppins', Arial, Helvetica, sans-serif", primaryFamily: 'poppins', source: 'google', googleFamily: 'Poppins:wght@400;500;600;700' },
    { key: 'playfair', label: 'Playfair Display', cssStack: "'Playfair Display', Georgia, serif", primaryFamily: 'playfair display', source: 'google', googleFamily: 'Playfair+Display:wght@400;700' },
    { key: 'merriweather', label: 'Merriweather', cssStack: "'Merriweather', Georgia, serif", primaryFamily: 'merriweather', source: 'google', googleFamily: 'Merriweather:wght@400;700' },
];

const GOOGLE_FONTS_LINK_ID = 'email-builder-google-fonts';

function getPrimaryFamily(fontFamily: string): string {
    return fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '').toLowerCase();
}

export function findEmailFont(fontFamily: string): EmailFontConfig | undefined {
    const primary = getPrimaryFamily(fontFamily);
    return EMAIL_FONT_CONFIG.find(font => font.primaryFamily === primary);
}

export function getGoogleFontHrefForFamily(fontFamily: string): string | null {
    const font = findEmailFont(fontFamily);
    if (!font || font.source !== 'google' || !font.googleFamily) return null;
    return `https://fonts.googleapis.com/css2?family=${font.googleFamily}&display=swap`;
}

export function buildAllGoogleFontsHref(): string {
    const families = EMAIL_FONT_CONFIG
        .filter(font => font.source === 'google' && font.googleFamily)
        .map(font => `family=${font.googleFamily}`)
        .join('&');
    return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export function ensureGoogleFontsLoaded(): void {
    if (typeof document === 'undefined') return;
    if (document.getElementById(GOOGLE_FONTS_LINK_ID)) return;
    const link = document.createElement('link');
    link.id = GOOGLE_FONTS_LINK_ID;
    link.rel = 'stylesheet';
    link.href = buildAllGoogleFontsHref();
    document.head.appendChild(link);
}
