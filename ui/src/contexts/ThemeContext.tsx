import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('light');

    const loadTheme = (newTheme: Theme) => {
        const existingTheme = document.getElementById('current-theme');
        if (existingTheme) {
            existingTheme.remove();
        }

        const link = document.createElement('link');
        link.id = 'current-theme';
        link.rel = 'stylesheet';

        if (newTheme === 'dark') {
            link.href =
                'https://cdn.jsdelivr.net/npm/primereact@10.8.3/resources/themes/vela-blue/theme.css';
        } else {
            link.href =
                'https://cdn.jsdelivr.net/npm/primereact@10.8.3/resources/themes/saga-blue/theme.css';
        }

        link.onload = () => {};

        document.head.appendChild(link);

        document.documentElement.setAttribute('data-theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        loadTheme(newTheme);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    const resetTheme = () => {
        setTheme('light');
    };

    useEffect(() => {
        loadTheme('light');
    }, []);

    return (
        <ThemeContext.Provider
            value={{ theme, setTheme, toggleTheme, resetTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
