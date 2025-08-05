import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../../features/dashboard/components/Dashboard';

// Mock the stores and hooks
const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    position: 'CEO',
    department: 'Executive',
};

jest.mock('../../../stores/authStore', () => ({
    useAuthStore: () => ({
        user: mockUser,
    }),
}));

jest.mock('../../../hooks/useLocalize', () => ({
    useLocalize: () => ({
        l: (key: string) => {
            // Mock translations for common keys
            const translations: { [key: string]: string } = {
                'dashboard.stats.totalEmployees': 'Total Employees',
                'dashboard.stats.newHires': 'New Hires',
                'dashboard.stats.departments': 'Departments',
                'dashboard.recentActivity.title': 'Recent Activity',
                'dashboard.recentActivity.subtitle':
                    'Latest updates from your team',
                'dashboard.departmentOverview.title': 'Department Overview',
                'dashboard.departmentOverview.subtitle':
                    'Employee distribution by department',
                'dashboard.recentHires.title': 'Recent Hires',
                'dashboard.recentHires.subtitle':
                    'Latest additions to the team',
                'dashboard.activities.joinedEngineering':
                    'Sarah Johnson joined Engineering',
                'dashboard.activities.updatedProfile':
                    'Mike Chen updated their profile',
                'dashboard.activities.newDepartment':
                    'New Finance department created',
                'dashboard.activities.onboardingCompleted':
                    'Onboarding completed',
                'dashboard.timeAgo.daysAgo': '1 day ago',
                'dashboard.departmentOverview.employees': 'employees',
            };
            return translations[key] || key;
        },
    }),
}));

// Mock PrimeReact components
jest.mock('primereact/card', () => ({
    Card: ({ className, children }: any) => (
        <div className={className} data-testid="dashboard-card">
            {children}
        </div>
    ),
}));

jest.mock('primereact/button', () => ({
    Button: ({ icon, className, 'aria-label': ariaLabel, children }: any) => (
        <button
            className={className}
            aria-label={ariaLabel}
            data-testid="dashboard-button"
        >
            {icon && <i className={icon} />}
            {children}
        </button>
    ),
}));

jest.mock('primereact/avatar', () => ({
    Avatar: ({ label, size, shape, className }: any) => (
        <div
            className={className}
            data-testid="avatar"
            data-size={size}
            data-shape={shape}
        >
            {label}
        </div>
    ),
}));

jest.mock('primereact/avatargroup', () => ({
    AvatarGroup: ({ children }: any) => (
        <div data-testid="avatar-group">{children}</div>
    ),
}));

jest.mock('primereact/progressbar', () => ({
    ProgressBar: ({ value, showValue, style }: any) => (
        <div data-testid="progress-bar" data-value={value} style={style}>
            {showValue && `${value}%`}
        </div>
    ),
}));

// Mock the cn utility
jest.mock('../../../utils/cn', () => ({
    cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('Dashboard Component', () => {
    const renderDashboard = () => {
        return render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );
    };

    it('renders dashboard with all main sections', () => {
        renderDashboard();

        // Check for main dashboard sections
        expect(screen.getByText('Total Employees')).toBeInTheDocument();
        expect(screen.getByText('New Hires')).toBeInTheDocument();
        expect(screen.getByText('Departments')).toBeInTheDocument();
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
        expect(screen.getByText('Department Overview')).toBeInTheDocument();
        expect(screen.getByText('Recent Hires')).toBeInTheDocument();
    });

    it('displays correct statistics values', () => {
        renderDashboard();

        // Check for stat values
        expect(screen.getByText('15')).toBeInTheDocument(); // Total Employees
        expect(screen.getByText('14')).toBeInTheDocument(); // New Hires
        expect(screen.getByText('6')).toBeInTheDocument(); // Departments
    });

    it('displays stat change indicators', () => {
        renderDashboard();

        // Check for change percentages
        expect(screen.getByText('+14%')).toBeInTheDocument();
        expect(screen.getByText('+100%')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('renders recent activities', () => {
        renderDashboard();

        // Check for activity items
        expect(
            screen.getByText('Sarah Johnson joined Engineering')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Mike Chen updated their profile')
        ).toBeInTheDocument();
        expect(
            screen.getByText('New Finance department created')
        ).toBeInTheDocument();
        expect(screen.getByText('Onboarding completed')).toBeInTheDocument();
    });

    it('displays activity timestamps', () => {
        renderDashboard();

        // Check for time indicators
        const timeElements = screen.getAllByText('1 day ago');
        expect(timeElements.length).toBeGreaterThan(0);
    });

    it('renders department overview with progress bars', () => {
        renderDashboard();

        // Check for department names - use getAllByText since there are multiple instances
        const engineeringElements = screen.getAllByText('Engineering');
        const marketingElements = screen.getAllByText('Marketing');
        const salesElements = screen.getAllByText('Sales');
        const hrElements = screen.getAllByText('Human Resources');
        const financeElements = screen.getAllByText('Finance');
        const executiveElements = screen.getAllByText('Executive');

        expect(engineeringElements.length).toBeGreaterThan(0);
        expect(marketingElements.length).toBeGreaterThan(0);
        expect(salesElements.length).toBeGreaterThan(0);
        expect(hrElements.length).toBeGreaterThan(0);
        expect(financeElements.length).toBeGreaterThan(0);
        expect(executiveElements.length).toBeGreaterThan(0);

        // Check for progress bars
        const progressBars = screen.getAllByTestId('progress-bar');
        expect(progressBars.length).toBeGreaterThan(0);
    });

    it('displays department employee counts', () => {
        renderDashboard();

        // Check for employee counts in departments - use getAllByText since there are multiple instances
        const employeeCountElements = screen.getAllByText('2 employees');
        expect(employeeCountElements.length).toBeGreaterThan(0);
    });

    it('shows department percentages', () => {
        renderDashboard();

        // Check for percentage values - use getAllByText since there are multiple instances
        const percentageElements = screen.getAllByText('13%');
        expect(percentageElements.length).toBeGreaterThan(0);
    });

    it('renders recent hires section', () => {
        renderDashboard();

        // Check for recent hires
        expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
        expect(
            screen.getByText('Senior Software Engineer')
        ).toBeInTheDocument();
        // Use getAllByText for Engineering since it appears multiple times
        const engineeringElements = screen.getAllByText('Engineering');
        expect(engineeringElements.length).toBeGreaterThan(0);
    });

    it('displays refresh button in activity section', () => {
        renderDashboard();

        const refreshButton = screen.getByTestId('dashboard-button');
        expect(refreshButton).toBeInTheDocument();
    });

    it('renders multiple dashboard cards', () => {
        renderDashboard();

        const cards = screen.getAllByTestId('dashboard-card');
        expect(cards.length).toBeGreaterThan(0);
    });

    it('displays activity icons', () => {
        renderDashboard();

        // Check for activity icons (these would be rendered as <i> elements)
        const activityIcons = document.querySelectorAll('.pi');
        expect(activityIcons.length).toBeGreaterThan(0);
    });

    it('shows department icons', () => {
        renderDashboard();

        // Check for department icons
        const departmentIcons = document.querySelectorAll('.pi-building');
        expect(departmentIcons.length).toBeGreaterThan(0);
    });

    it('renders avatars for recent hires', () => {
        renderDashboard();

        const avatars = screen.getAllByTestId('avatar');
        expect(avatars.length).toBeGreaterThan(0);
    });

    it('displays avatar groups', () => {
        renderDashboard();

        const avatarGroups = screen.getAllByTestId('avatar-group');
        expect(avatarGroups.length).toBeGreaterThan(0);
    });

    it('shows correct activity colors', () => {
        renderDashboard();

        // Check for activity color classes
        const successActivities = document.querySelectorAll('.text-success');
        const infoActivities = document.querySelectorAll('.text-info');
        const warningActivities = document.querySelectorAll('.text-warning');

        expect(successActivities.length).toBeGreaterThan(0);
        expect(infoActivities.length).toBeGreaterThan(0);
        expect(warningActivities.length).toBeGreaterThan(0);
    });

    it('displays stat icons', () => {
        renderDashboard();

        // Check for stat icons
        const userIcons = document.querySelectorAll('.pi-users');
        const userPlusIcons = document.querySelectorAll('.pi-user-plus');
        const buildingIcons = document.querySelectorAll('.pi-building');

        expect(userIcons.length).toBeGreaterThan(0);
        expect(userPlusIcons.length).toBeGreaterThan(0);
        expect(buildingIcons.length).toBeGreaterThan(0);
    });

    it('displays activity feed subtitle', () => {
        renderDashboard();

        expect(
            screen.getByText('Latest updates from your team')
        ).toBeInTheDocument();
    });

    it('shows department overview subtitle', () => {
        renderDashboard();

        expect(
            screen.getByText('Employee distribution by department')
        ).toBeInTheDocument();
    });

    it('displays recent hires subtitle', () => {
        renderDashboard();

        expect(
            screen.getByText('Latest additions to the team')
        ).toBeInTheDocument();
    });
});
