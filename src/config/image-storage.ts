export type ImageStorageDriver = 'base64' | 'server';

export interface ImageStorageConfig {
    driver: ImageStorageDriver;
    /** Simulated server upload URL or endpoint */
    serverEndpoint?: string;
}

export const IMAGE_STORAGE_CONFIG: ImageStorageConfig = {
    driver: 'base64', // default to base64 for ease of use without a backend setup
};

/**
 * Uploads an image blob based on the global driver setting.
 * In a real app, 'server' would upload via fetch to AWS/Cloudinary.
 *
 * @param blob The image Blob to upload
 * @returns Promise resolving to the stored image URL
 */
export async function uploadImage(blob: Blob): Promise<string> {
    if (IMAGE_STORAGE_CONFIG.driver === 'base64') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert Blob to base64'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } else {
        // Mock server upload behavior
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return a placeholder since we can't actually host the blob persistently here
                resolve('https://placehold.co/800x600?text=Uploaded+to+Server');
            }, 1000);
        });
    }
}
