import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { locales, SupportedLanguage } from './locales';
import './validation';

const resources = {
    en: {
        translation: locales.en,
    },
    fr: {
        translation: locales.fr,
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',

        interpolation: {
            escapeValue: false,
        },

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },

        ns: ['translation'],
        defaultNS: 'translation',
    });

export const changeLanguage = (language: SupportedLanguage) => {
    return i18n.changeLanguage(language);
};

export const getCurrentLanguage = (): SupportedLanguage => {
    return i18n.language as SupportedLanguage;
};

export default i18n;
