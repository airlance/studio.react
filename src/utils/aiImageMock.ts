/**
 * Simulates AI Background Removal API call.
 * Returns a placeholder PNG with a transparent background.
 */
export async function mockRemoveBackground(src: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    // For demo purposes, we just return a placehold.co PNG with transparent background
    // Normally we would send the src to an API and get a result.
    return 'https://placehold.co/600x400/transparent/4F46E5.png?text=AI+No+Bg';
}

/**
 * Simulates AI Image Upscale / Enhancement API call.
 */
export async function mockAIUpscale(src: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return 'https://placehold.co/1200x800/10B981/FFFFFF.png?text=AI+Upscaled';
}
