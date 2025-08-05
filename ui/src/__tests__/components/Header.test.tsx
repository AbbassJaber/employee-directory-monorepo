import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';

// Mock the stores and hooks
const mockLogout = jest.fn();
const mockSetSidebarCollapsed = jest.fn();
const mockSetLanguage = jest.fn();
const mockToggleTheme = jest.fn();
const mockResetTheme = jest.fn();
const mockChangeLanguage = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../../stores/authStore', () => ({
    useAuthStore: () => ({
        logout: mockLogout,
    }),
}));

jest.mock('../../stores/configStore', () => ({
    useConfigStore: () => ({
        sidebarCollapsed: false,
        setSidebarCollapsed: mockSetSidebarCollapsed,
        setLanguage: mockSetLanguage,
    }),
}));

jest.mock('../../contexts/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        resetTheme: mockResetTheme,
    }),
}));

jest.mock('../../hooks/useLocalize', () => ({
    useLocalize: () => ({
        i18n: {
            language: 'en',
            changeLanguage: mockChangeLanguage,
        },
        l: (key: string) => key, // Return the key as-is for testing
    }),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock PrimeReact Button component
jest.mock('primereact/button', () => ({
    Button: ({ icon, label, onClick, className, tooltip, children }: any) => (
        <button
            onClick={onClick}
            className={className}
            data-testid={icon || label || 'button'}
            title={tooltip}
        >
            {icon && <span className="icon">{icon}</span>}
            {label && <span className="label">{label}</span>}
            {children}
        </button>
    ),
}));

describe('Header Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderHeader = () => {
        return render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
    };

    it('renders without crashing', () => {
        renderHeader();
        expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders all main buttons', () => {
        renderHeader();

        // Check for sidebar toggle buttons (use getAllByTestId since there are two)
        const sidebarButtons = screen.getAllByTestId('pi pi-bars');
        expect(sidebarButtons).toHaveLength(2);

        // Check for language toggle button
        expect(screen.getByText('🇫🇷')).toBeInTheDocument();

        // Check for theme toggle button
        expect(screen.getByTestId('pi pi-moon')).toBeInTheDocument();

        // Check for profile button
        expect(screen.getByTestId('pi pi-user')).toBeInTheDocument();

        // Check for logout button
        expect(screen.getByTestId('pi pi-sign-out')).toBeInTheDocument();
    });

    it('handles mobile sidebar toggle', () => {
        const mockDispatchEvent = jest.spyOn(window, 'dispatchEvent');
        renderHeader();

        const sidebarButtons = screen.getAllByTestId('pi pi-bars');
        const mobileSidebarButton = sidebarButtons[0]; // First one is mobile
        fireEvent.click(mobileSidebarButton);

        expect(mockDispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'toggleMobileSidebar',
            })
        );
    });

    it('handles desktop sidebar toggle', () => {
        renderHeader();

        const sidebarButtons = screen.getAllByTestId('pi pi-bars');
        const desktopSidebarButton = sidebarButtons[1]; // Second one is desktop
        fireEvent.click(desktopSidebarButton);

        expect(mockSetSidebarCollapsed).toHaveBeenCalledWith(true);
    });

    it('handles language change', () => {
        renderHeader();

        const languageButton = screen.getByText('🇫🇷');
        fireEvent.click(languageButton);

        expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
        expect(mockSetLanguage).toHaveBeenCalledWith('fr');
    });

    it('handles theme toggle', () => {
        renderHeader();

        const themeButton = screen.getByTestId('pi pi-moon');
        fireEvent.click(themeButton);

        expect(mockToggleTheme).toHaveBeenCalled();
    });

    it('handles profile click', () => {
        renderHeader();

        const profileButton = screen.getByTestId('pi pi-user');
        fireEvent.click(profileButton);

        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('handles logout', () => {
        renderHeader();

        const logoutButton = screen.getByTestId('pi pi-sign-out');
        fireEvent.click(logoutButton);

        expect(mockLogout).toHaveBeenCalledWith(mockResetTheme);
    });

    it('displays French flag when language is English', () => {
        renderHeader();
        expect(screen.getByText('🇫🇷')).toBeInTheDocument();
    });

    it('displays moon icon when theme is light', () => {
        renderHeader();
        expect(screen.getByTestId('pi pi-moon')).toBeInTheDocument();
    });
});
