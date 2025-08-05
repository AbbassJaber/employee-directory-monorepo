import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';
import i18n from './i18n/config';
import { useConfigStore } from './stores/configStore';
import { useEffect } from 'react';

import AppRouter from './router/AppRouter';

function App() {
    const { language } = useConfigStore();
    useEffect(() => {
        if (i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [language, i18n]);
    return (
        <ThemeProvider>
            <AppRouter />
        </ThemeProvider>
    );
}

export default App;
