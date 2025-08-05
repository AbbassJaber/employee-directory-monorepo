import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, Language } from '@/types';
import toast from 'react-hot-toast';

interface ConfigState {
    theme: Theme;
    language: Language;
    sidebarCollapsed: boolean;
    isLoading: boolean;
}

interface ConfigActions {
    setTheme: (theme: Theme) => Promise<void>;
    setLanguage: (language: Language) => Promise<void>;
    setSidebarCollapsed: (collapsed: boolean) => void;
    clearConfig: () => void;
}

type ConfigStore = ConfigState & ConfigActions;

export const useConfigStore = create<ConfigStore>()(
    persist(
        set => ({
            theme: 'light',
            language: 'en',
            sidebarCollapsed: false,
            isLoading: false,

            setTheme: async (theme: Theme) => {
                set({ isLoading: true });

                try {
                    set({ theme, isLoading: false });
                    toast.success(`Theme changed to ${theme} mode`, {
                        icon: theme === 'dark' ? '🌙' : '☀️',
                    });
                } catch (error: any) {
                    set({ isLoading: false });
                    toast.error('Failed to change theme');
                }
            },

            setLanguage: async (language: Language) => {
                set({ isLoading: true });

                try {
                    set({ language, isLoading: false });
                } catch (error: any) {
                    set({ isLoading: false });
                }
            },

            setSidebarCollapsed: (collapsed: boolean) => {
                set({ sidebarCollapsed: collapsed });
            },

            clearConfig: () => {
                set({
                    theme: 'light',
                    language: 'en',
                    sidebarCollapsed: false,
                    isLoading: false,
                });
            },
        }),
        {
            name: 'config-storage',
            partialize: state => ({
                theme: state.theme,
                language: state.language,
                sidebarCollapsed: state.sidebarCollapsed,
            }),
        }
    )
);
