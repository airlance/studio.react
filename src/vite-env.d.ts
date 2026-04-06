/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_UNSPLASH_ACCESS_KEY?: string;
    readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}