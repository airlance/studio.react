import { describe, expect, it } from 'vitest';
import { uploadImage, IMAGE_STORAGE_CONFIG } from '@/config/image-storage';

describe('image-storage', () => {
    it('uploads to base64 when configured', async () => {
        IMAGE_STORAGE_CONFIG.driver = 'base64';
        const blob = new Blob(['fake image data'], { type: 'image/png' });
        const result = await uploadImage(blob);
        expect(result).toMatch(/^data:image\/png;base64,/);
    });

    it('simulates server upload when configured', async () => {
        IMAGE_STORAGE_CONFIG.driver = 'server';
        const blob = new Blob(['fake image data'], { type: 'image/png' });
        const result = await uploadImage(blob);
        expect(result).toContain('https://placehold.co/');
        
        // Restore default
        IMAGE_STORAGE_CONFIG.driver = 'base64';
    });
});
