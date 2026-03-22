import { createContext } from 'react';
import { Language, TranslationDictionary } from '@/config/i18n/types';
import { en } from '@/config/i18n/en';
import { ru } from '@/config/i18n/ru';
import { uk } from '@/config/i18n/uk';
import { it } from '@/config/i18n/it';
import { es } from '@/config/i18n/es';
import { fr } from '@/config/i18n/fr';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'ru', 'uk', 'it', 'es', 'fr'];

export const dictionaries: Record<Language, TranslationDictionary> = {
    en, ru, uk, it, es, fr,
};

export interface TranslationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof TranslationDictionary) => string;
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);