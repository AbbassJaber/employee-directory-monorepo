import { useTranslation } from 'react-i18next';
import { TranslateFn, TranslationKey } from '@/types/translations';
import { SupportedLanguage } from '@/i18n/locales';

export const useLocalize = () => {
    const { t: i18nT, i18n, ready } = useTranslation();
    const l: TranslateFn = (key: TranslationKey, options?: any): string => {
        const result = i18nT(key, options) as string;
        return result;
    };

    const changeLanguage = (language: SupportedLanguage) => {
        return i18n.changeLanguage(language);
    };

    const getCurrentLanguage = (): SupportedLanguage => {
        return i18n.language as SupportedLanguage;
    };

    return {
        l,
        i18n,
        ready,
        changeLanguage,
        getCurrentLanguage,
    };
};
