/**
 * Stock Images Configuration (Unsplash)
 * ──────────────────────────────────────
 * Add your Unsplash access key to .env:
 *   VITE_UNSPLASH_ACCESS_KEY=your_key_here
 *
 * Get a free key at: https://unsplash.com/developers
 * Free tier: 50 requests/hour. No attribution required per image,
 * but Unsplash guidelines ask to show photographer name when possible.
 *
 * Without a key, CURATED_IMAGES are shown as a built-in library.
 */

export const UNSPLASH_ACCESS_KEY: string =
    import.meta.env.VITE_UNSPLASH_ACCESS_KEY ?? '';

export const UNSPLASH_API_BASE = 'https://api.unsplash.com';

export interface StockImage {
    id: string;
    /** Full-resolution URL to store in the block */
    url: string;
    /** Small thumbnail URL for the picker grid */
    thumbUrl: string;
    alt: string;
    photographerName: string;
    photographerUrl: string;
    /** Must be called on select to satisfy Unsplash API guidelines */
    downloadLocation: string;
}

// ---------------------------------------------------------------------------
// Curated fallback library — shown when no API key is set
// All images are free to use under the Unsplash License.
// ---------------------------------------------------------------------------
export const CURATED_IMAGES: StockImage[] = [
    {
        id: '1486312338219-ce68d2c6f44d',
        url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=280&auto=format&fit=crop',
        alt: 'Person working on laptop',
        photographerName: 'Glenn Carstens-Peters',
        photographerUrl: 'https://unsplash.com/@glenncarstenspeters',
        downloadLocation: '',
    },
    {
        id: '1498050108023-c5249f4df085',
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=280&auto=format&fit=crop',
        alt: 'Code on laptop screen',
        photographerName: 'Christopher Gower',
        photographerUrl: 'https://unsplash.com/@cgower',
        downloadLocation: '',
    },
    {
        id: '1551434678-e076c223a692',
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=280&auto=format&fit=crop',
        alt: 'Laptop and coffee on desk',
        photographerName: 'Crew',
        photographerUrl: 'https://unsplash.com/@crew',
        downloadLocation: '',
    },
    {
        id: '1497366811353-6870744d04b2',
        url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=280&auto=format&fit=crop',
        alt: 'Office meeting room',
        photographerName: 'Breather',
        photographerUrl: 'https://unsplash.com/@breather',
        downloadLocation: '',
    },
    {
        id: '1521737852567-6949f3f9f2b5',
        url: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=400&h=280&auto=format&fit=crop',
        alt: 'Team working together',
        photographerName: 'Annie Spratt',
        photographerUrl: 'https://unsplash.com/@anniespratt',
        downloadLocation: '',
    },
    {
        id: '1542273917363-3b1817f69a2d',
        url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=280&auto=format&fit=crop',
        alt: 'Modern office interior',
        photographerName: 'Alex Kotliarskyi',
        photographerUrl: 'https://unsplash.com/@frantic',
        downloadLocation: '',
    },
    {
        id: '1519389950473-47ba0277781c',
        url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=280&auto=format&fit=crop',
        alt: 'People in a meeting',
        photographerName: 'Marvin Meyer',
        photographerUrl: 'https://unsplash.com/@marvelous',
        downloadLocation: '',
    },
    {
        id: '1518770660439-4636190af475',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=280&auto=format&fit=crop',
        alt: 'Circuit board technology',
        photographerName: 'Alexandre Debiève',
        photographerUrl: 'https://unsplash.com/@alexkixa',
        downloadLocation: '',
    },
    {
        id: '1485827404703-89b55fcc595e',
        url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=280&auto=format&fit=crop',
        alt: 'Robot and technology',
        photographerName: 'Franck V.',
        photographerUrl: 'https://unsplash.com/@franckinjapan',
        downloadLocation: '',
    },
    {
        id: '1557682250-33bd709cbe85',
        url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=280&auto=format&fit=crop',
        alt: 'Abstract purple gradient',
        photographerName: 'Lorenzo Herrera',
        photographerUrl: 'https://unsplash.com/@lorenzoherrera',
        downloadLocation: '',
    },
    {
        id: '1444703686981-a3abbc4d4fe3',
        url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400&h=280&auto=format&fit=crop',
        alt: 'Stars and galaxy night sky',
        photographerName: 'Greg Rakozy',
        photographerUrl: 'https://unsplash.com/@grakozy',
        downloadLocation: '',
    },
    {
        id: '1501854140801-50d01698950b',
        url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=280&auto=format&fit=crop',
        alt: 'Green forest aerial view',
        photographerName: 'Lukasz Szmigiel',
        photographerUrl: 'https://unsplash.com/@szmigieldesign',
        downloadLocation: '',
    },
    {
        id: '1493723843671-1d655e66ac1c',
        url: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?w=400&h=280&auto=format&fit=crop',
        alt: 'Mountain lake reflection',
        photographerName: 'Elijah Hiett',
        photographerUrl: 'https://unsplash.com/@elijahdhiett',
        downloadLocation: '',
    },
    {
        id: '1462275646964-a0e3386b89fa',
        url: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=400&h=280&auto=format&fit=crop',
        alt: 'Sunrise over mountains',
        photographerName: 'Timothy Eberly',
        photographerUrl: 'https://unsplash.com/@timothyeberly',
        downloadLocation: '',
    },
    {
        id: '1504674900247-0877df9cc836',
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&auto=format&fit=crop',
        alt: 'Avocado toast food',
        photographerName: 'Brooke Lark',
        photographerUrl: 'https://unsplash.com/@brookelark',
        downloadLocation: '',
    },
    {
        id: '1488646953014-85cb44e25828',
        url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=280&auto=format&fit=crop',
        alt: 'Travel airplane window view',
        photographerName: 'Tom Barrett',
        photographerUrl: 'https://unsplash.com/@wistomsin',
        downloadLocation: '',
    },
    {
        id: '1519085360753-af0119f7cbe7',
        url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=280&auto=format&fit=crop',
        alt: 'Professional headshot portrait',
        photographerName: 'Joseph Gonzalez',
        photographerUrl: 'https://unsplash.com/@miracletwentyone',
        downloadLocation: '',
    },
    {
        id: '1511895426328-dc8714191011',
        url: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=400&h=280&auto=format&fit=crop',
        alt: 'Person using laptop in cafe',
        photographerName: 'Christin Hume',
        photographerUrl: 'https://unsplash.com/@christinhumephoto',
        downloadLocation: '',
    },
    {
        id: '1506905925346-21bda4d32df4',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&auto=format&fit=crop',
        alt: 'Mountain peak landscape',
        photographerName: 'Samuel Clara',
        photographerUrl: 'https://unsplash.com/@samuelclara',
        downloadLocation: '',
    },
    {
        id: '1561336313-0dcd8a2d700f',
        url: 'https://images.unsplash.com/photo-1561336313-0dcd8a2d700f?w=1200&auto=format&fit=crop',
        thumbUrl: 'https://images.unsplash.com/photo-1561336313-0dcd8a2d700f?w=400&h=280&auto=format&fit=crop',
        alt: 'Shopping and e-commerce',
        photographerName: 'freestocks',
        photographerUrl: 'https://unsplash.com/@freestocks',
        downloadLocation: '',
    },
];