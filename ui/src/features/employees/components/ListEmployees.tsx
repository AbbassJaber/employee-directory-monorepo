import { useState, useEffect } from 'react';
import { useLocalize } from '@/hooks/useLocalize';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FloatLabel } from 'primereact/floatlabel';
import { cn } from '@/utils/cn';
import { employeeService } from '@/services/employees.service';
import toast from 'react-hot-toast';
import { Employee } from '@/features/employees/types';
import useDebounce from '@/hooks/useDebounce';
import { miscellaneousService } from '@/services/miscellaneous.service';
import { useNavigate } from 'react-router-dom';
import { Location, Department } from '@/types';
import { PERMISSIONS } from '@/utils/constants';
import { useAuthStore } from '@/stores/authStore';

interface DropdownOption {
    label: string;
    value: number | null;
}

const ListEmployees = () => {
    const { l } = useLocalize();
    const navigate = useNavigate();
    const { hasPermission } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 400);
    const [selectedDepartments, setSelectedDepartments] = useState<number[]>(
        []
    );
    const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
    const [selectedReportsTo, setSelectedReportsTo] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(15);
    const [departments, setDepartments] = useState<DropdownOption[]>([
        { label: 'All Departments', value: null },
    ]);
    const [locations, setLocations] = useState<DropdownOption[]>([
        { label: 'All Locations', value: null },
    ]);
    const [managers, setManagers] = useState<DropdownOption[]>([
        { label: 'All Managers', value: null },
    ]);
    const [sortField, setSortField] = useState<string>('firstName');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const loadEmployees = async () => {
        try {
            setLoading(true);
            const response = await employeeService.getEmployees({
                page: page + 1,
                limit,
                search: debouncedSearchQuery || undefined,
                sortField,
                sortOrder,
                filters: {
                    departmentIds:
                        selectedDepartments.length > 0
                            ? selectedDepartments
                            : undefined,
                    locationIds:
                        selectedLocations.length > 0
                            ? selectedLocations
                            : undefined,
                    reportsToIds:
                        selectedReportsTo.length > 0
                            ? selectedReportsTo
                            : undefined,
                },
            });

            if (response.success) {
                setEmployees(response.data.employees);
                setTotalRecords(response.data.paginationMetadata.total);
            } else {
                toast.error('Failed to load employees');
            }
        } catch (error) {
            toast.error('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const loadDepartments = async () => {
        try {
            const response = await miscellaneousService.getDepartments();
            if (response.success) {
                const departmentOptions: DropdownOption[] = (
                    response.data || []
                ).map((dept: Partial<Department>) => ({
                    label: dept.name!,
                    value: dept.id!,
                }));
                setDepartments(departmentOptions);
            }
        } catch (error) {
            toast.error('Failed to load departments');
        }
    };

    const loadLocations = async () => {
        try {
            const response = await miscellaneousService.getLocations();
            if (response.success) {
                const locationOptions: DropdownOption[] = (
                    response.data || []
                ).map((loc: Partial<Location>) => ({
                    label: loc.name!,
                    value: loc.id!,
                }));
                setLocations(locationOptions);
            }
        } catch (error) {
            toast.error('Failed to load locations');
        }
    };

    const loadAllEmployees = async () => {
        try {
            const response = await employeeService.getReportingManagers();
            if (response.success) {
                const employeeOptions: DropdownOption[] = (
                    response.data || []
                ).map(emp => ({
                    label: `${emp.firstName!} ${emp.lastName!}`,
                    value: emp.id!,
                }));
                setManagers(employeeOptions);
            }
        } catch (error) {
            toast.error('Failed to load locations');
        }
    };

    useEffect(() => {
        loadDepartments();
        loadLocations();
        loadAllEmployees();
    }, []);

    const onSort = (event: {
        sortField: string;
        sortOrder: number | null | undefined;
    }) => {
        if (
            event.sortField &&
            event.sortOrder !== undefined &&
            event.sortOrder !== null
        ) {
            setSortField(event.sortField);
            setSortOrder(event.sortOrder === 1 ? 'asc' : 'desc');
            setPage(0);
        }
    };

    // Load employees when filters, sorting, or debounced search changes
    useEffect(() => {
        loadEmployees();
    }, [
        page,
        limit,
        debouncedSearchQuery,
        selectedDepartments,
        selectedLocations,
        selectedReportsTo,
        sortField,
        sortOrder,
    ]);

    const onPage = (event: { first: number; rows: number }) => {
        setPage(Math.floor(event.first / event.rows));
        setLimit(event.rows);
    };

    const nameBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex items-center gap-2">
                <Avatar
                    image={rowData.profileAsset?.cloudFrontUrl || undefined}
                    label={
                        !rowData.profileAsset?.cloudFrontUrl
                            ? `${rowData.firstName.charAt(0)}${rowData.lastName.charAt(0)}`
                            : undefined
                    }
                    size="normal"
                    shape="circle"
                    className={cn(
                        'w-8 h-8',
                        !rowData.profileAsset?.cloudFrontUrl &&
                            'bg-primary text-white text-xs'
                    )}
                    style={
                        !rowData.profileAsset?.cloudFrontUrl
                            ? { fontSize: '0.75rem' }
                            : undefined
                    }
                />
                <div className="min-w-0">
                    <div className="font-medium text-primary text-sm truncate">
                        {rowData.firstName} {rowData.lastName}
                    </div>
                    <div className="text-xs text-secondary truncate">
                        {rowData.email}
                    </div>
                </div>
            </div>
        );
    };

    const departmentBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex items-center gap-1">
                <i className="pi pi-building text-secondary text-xs" />
                <span className="text-primary text-sm">
                    {rowData.department.name}
                </span>
            </div>
        );
    };

    const locationBodyTemplate = (rowData: Employee) => {
        return (
            <div className="flex items-center gap-1">
                <i className="pi pi-map-marker text-secondary text-xs" />
                <span className="text-primary text-sm">
                    {rowData.location.name}
                </span>
            </div>
        );
    };

    const reportsToBodyTemplate = (rowData: Employee) => {
        return (
            <span className="text-primary text-sm">
                {rowData.reportsTo?.firstName} {rowData.reportsTo?.lastName}
            </span>
        );
    };

    const positionBodyTemplate = (rowData: Employee) => {
        return <span className="text-primary text-sm">{rowData.position}</span>;
    };

    const handleDeleteEmployee = async (id: number) => {
        try {
            const response = await employeeService.deleteEmployee(id);
            if (response.success) {
                toast.success('Employee deleted successfully');
                loadEmployees();
            } else {
                toast.error('Failed to delete employee');
            }
        } catch (error) {
            toast.error('Failed to delete employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-primary">
                        {l('employees.title')}
                    </h1>
                    <p className="text-sm text-secondary">
                        {l('employees.subtitle')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        icon={`pi ${showFilters ? 'pi-filter-slash' : 'pi-filter'}`}
                        label={l('common.actions.filter')}
                        outlined
                        size="small"
                        className={cn(
                            'px-3 py-2 border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-600 transition-all duration-200',
                            showFilters
                                ? 'bg-blue-100 border-blue-300 text-blue-600'
                                : ''
                        )}
                        onClick={() => setShowFilters(!showFilters)}
                        tooltip={
                            showFilters
                                ? l('common.actions.hideFilters')
                                : l('common.actions.showFilters')
                        }
                        tooltipOptions={{ position: 'top' }}
                    />
                    {hasPermission(PERMISSIONS.CREATE_EMPLOYEE) && (
                        <Button
                            icon="pi pi-plus"
                            label={l('employees.actions.create')}
                            className="bg-blue-400 hover:bg-blue-500 border-blue-400 hover:border-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                            size="small"
                            onClick={() => navigate('/employees/create')}
                        />
                    )}
                </div>
            </div>

            <div
                className={`transition-all duration-300 ease-in-out ${
                    showFilters
                        ? 'max-h-screen opacity-100'
                        : 'max-h-0 opacity-0'
                }`}
            >
                <Card className="p-3 sm:p-2 rounded-lg mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3">
                        <div>
                            <FloatLabel className="w-full">
                                <MultiSelect
                                    id="department"
                                    value={selectedDepartments}
                                    onChange={e =>
                                        setSelectedDepartments(e.value)
                                    }
                                    options={departments}
                                    optionLabel="label"
                                    optionValue="value"
                                    className="w-full text-sm border border-gray-300 hover:border-blue-300 focus:border-blue-400 rounded-md transition-all duration-200"
                                    panelClassName="text-sm"
                                    showClear
                                    display="chip"
                                />
                                <label
                                    htmlFor="department"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.department')}
                                </label>
                            </FloatLabel>
                        </div>
                        <div>
                            <FloatLabel className="w-full">
                                <MultiSelect
                                    id="location"
                                    value={selectedLocations}
                                    onChange={e =>
                                        setSelectedLocations(e.value)
                                    }
                                    options={locations}
                                    optionLabel="label"
                                    optionValue="value"
                                    className="w-full text-sm border border-gray-300 hover:border-blue-300 focus:border-blue-400 rounded-md transition-all duration-200"
                                    panelClassName="text-sm"
                                    showClear
                                    display="chip"
                                />
                                <label
                                    htmlFor="location"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.location')}
                                </label>
                            </FloatLabel>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                            <FloatLabel className="w-full">
                                <MultiSelect
                                    id="reportsTo"
                                    value={selectedReportsTo}
                                    onChange={e =>
                                        setSelectedReportsTo(e.value)
                                    }
                                    options={managers}
                                    optionLabel="label"
                                    optionValue="value"
                                    className="w-full text-sm border border-gray-300 hover:border-blue-300 focus:border-blue-400 rounded-md transition-all duration-200"
                                    panelClassName="text-sm"
                                    showClear
                                    display="chip"
                                />
                                <label
                                    htmlFor="reportsTo"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.reportsTo')}
                                </label>
                            </FloatLabel>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-0 rounded-lg">
                <div className="p-4 pt-0 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <FloatLabel className="w-full">
                                    <InputText
                                        id="search"
                                        value={searchQuery}
                                        onChange={e =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full text-sm border border-gray-300 hover:border-blue-300 focus:border-blue-400 rounded-md transition-all duration-200 pr-8"
                                        size="small"
                                    />
                                    <label
                                        htmlFor="search"
                                        className="transition-all duration-200"
                                    >
                                        {l('common.actions.search')}
                                    </label>
                                </FloatLabel>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        type="button"
                                    >
                                        <i className="pi pi-times text-xs" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                                {totalRecords}{' '}
                                {totalRecords === 1 ? 'employee' : 'employees'}
                            </span>
                        </div>
                    </div>
                </div>

                <DataTable
                    value={employees}
                    lazy
                    paginator
                    first={page * limit}
                    rows={limit}
                    totalRecords={totalRecords}
                    onPage={onPage}
                    onSort={onSort}
                    sortField={sortField}
                    sortOrder={sortOrder === 'asc' ? 1 : -1}
                    loading={loading}
                    rowsPerPageOptions={[10, 15, 25, 50]}
                    tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    emptyMessage="No employees found"
                    className="p-datatable-sm p-datatable-gridlines"
                    paginatorClassName="text-sm"
                    stripedRows
                    size="small"
                    responsiveLayout="scroll"
                    scrollable
                    scrollHeight="500px"
                >
                    <Column
                        field="firstName"
                        header={l('employees.fields.firstName')}
                        body={nameBodyTemplate}
                        sortable
                        sortField="firstName"
                        style={{ minWidth: '200px', padding: '0.5rem' }}
                        headerStyle={{
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                        }}
                    />
                    <Column
                        field="position"
                        header={l('employees.fields.position')}
                        body={positionBodyTemplate}
                        sortable
                        sortField="position"
                        style={{ minWidth: '140px', padding: '0.5rem' }}
                        headerStyle={{
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                        }}
                    />
                    <Column
                        field="reportsTo.firstName"
                        header={l('employees.fields.reportsTo')}
                        body={reportsToBodyTemplate}
                        sortable
                        sortField="reportsTo.firstName"
                        style={{ minWidth: '140px', padding: '0.5rem' }}
                        headerStyle={{
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                        }}
                    />
                    <Column
                        field="department.name"
                        header={l('employees.fields.department')}
                        body={departmentBodyTemplate}
                        sortable
                        sortField="department.name"
                        style={{ minWidth: '120px', padding: '0.5rem' }}
                        headerStyle={{
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                        }}
                    />
                    <Column
                        field="location.name"
                        header={l('employees.fields.location')}
                        body={locationBodyTemplate}
                        sortable
                        sortField="location.name"
                        style={{ minWidth: '100px', padding: '0.5rem' }}
                        headerStyle={{
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                        }}
                    />
                    <Column
                        header={l('common.table.actions')}
                        body={rowData => (
                            <div className="flex gap-1">
                                <Button
                                    icon="pi pi-eye"
                                    size="small"
                                    text
                                    rounded
                                    severity="info"
                                    className="p-1 w-7 h-7"
                                    tooltip={l('common.actions.view')}
                                    tooltipOptions={{ position: 'top' }}
                                    onClick={() =>
                                        navigate(
                                            `/employees/${rowData.id}/view`
                                        )
                                    }
                                />
                                {hasPermission(PERMISSIONS.UPDATE_EMPLOYEE) && (
                                    <Button
                                        icon="pi pi-pencil"
                                        size="small"
                                        text
                                        rounded
                                        severity="secondary"
                                        className="p-1 w-7 h-7"
                                        tooltip={l('common.actions.edit')}
                                        tooltipOptions={{ position: 'top' }}
                                        onClick={() =>
                                            navigate(
                                                `/employees/${rowData.id}/edit`
                                            )
                                        }
                                    />
                                )}
                                {hasPermission(PERMISSIONS.DELETE_EMPLOYEE) && (
                                    <Button
                                        icon="pi pi-trash"
                                        size="small"
                                        text
                                        rounded
                                        severity="danger"
                                        className={cn('p-1 w-7 h-7', {
                                            'opacity-50 cursor-not-allowed':
                                                rowData.reports &&
                                                rowData.reports.length > 0,
                                        })}
                                        tooltip={l('common.actions.delete')}
                                        tooltipOptions={{ position: 'top' }}
                                        disabled={
                                            rowData.reports &&
                                            rowData.reports.length > 0
                                        }
                                        onClick={() =>
                                            handleDeleteEmployee(rowData.id)
                                        }
                                    />
                                )}
                            </div>
                        )}
                        style={{ width: '120px' }}
                    />
                </DataTable>
            </Card>
        </div>
    );
};

export default ListEmployees;
