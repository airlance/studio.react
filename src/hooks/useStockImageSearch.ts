import { useCallback, useEffect, useRef, useState } from 'react';
import {
    CURATED_IMAGES,
    UNSPLASH_ACCESS_KEY,
    UNSPLASH_API_BASE,
    type StockImage,
} from '@/config/stock-images';

interface UnsplashUser {
    name: string;
    username: string;
}

interface UnsplashUrls {
    full?: string;
    regular?: string;
    small?: string;
    thumb?: string;
}

interface UnsplashLinks {
    download_location?: string;
}

interface UnsplashPhoto {
    id: string;
    alt_description: string | null;
    description: string | null;
    urls: UnsplashUrls;
    links: UnsplashLinks;
    user: UnsplashUser;
}

interface UnsplashSearchResponse {
    results: UnsplashPhoto[];
    total: number;
    total_pages: number;
}

function isUnsplashSearchResponse(value: unknown): value is UnsplashSearchResponse {
    return (
        typeof value === 'object' &&
        value !== null &&
        'results' in value &&
        Array.isArray((value as UnsplashSearchResponse).results)
    );
}

interface UseStockImageSearchResult {
    images: StockImage[];
    isLoading: boolean;
    error: string | null;
    hasApiKey: boolean;
    trackDownload: (image: StockImage) => void;
}

const searchCache = new Map<string, StockImage[]>();

function parseUnsplashResponse(data: unknown): StockImage[] {
    if (!isUnsplashSearchResponse(data)) return [];

    return data.results.map((item) => ({
        id: item.id,
        url: item.urls.full ?? item.urls.regular ?? '',
        thumbUrl: item.urls.small ?? item.urls.thumb ?? '',
        alt: item.alt_description ?? item.description ?? 'Unsplash photo',
        photographerName: item.user.name,
        photographerUrl:
            `https://unsplash.com/@${item.user.username}?utm_source=email_builder&utm_medium=referral`,
        downloadLocation: item.links.download_location ?? '',
    }));
}

export function useStockImageSearch(query: string): UseStockImageSearchResult {
    const hasApiKey = UNSPLASH_ACCESS_KEY.length > 0;
    const [images, setImages]     = useState<StockImage[]>(CURATED_IMAGES);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError]       = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef    = useRef<AbortController | null>(null);

    const fetchImages = useCallback(
        async (searchQuery: string, signal: AbortSignal) => {
            const cacheKey = searchQuery.trim().toLowerCase();

            if (!cacheKey) {
                setImages(CURATED_IMAGES);
                setIsLoading(false);
                setError(null);
                return;
            }

            if (!hasApiKey) {
                const filtered = CURATED_IMAGES.filter((img) =>
                    img.alt.toLowerCase().includes(cacheKey),
                );
                setImages(filtered.length > 0 ? filtered : CURATED_IMAGES);
                setIsLoading(false);
                return;
            }

            if (searchCache.has(cacheKey)) {
                setImages(searchCache.get(cacheKey)!);
                setIsLoading(false);
                return;
            }

            try {
                const url = new URL(`${UNSPLASH_API_BASE}/search/photos`);
                url.searchParams.set('query', searchQuery);
                url.searchParams.set('per_page', '20');
                url.searchParams.set('orientation', 'landscape');
                url.searchParams.set('client_id', UNSPLASH_ACCESS_KEY);

                const res = await fetch(url.toString(), { signal });
                if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`);

                const data: unknown = await res.json();
                const parsed = parseUnsplashResponse(data);
                searchCache.set(cacheKey, parsed);
                setImages(parsed);
                setError(null);
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') return;
                setError('Search failed. Check your API key or network connection.');
                setImages(CURATED_IMAGES);
            } finally {
                setIsLoading(false);
            }
        },
        [hasApiKey],
    );

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (abortRef.current) abortRef.current.abort();

        if (query.trim() === '' && !hasApiKey) {
            setImages(CURATED_IMAGES);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        abortRef.current = new AbortController();
        const { signal } = abortRef.current;

        debounceRef.current = setTimeout(() => {
            fetchImages(query, signal);
        }, 450);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            if (abortRef.current) abortRef.current.abort();
        };
    }, [query, fetchImages, hasApiKey]);

    const trackDownload = useCallback(
        (image: StockImage) => {
            if (!image.downloadLocation || !hasApiKey) return;
            const trackUrl = new URL(image.downloadLocation);
            trackUrl.searchParams.set('client_id', UNSPLASH_ACCESS_KEY);
            // Fire-and-forget — tracking failure should never affect UX
            fetch(trackUrl.toString()).catch(() => undefined);
        },
        [hasApiKey],
    );

    return { images, isLoading, error, hasApiKey, trackDownload };
}