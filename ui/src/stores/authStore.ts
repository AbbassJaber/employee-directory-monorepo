import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee, EmployeePermission } from '@/features/employees/types';
import { authService } from '@/services/auth.service';
import { resetLogoutFlag } from '@/services/api';
import toast from 'react-hot-toast';
import { useConfigStore } from './configStore';

interface AuthState {
    user: Employee | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    logout: (resetTheme?: () => void) => Promise<void>;
    setUser: (user: Employee) => void;
    setAccessToken: (token: string) => void;
    clearAuth: () => void;
    hasPermission: (permissionName: string) => boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.login({
                        email,
                        password,
                    });

                    if (response.success) {
                        const { accessToken, user } = response.data;

                        set({
                            user,
                            accessToken,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                        resetLogoutFlag();
                        toast.success('Login successful!');
                    } else {
                        set({
                            isLoading: false,
                            error: response.error || 'Login failed',
                        });
                        toast.error(response.error || 'Login failed');
                        // Throw error so LoginPage catch block is triggered
                        throw new Error(response.error || 'Login failed');
                    }
                } catch (error: any) {
                    const errorMessage =
                        error.response?.data?.error ||
                        error.message ||
                        'Login failed';
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    toast.error(errorMessage);
                    // Re-throw the error so LoginPage catch block is triggered
                    throw error;
                }
            },

            logout: async (resetTheme?: () => void) => {
                set({ isLoading: true });

                try {
                    await authService.logout();
                } catch (error) {}

                get().clearAuth();

                // Clear config store
                const configStore = useConfigStore.getState();
                configStore.clearConfig();

                set({ isLoading: false });

                toast.success('Logged out successfully');
                if (resetTheme) {
                    resetTheme();
                }
            },

            setUser: (user: Employee) => {
                set({ user });
            },

            setAccessToken: (token: string) => {
                set({ accessToken: token });
            },

            clearAuth: () => {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            hasPermission: (permissionName: string) => {
                const { user } = get();
                if (!user || !user.permissions) return false;

                return user.permissions.some(
                    (permission: EmployeePermission) =>
                        permission.name === permissionName
                );
            },
        }),
        {
            name: 'auth-storage',
            partialize: state => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
