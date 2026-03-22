import { useContext } from 'react';
import { TranslationContext, TranslationContextType } from '@/config/i18n/translation-context';

export function useTranslation(): TranslationContextType {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
}