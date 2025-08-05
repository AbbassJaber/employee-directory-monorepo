import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../../features/auth/components/LoginPage';

// Mock the stores and hooks
const mockLogin = jest.fn();
const mockNavigate = jest.fn();
const mockIsLoading = false;

jest.mock('../../../stores/authStore', () => ({
    useAuthStore: () => ({
        login: mockLogin,
        isLoading: mockIsLoading,
    }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock PrimeReact components
jest.mock('primereact/inputtext', () => ({
    InputText: ({
        value,
        onChange,
        onKeyDown,
        className,
        placeholder,
        autoComplete,
        autoFocus,
        id,
    }: any) => (
        <input
            id={id}
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className={className}
            placeholder={placeholder}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            data-testid="email-input"
        />
    ),
}));

jest.mock('primereact/password', () => ({
    Password: ({
        value,
        onChange,
        onKeyDown,
        inputClassName,
        placeholder,
        autoComplete,
        id,
    }: any) => (
        <input
            id={id}
            type="password"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className={inputClassName}
            placeholder={placeholder}
            autoComplete={autoComplete}
            data-testid="password-input"
        />
    ),
}));

jest.mock('primereact/button', () => ({
    Button: ({
        type,
        loading,
        className,
        disabled,
        children,
        onClick,
    }: any) => (
        <button
            type={type}
            className={className}
            disabled={disabled}
            onClick={onClick}
            data-testid="submit-button"
        >
            {loading && <span data-testid="loading-spinner">Loading...</span>}
            {children}
        </button>
    ),
}));

jest.mock('primereact/card', () => ({
    Card: ({ className, children }: any) => (
        <div className={className} data-testid="login-card">
            {children}
        </div>
    ),
}));

jest.mock('primereact/divider', () => ({
    Divider: () => <hr data-testid="divider" />,
}));

// Mock the cn utility
jest.mock('../../../utils/cn', () => ({
    cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('LoginPage Component', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderLoginPage = () => {
        return render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
    };

    it('renders login form correctly', () => {
        renderLoginPage();

        expect(screen.getByText('Employee Directory')).toBeInTheDocument();
        expect(
            screen.getByText('Sign in to access your account')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Hint: ceo@company.com / ceo123456')
        ).toBeInTheDocument();
        expect(screen.getByTestId('login-card')).toBeInTheDocument();
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('handles email input changes', async () => {
        renderLoginPage();
        const emailInput = screen.getByTestId('email-input');

        await user.type(emailInput, 'test@example.com');
        expect(emailInput).toHaveValue('test@example.com');
    });

    it('handles password input changes', async () => {
        renderLoginPage();
        const passwordInput = screen.getByTestId('password-input');

        await user.type(passwordInput, 'password123');
        expect(passwordInput).toHaveValue('password123');
    });

    it('validates empty email field', async () => {
        renderLoginPage();
        const submitButton = screen.getByTestId('submit-button');

        await user.click(submitButton);

        expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('validates invalid email format', async () => {
        renderLoginPage();
        const emailInput = screen.getByTestId('email-input');
        const submitButton = screen.getByTestId('submit-button');

        await user.type(emailInput, 'invalid-email');
        await user.click(submitButton);

        expect(
            screen.getByText('Please enter a valid email address')
        ).toBeInTheDocument();
    });

    it('validates empty password field', async () => {
        renderLoginPage();
        const emailInput = screen.getByTestId('email-input');
        const submitButton = screen.getByTestId('submit-button');

        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('validates password minimum length', async () => {
        renderLoginPage();
        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitButton = screen.getByTestId('submit-button');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, '123');
        await user.click(submitButton);

        expect(
            screen.getByText('Password must be at least 6 characters')
        ).toBeInTheDocument();
    });

    it('clears field errors when user starts typing', async () => {
        renderLoginPage();
        const emailInput = screen.getByTestId('email-input');
        const submitButton = screen.getByTestId('submit-button');

        // Trigger email validation error
        await user.click(submitButton);
        expect(screen.getByText('Email is required')).toBeInTheDocument();

        // Start typing to clear error
        await user.type(emailInput, 'test@example.com');
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });

    it('handles successful login', async () => {
        mockLogin.mockResolvedValueOnce(undefined);
        renderLoginPage();

        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitButton = screen.getByTestId('submit-button');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(
                'test@example.com',
                'password123'
            );
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('handles login failure', async () => {
        mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
        renderLoginPage();

        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitButton = screen.getByTestId('submit-button');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText('Invalid email or password. Please try again.')
            ).toBeInTheDocument();
        });
    });

    it('handles Enter key submission', async () => {
        mockLogin.mockResolvedValueOnce(undefined);
        renderLoginPage();

        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        // Press Enter on password field
        fireEvent.keyDown(passwordInput, { key: 'Enter' });

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(
                'test@example.com',
                'password123'
            );
        });
    });

    it('clears form data after successful login', async () => {
        mockLogin.mockResolvedValueOnce(undefined);
        renderLoginPage();

        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitButton = screen.getByTestId('submit-button');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
            expect(emailInput).toHaveValue('');
            expect(passwordInput).toHaveValue('');
        });
    });

    it('validates multiple fields simultaneously', async () => {
        renderLoginPage();
        const submitButton = screen.getByTestId('submit-button');

        await user.click(submitButton);

        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('prevents form submission when validation fails', async () => {
        renderLoginPage();
        const submitButton = screen.getByTestId('submit-button');

        await user.click(submitButton);

        expect(mockLogin).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
