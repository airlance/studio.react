/**
 * Social Networks Configuration
 * ─────────────────────────────
 * To add a new social network, append an entry to SOCIAL_NETWORK_CONFIG.
 * No other files need to be changed.
 */

export interface SocialNetworkConfig {
    key: string;
    label: string;
    brandColor: string;
    placeholder: string;
    /** Single path string or array of path strings (all share the same stroke). */
    svgPath: string | string[];
}

export const SOCIAL_NETWORK_CONFIG: SocialNetworkConfig[] = [
    {
        key: 'facebook',
        label: 'Facebook',
        brandColor: '#1877F2',
        placeholder: 'https://facebook.com/yourpage',
        svgPath: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    },
    {
        key: 'instagram',
        label: 'Instagram',
        brandColor: '#E1306C',
        placeholder: 'https://instagram.com/yourhandle',
        svgPath: [
            'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z',
            'M17.5 6.5h.01',
            'M7.55 3h8.9A4.55 4.55 0 0 1 21 7.55v8.9A4.55 4.55 0 0 1 16.45 21H7.55A4.55 4.55 0 0 1 3 16.45V7.55A4.55 4.55 0 0 1 7.55 3z',
        ],
    },
    {
        key: 'x',
        label: 'X (Twitter)',
        brandColor: '#000000',
        placeholder: 'https://x.com/yourhandle',
        svgPath: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.916l4.265 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z',
    },
    {
        key: 'linkedin',
        label: 'LinkedIn',
        brandColor: '#0A66C2',
        placeholder: 'https://linkedin.com/in/yourprofile',
        svgPath: [
            'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z',
            'M2 9h4v12H2z',
            'M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
        ],
    },
    {
        key: 'youtube',
        label: 'YouTube',
        brandColor: '#FF0000',
        placeholder: 'https://youtube.com/@yourchannel',
        svgPath: [
            'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z',
            'M9.75 15.02V8.98L15.5 12l-5.75 3.02z',
        ],
    },
    {
        key: 'tiktok',
        label: 'TikTok',
        brandColor: '#000000',
        placeholder: 'https://tiktok.com/@yourhandle',
        svgPath: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z',
    },
    {
        key: 'github',
        label: 'GitHub',
        brandColor: '#181717',
        placeholder: 'https://github.com/yourprofile',
        svgPath: [
            'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
        ],
    },
    {
        key: 'pinterest',
        label: 'Pinterest',
        brandColor: '#E60023',
        placeholder: 'https://pinterest.com/yourprofile',
        svgPath: 'M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.62-.31-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.88 1.54 1.88 1.85 0 3.09-2.37 3.09-5.18 0-2.14-1.44-3.76-4.05-3.76-2.95 0-4.78 2.2-4.78 4.66 0 .85.25 1.44.64 1.9.18.22.21.3.14.55-.05.18-.16.61-.2.78-.07.25-.28.34-.51.25-1.38-.57-2.03-2.1-2.03-3.82 0-2.84 2.4-6.25 7.17-6.25 3.83 0 6.34 2.77 6.34 5.75 0 3.94-2.18 6.89-5.39 6.89-1.08 0-2.09-.58-2.44-1.24l-.67 2.57c-.24.93-.89 2.1-1.33 2.81.97.28 2 .44 3.06.44 5.52 0 10-4.48 10-10S17.52 2 12 2z',
    },

    // ── Add your custom networks below ────────────────────────────────────────
];

export type SocialNetwork = (typeof SOCIAL_NETWORK_CONFIG)[number]['key'];

export const SOCIAL_NETWORK_MAP = Object.fromEntries(
    SOCIAL_NETWORK_CONFIG.map(n => [n.key, n])
) as Record<string, SocialNetworkConfig>;

export function renderSocialSvg(network: string, size: number, color: string): string {
    const cfg = SOCIAL_NETWORK_MAP[network];
    if (!cfg) return '';
    const paths = Array.isArray(cfg.svgPath) ? cfg.svgPath : [cfg.svgPath];
    const pathTags = paths.map(d => `<path d="${d}"/>`).join('');
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ` +
        `width="${size}" height="${size}" fill="none" stroke="${color}" ` +
        `stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">` +
        `${pathTags}</svg>`
    );
}