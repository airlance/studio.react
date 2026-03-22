import { useState, ReactNode } from 'react';
import { Language, TranslationDictionary } from '@/config/i18n/types';
import {
    TranslationContext,
    dictionaries,
    SUPPORTED_LANGUAGES,
} from '@/config/i18n/translation-context';
import { en } from '@/config/i18n/en';

function getInitialLanguage(): Language {
    if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language.slice(0, 2) as Language;
        if (SUPPORTED_LANGUAGES.includes(browserLang)) {
            return browserLang;
        }
    }
    return 'en';
}

export function TranslationProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(getInitialLanguage);

    const t = (key: keyof TranslationDictionary): string => {
        const dict = dictionaries[language];
        return dict[key] || en[key] || key;
    };

    return (
        <TranslationContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </TranslationContext.Provider>
    );
}