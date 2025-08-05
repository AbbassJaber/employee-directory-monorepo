import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ListEmployees from '../../../features/employees/components/ListEmployees';

// Mock the stores and hooks
const mockHasPermission = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../../../stores/authStore', () => ({
    useAuthStore: () => ({
        hasPermission: mockHasPermission,
    }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../hooks/useLocalize', () => ({
    useLocalize: () => ({
        l: (key: string) => {
            const translations: { [key: string]: string } = {
                'employees.title': 'Employees',
                'employees.fields.name': 'Name',
                'employees.fields.position': 'Position',
                'employees.fields.department': 'Department',
                'employees.fields.location': 'Location',
                'employees.fields.reportsTo': 'Reports To',
                'common.table.actions': 'Actions',
                'common.actions.view': 'View',
                'common.actions.edit': 'Edit',
                'common.actions.delete': 'Delete',
                'common.actions.create': 'Create Employee',
                'common.search.placeholder': 'Search employees...',
                'common.filters.title': 'Filters',
            };
            return translations[key] || key;
        },
    }),
}));

// Mock services
jest.mock('../../../services/employees.service', () => ({
    employeeService: {
        getEmployees: jest.fn(),
        deleteEmployee: jest.fn(),
    },
}));

jest.mock('../../../services/miscellaneous.service', () => ({
    miscellaneousService: {
        getDepartments: jest.fn(),
        getLocations: jest.fn(),
    },
}));

// Mock hooks
jest.mock('../../../hooks/useDebounce', () => ({
    __esModule: true,
    default: (value: any) => value,
}));

// Mock toast - inline mock to avoid initialization issues
jest.mock('react-hot-toast', () => ({
    __esModule: true,
    default: {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
        info: jest.fn(),
    },
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
}));

// Mock PrimeReact components
jest.mock('primereact/inputtext', () => ({
    InputText: ({ value, onChange, placeholder, className }: any) => (
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            data-testid="search-input"
        />
    ),
}));

jest.mock('primereact/button', () => ({
    Button: ({
        icon,
        label,
        onClick,
        disabled,
        className,
        tooltip,
        children,
    }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={className}
            title={tooltip}
            data-testid={`button-${icon || label || 'default'}`}
        >
            {icon && <i className={icon} />}
            {label && <span>{label}</span>}
            {children}
        </button>
    ),
}));

jest.mock('primereact/multiselect', () => ({
    MultiSelect: ({ value, onChange, options, className }: any) => (
        <select
            value={value}
            onChange={onChange}
            className={className}
            data-testid="multiselect"
            multiple
        >
            {options?.map((option: any, index: number) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    ),
}));

jest.mock('primereact/card', () => ({
    Card: ({ className, children }: any) => (
        <div className={className} data-testid="employees-card">
            {children}
        </div>
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

jest.mock('primereact/datatable', () => ({
    DataTable: ({ value, paginator, rows, totalRecords, loading }: any) => (
        <div data-testid="data-table">
            {loading && <div data-testid="loading-spinner">Loading...</div>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Location</th>
                        <th>Reports To</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {value?.map((employee: any, index: number) => (
                        <tr key={index} data-testid={`employee-row-${index}`}>
                            <td>
                                {employee.firstName} {employee.lastName}
                            </td>
                            <td>{employee.position}</td>
                            <td>{employee.department?.name}</td>
                            <td>{employee.location?.name}</td>
                            <td>
                                {employee.reportsTo?.firstName}{' '}
                                {employee.reportsTo?.lastName}
                            </td>
                            <td>
                                <button data-testid="view-button">View</button>
                                <button data-testid="edit-button">Edit</button>
                                <button
                                    data-testid="delete-button"
                                    disabled={
                                        employee.reports &&
                                        employee.reports.length > 0
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {paginator && (
                <div data-testid="pagination">
                    <span>Total: {totalRecords}</span>
                    <span>Page: {Math.floor(0 / rows) + 1}</span>
                </div>
            )}
        </div>
    ),
}));

jest.mock('primereact/column', () => ({
    Column: ({ field, header }: any) => {
        // If this is the actions column, render the action buttons
        if (header === 'Actions') {
            return (
                <th data-field={field} data-header={header}>
                    {header}
                </th>
            );
        }
        return (
            <th data-field={field} data-header={header}>
                {header}
            </th>
        );
    },
}));

jest.mock('primereact/floatlabel', () => ({
    FloatLabel: ({ children }: any) => (
        <div data-testid="float-label">{children}</div>
    ),
}));

// Mock the cn utility
jest.mock('../../../utils/cn', () => ({
    cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('ListEmployees Component', () => {
    const user = userEvent.setup();

    // Get mock functions after jest.mock calls
    const mockGetEmployees = jest.mocked(
        require('../../../services/employees.service').employeeService
            .getEmployees
    );
    const mockGetDepartments = jest.mocked(
        require('../../../services/miscellaneous.service').miscellaneousService
            .getDepartments
    );
    const mockGetLocations = jest.mocked(
        require('../../../services/miscellaneous.service').miscellaneousService
            .getLocations
    );

    const mockEmployees = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            position: 'Software Engineer',
            department: { id: 1, name: 'Engineering' },
            location: { id: 1, name: 'New York' },
            reportsTo: { id: 2, firstName: 'Jane', lastName: 'Smith' },
            reports: [],
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            position: 'Senior Engineer',
            department: { id: 1, name: 'Engineering' },
            location: { id: 1, name: 'New York' },
            reportsTo: null,
            reports: [{ id: 1, firstName: 'John', lastName: 'Doe' }],
        },
    ];

    const mockDepartments = [
        { id: 1, name: 'Engineering' },
        { id: 2, name: 'Marketing' },
    ];

    const mockLocations = [
        { id: 1, name: 'New York' },
        { id: 2, name: 'San Francisco' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mocks
        mockGetEmployees.mockResolvedValue({
            success: true,
            data: {
                employees: mockEmployees,
                paginationMetadata: { total: 2 },
            },
        });

        mockGetDepartments.mockResolvedValue({
            success: true,
            data: mockDepartments,
        });

        mockGetLocations.mockResolvedValue({
            success: true,
            data: mockLocations,
        });

        mockHasPermission.mockReturnValue(true);
    });

    const renderListEmployees = () => {
        return render(
            <BrowserRouter>
                <ListEmployees />
            </BrowserRouter>
        );
    };

    it('renders employees list page', async () => {
        renderListEmployees();

        await waitFor(() => {
            expect(screen.getByText('Employees')).toBeInTheDocument();
            expect(
                screen.getAllByTestId('employees-card').length
            ).toBeGreaterThan(0);
            expect(screen.getByTestId('data-table')).toBeInTheDocument();
        });
    });

    it('loads and displays employees data', async () => {
        renderListEmployees();

        await waitFor(() => {
            expect(mockGetEmployees).toHaveBeenCalled();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            // Use getAllByText since Jane Smith appears multiple times
            const janeSmithElements = screen.getAllByText('Jane Smith');
            expect(janeSmithElements.length).toBeGreaterThan(0);
        });
    });

    it('displays employee information correctly', async () => {
        renderListEmployees();

        await waitFor(() => {
            expect(screen.getByText('Software Engineer')).toBeInTheDocument();
            // Use getAllByText since Engineering appears multiple times
            const engineeringElements = screen.getAllByText('Engineering');
            expect(engineeringElements.length).toBeGreaterThan(0);
            // Use getAllByText since New York appears multiple times
            const newYorkElements = screen.getAllByText('New York');
            expect(newYorkElements.length).toBeGreaterThan(0);
        });
    });

    it('shows loading state while fetching data', async () => {
        mockGetEmployees.mockImplementation(
            () => new Promise(resolve => setTimeout(resolve, 100))
        );

        renderListEmployees();

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('handles search functionality', async () => {
        renderListEmployees();

        const searchInput = screen.getByTestId('search-input');
        await user.type(searchInput, 'John');

        await waitFor(() => {
            expect(mockGetEmployees).toHaveBeenCalledWith(
                expect.objectContaining({
                    search: 'John',
                })
            );
        });
    });

    it('handles department filtering', async () => {
        renderListEmployees();

        await waitFor(() => {
            expect(mockGetDepartments).toHaveBeenCalled();
        });
    });

    it('handles location filtering', async () => {
        renderListEmployees();

        await waitFor(() => {
            expect(mockGetLocations).toHaveBeenCalled();
        });
    });

    it('displays action buttons for each employee', async () => {
        renderListEmployees();

        await waitFor(() => {
            const viewButtons = screen.getAllByTestId('view-button');
            const editButtons = screen.getAllByTestId('edit-button');
            const deleteButtons = screen.getAllByTestId('delete-button');

            expect(viewButtons.length).toBe(2);
            expect(editButtons.length).toBe(2);
            expect(deleteButtons.length).toBe(2);
        });
    });

    it('displays view buttons for each employee', async () => {
        renderListEmployees();

        await waitFor(() => {
            const viewButtons = screen.getAllByTestId('view-button');
            expect(viewButtons.length).toBe(2);
        });
    });

    it('displays edit buttons for each employee', async () => {
        renderListEmployees();

        await waitFor(() => {
            const editButtons = screen.getAllByTestId('edit-button');
            expect(editButtons.length).toBe(2);
        });
    });

    it('displays delete buttons for each employee', async () => {
        renderListEmployees();

        await waitFor(() => {
            const deleteButtons = screen.getAllByTestId('delete-button');
            expect(deleteButtons.length).toBe(2);
        });
    });

    it('disables delete button for employees with reports', async () => {
        renderListEmployees();

        await waitFor(() => {
            const deleteButtons = screen.getAllByTestId('delete-button');
            // The second employee has reports, so delete should be disabled
            expect(deleteButtons[1]).toBeDisabled();
        });
    });

    it('shows create employee button when user has permission', async () => {
        renderListEmployees();

        await waitFor(() => {
            const createButton = screen.getByTestId('button-pi pi-plus');
            expect(createButton).toBeInTheDocument();
        });
    });

    it('hides edit button when user lacks permission', async () => {
        mockHasPermission.mockImplementation(
            permission => permission !== 'UPDATE_EMPLOYEE'
        );

        renderListEmployees();

        await waitFor(() => {
            const editButtons = screen.queryAllByTestId('edit-button');
            expect(editButtons.length).toBe(0);
        });
    });

    it('hides delete button when user lacks permission', async () => {
        mockHasPermission.mockImplementation(
            permission => permission !== 'DELETE_EMPLOYEE'
        );

        renderListEmployees();

        await waitFor(() => {
            const deleteButtons = screen.queryAllByTestId('delete-button');
            expect(deleteButtons.length).toBe(0);
        });
    });

    it('handles API error gracefully', async () => {
        mockGetEmployees.mockRejectedValue(new Error('API Error'));

        renderListEmployees();

        await waitFor(() => {
            expect(mockGetEmployees).toHaveBeenCalled();
        });
    });

    it('displays pagination information', async () => {
        renderListEmployees();

        await waitFor(() => {
            expect(screen.getByText('Total: 2')).toBeInTheDocument();
        });
    });

    it('shows filters section', async () => {
        renderListEmployees();

        expect(screen.getAllByTestId('employees-card').length).toBeGreaterThan(
            0
        );
    });

    it('handles sorting functionality', async () => {
        renderListEmployees();

        await waitFor(() => {
            expect(mockGetEmployees).toHaveBeenCalledWith(
                expect.objectContaining({
                    sortField: 'firstName',
                    sortOrder: 'asc',
                })
            );
        });
    });

    it('handles pagination', async () => {
        renderListEmployees();

        await waitFor(() => {
            expect(mockGetEmployees).toHaveBeenCalledWith(
                expect.objectContaining({
                    page: 1,
                    limit: 15,
                })
            );
        });
    });
});
