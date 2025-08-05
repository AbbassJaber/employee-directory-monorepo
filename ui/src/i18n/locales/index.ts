import { TranslationKeysInterface } from '@/types/translations';
import enTranslations from './en.json';
import frTranslations from './fr.json';

const en: TranslationKeysInterface = enTranslations;

const fr: TranslationKeysInterface = frTranslations;

export const locales = {
    en,
    fr,
} as const;

export type SupportedLanguage = keyof typeof locales;

export const getLocale = (
    language: SupportedLanguage
): TranslationKeysInterface => {
    return locales[language];
};

export const isSupportedLanguage = (
    language: string
): language is SupportedLanguage => {
    return language in locales;
};
