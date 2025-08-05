import { locales } from './locales';

export const validateLocales = (): void => {
    const languages = Object.keys(locales) as Array<keyof typeof locales>;

    for (const language of languages) {
        const locale = locales[language];

        if (!locale.common) {
            throw new Error(`Missing 'common' namespace for ${language}`);
        }
        if (!locale.auth) {
            throw new Error(`Missing 'auth' namespace for ${language}`);
        }
        if (!locale.employees) {
            throw new Error(`Missing 'employees' namespace for ${language}`);
        }
    }
};

if (process.env.NODE_ENV === 'development') {
    try {
        validateLocales();
    } catch (error) {
        console.error('❌ Locale validation failed:', error);
        throw error;
    }
}
