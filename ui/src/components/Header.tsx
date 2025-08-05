import React from 'react';
import { Button } from 'primereact/button';
import { useAuthStore } from '../stores/authStore';
import { useConfigStore } from '../stores/configStore';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalize } from '@/hooks/useLocalize';

const Header: React.FC = () => {
    const { logout } = useAuthStore();
    const { sidebarCollapsed, setSidebarCollapsed, setLanguage } =
        useConfigStore();
    const { theme, toggleTheme, resetTheme } = useTheme();
    const { i18n, l } = useLocalize();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(resetTheme);
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLanguageChange = () => {
        const newLang = i18n.language === 'en' ? 'fr' : 'en';
        i18n.changeLanguage(newLang);
        setLanguage(newLang);
    };

    const handleDesktopSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleMobileSidebarToggle = () => {
        window.dispatchEvent(new CustomEvent('toggleMobileSidebar'));
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
            <div className="flex items-center">
                {/* Mobile sidebar toggle - visible on mobile */}
                <Button
                    icon="pi pi-bars"
                    text
                    rounded
                    onClick={handleMobileSidebarToggle}
                    className="lg:hidden p-2 mr-4"
                    tooltip="Toggle sidebar"
                    tooltipOptions={{ position: 'bottom' }}
                />

                {/* Desktop sidebar toggle - hidden on mobile */}
                <Button
                    icon="pi pi-bars"
                    text
                    rounded
                    onClick={handleDesktopSidebarToggle}
                    className="hidden lg:flex p-2 mr-4"
                    tooltip={
                        sidebarCollapsed
                            ? l('common.actions.expandSidebar')
                            : l('common.actions.collapseSidebar')
                    }
                    tooltipOptions={{ position: 'bottom' }}
                />
            </div>

            <div className="flex items-center gap-3">
                <Button
                    label={i18n.language === 'en' ? '🇫🇷' : '🇺🇸'}
                    text
                    rounded
                    onClick={handleLanguageChange}
                    className="p-2 text-lg"
                    tooltip={
                        i18n.language === 'en'
                            ? l('common.language.switchToFrench')
                            : l('common.language.switchToEnglish')
                    }
                    tooltipOptions={{ position: 'bottom' }}
                />

                <Button
                    icon={theme === 'light' ? 'pi pi-moon' : 'pi pi-sun'}
                    text
                    rounded
                    onClick={toggleTheme}
                    className="p-2"
                    tooltip={
                        theme === 'light'
                            ? l('common.theme.switchToDark')
                            : l('common.theme.switchToLight')
                    }
                    tooltipOptions={{ position: 'bottom' }}
                />

                <Button
                    icon="pi pi-user"
                    text
                    rounded
                    onClick={handleProfileClick}
                    className="p-2"
                    tooltip={l('common.viewProfile')}
                    tooltipOptions={{ position: 'bottom' }}
                />
                <Button
                    icon="pi pi-sign-out"
                    text
                    rounded
                    onClick={handleLogout}
                    className="p-2"
                    tooltip={l('auth.logout')}
                    tooltipOptions={{ position: 'bottom' }}
                />
            </div>
        </header>
    );
};

export default Header;
