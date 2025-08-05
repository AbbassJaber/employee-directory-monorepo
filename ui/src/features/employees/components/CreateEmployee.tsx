import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalize } from '@/hooks/useLocalize';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { employeeService } from '@/services/employees.service';
import { miscellaneousService } from '@/services/miscellaneous.service';
import toast from 'react-hot-toast';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import ProfilePhotoUpload from '@/components/ProfilePhotoUpload';
import {
    EmployeePermission,
    Employee,
    DropdownOption,
    FormData,
    FormErrors,
} from '@/features/employees/types';
import { Department, Location } from '@/types';

const inputClassName =
    'w-full h-[38px] border border-gray-300 hover:border-blue-300 focus:border-blue-400 rounded-md transition-all duration-200';

const floatLabelClassName =
    'p-float-label relative transition-all duration-200 ease-in-out';

const CreateEmployee = () => {
    const navigate = useNavigate();
    const { l } = useLocalize();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<DropdownOption[]>([]);
    const [locations, setLocations] = useState<DropdownOption[]>([]);
    const [employees, setEmployees] = useState<DropdownOption[]>([]);
    const [permissions, setPermissions] = useState<EmployeePermission[]>([]);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        position: '',
        hireDate: new Date(),
        departmentId: null,
        locationId: null,
        reportsToId: null,
        permissions: [],
    });

    const [errors, setErrors] = useState<FormErrors>({});

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
            toast.error(l('employees.messages.failedToLoadDepartments'));
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
            toast.error(l('employees.messages.failedToLoadLocations'));
        }
    };

    const loadEmployees = async () => {
        try {
            const response = await employeeService.getAllEmployees();
            if (response.success) {
                const employeeOptions: DropdownOption[] = (response.data || [])
                    .filter(
                        (employee: Partial<Employee>) =>
                            employee.id !== undefined
                    )
                    .map((employee: Partial<Employee>) => ({
                        label: `${employee.firstName!} ${employee.lastName!}`,
                        value: employee.id!,
                    }));
                setEmployees(employeeOptions);
            }
        } catch (error) {
            toast.error(l('employees.messages.failedToLoadEmployees'));
        }
    };

    const loadPermissions = async () => {
        try {
            const response = await miscellaneousService.getPermissions();
            if (response.success) {
                setPermissions(response.data);
            }
        } catch (error) {
            toast.error(l('employees.messages.failedToLoadPermissions'));
        }
    };

    useEffect(() => {
        loadDepartments();
        loadLocations();
        loadEmployees();
        loadPermissions();
    }, []);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password?.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password?.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.position.trim()) {
            newErrors.position = 'Position is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
            newErrors.phone =
                'Phone must be in E.164 format (e.g.+96170123456)';
        }

        if (!formData.departmentId) {
            newErrors.departmentId = 'Department is required';
        }

        if (!formData.locationId) {
            newErrors.locationId = 'Location is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhotoSelect = (file: File | null) => {
        setFormData(prev => ({
            ...prev,
            profilePhoto: file || undefined,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await employeeService.createEmployee(formData);

            if (response.success) {
                toast.success(l('employees.messages.createSuccess'));
                navigate('/employees');
            } else {
                toast.error(
                    response.message || l('employees.messages.createFailed')
                );
            }
        } catch (error: any) {
            toast.error(error.message || l('employees.messages.createFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | { target: { name: string; value: any } }
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-primary">
                        {l('employees.actions.add')}
                    </h1>
                    <p className="text-sm text-secondary">
                        {l('employees.subtitle')}
                    </p>
                </div>
                <Button
                    icon="pi pi-arrow-left"
                    label={l('employees.messages.backToList')}
                    outlined
                    className="px-3 py-2 border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-600 transition-all duration-200"
                    onClick={() => navigate('/employees')}
                />
            </div>

            <Card className="p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Photo Upload - Full Width */}
                    <div className="md:col-span-2">
                        <ProfilePhotoUpload
                            onPhotoSelect={handlePhotoSelect}
                            selectedFile={formData.profilePhoto}
                            className="mb-6"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <FloatLabel className={floatLabelClassName}>
                                <InputText
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={inputClassName}
                                />
                                <label
                                    htmlFor="firstName"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.firstName')} *
                                </label>
                            </FloatLabel>
                            {errors.firstName && (
                                <small className="text-red-500">
                                    {errors.firstName}
                                </small>
                            )}
                        </div>

                        <div>
                            <FloatLabel className={floatLabelClassName}>
                                <InputText
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={inputClassName}
                                />
                                <label
                                    htmlFor="lastName"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.lastName')} *
                                </label>
                            </FloatLabel>
                            {errors.lastName && (
                                <small className="text-red-500">
                                    {errors.lastName}
                                </small>
                            )}
                        </div>

                        <div>
                            <FloatLabel className={floatLabelClassName}>
                                <InputText
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={inputClassName}
                                />
                                <label
                                    htmlFor="email"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.email')} *
                                </label>
                            </FloatLabel>
                            {errors.email && (
                                <small className="text-red-500">
                                    {errors.email}
                                </small>
                            )}
                        </div>

                        <div>
                            <FloatLabel className={floatLabelClassName}>
                                <Password
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    inputClassName={inputClassName}
                                    feedback={false}
                                    toggleMask
                                />
                                <label
                                    htmlFor="password"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.password')} *
                                </label>
                            </FloatLabel>
                            {errors.password && (
                                <small className="text-red-500">
                                    {errors.password}
                                </small>
                            )}
                        </div>

                        <div>
                            <FloatLabel className={floatLabelClassName}>
                                <InputText
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    className={inputClassName}
                                />
                                <label
                                    htmlFor="position"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.position')} *
                                </label>
                            </FloatLabel>
                            {errors.position && (
                                <small className="text-red-500">
                                    {errors.position}
                                </small>
                            )}
                        </div>

                        <div>
                            <FloatLabel className={floatLabelClassName}>
                                <InputText
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={inputClassName}
                                />
                                <label
                                    htmlFor="phone"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.phone')} * (e.g.
                                    +96170123456)
                                </label>
                            </FloatLabel>
                            {errors.phone && (
                                <small className="text-red-500">
                                    {errors.phone}
                                </small>
                            )}
                        </div>

                        <div>
                            <FloatLabel className={floatLabelClassName}>
                                <Calendar
                                    id="hireDate"
                                    name="hireDate"
                                    value={formData.hireDate}
                                    onChange={e =>
                                        handleInputChange({
                                            target: {
                                                name: 'hireDate',
                                                value: e.value,
                                            },
                                        })
                                    }
                                    className="w-full"
                                    inputClassName={inputClassName}
                                    showIcon
                                />
                                <label
                                    htmlFor="hireDate"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.hireDate')} *
                                </label>
                            </FloatLabel>
                            {errors.hireDate && (
                                <small className="text-red-500">
                                    {errors.hireDate}
                                </small>
                            )}
                        </div>

                        <div>
                            <FloatLabel className={floatLabelClassName}>
                                <Dropdown
                                    id="department"
                                    name="departmentId"
                                    value={formData.departmentId}
                                    onChange={e =>
                                        handleInputChange({
                                            target: {
                                                name: 'departmentId',
                                                value: e.value,
                                            },
                                        })
                                    }
                                    options={departments}
                                    optionLabel="label"
                                    optionValue="value"
                                    className={inputClassName}
                                />
                                <label
                                    htmlFor="department"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.department')} *
                                </label>
                            </FloatLabel>
                            {errors.departmentId && (
                                <small className="text-red-500">
                                    {errors.departmentId}
                                </small>
                            )}
                        </div>

                        <div>
                            <FloatLabel className={floatLabelClassName}>
                                <Dropdown
                                    id="location"
                                    name="locationId"
                                    value={formData.locationId}
                                    onChange={e =>
                                        handleInputChange({
                                            target: {
                                                name: 'locationId',
                                                value: e.value,
                                            },
                                        })
                                    }
                                    options={locations}
                                    optionLabel="label"
                                    optionValue="value"
                                    className={inputClassName}
                                />
                                <label
                                    htmlFor="location"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.location')} *
                                </label>
                            </FloatLabel>
                            {errors.locationId && (
                                <small className="text-red-500">
                                    {errors.locationId}
                                </small>
                            )}
                        </div>

                        <div>
                            <FloatLabel className={floatLabelClassName}>
                                <Dropdown
                                    id="reportsTo"
                                    name="reportsToId"
                                    value={formData.reportsToId}
                                    onChange={e =>
                                        handleInputChange({
                                            target: {
                                                name: 'reportsToId',
                                                value: e.value,
                                            },
                                        })
                                    }
                                    options={employees}
                                    optionLabel="label"
                                    optionValue="value"
                                    className={inputClassName}
                                />
                                <label
                                    htmlFor="reportsTo"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.reportsTo')}
                                </label>
                            </FloatLabel>
                            {errors.reportsToId && (
                                <small className="text-red-500">
                                    {errors.reportsToId}
                                </small>
                            )}
                        </div>

                        {/* Add permissions field - full width */}
                        <div className="md:col-span-2">
                            <FloatLabel className={floatLabelClassName}>
                                <MultiSelect
                                    id="permissions"
                                    name="permissions"
                                    value={formData.permissions}
                                    onChange={e =>
                                        handleInputChange({
                                            target: {
                                                name: 'permissions',
                                                value: e.value,
                                            },
                                        })
                                    }
                                    options={permissions}
                                    optionLabel="name"
                                    optionValue="name"
                                    className="w-full"
                                    display="chip"
                                />
                                <label
                                    htmlFor="permissions"
                                    className="transition-all duration-200"
                                >
                                    {l('employees.fields.permissions')}
                                </label>
                            </FloatLabel>
                            {errors.permissions && (
                                <small className="text-red-500">
                                    {errors.permissions}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            label={l('common.actions.cancel')}
                            outlined
                            className="px-4 py-2 border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-600 transition-all duration-200"
                            onClick={() => navigate('/employees')}
                        />
                        <Button
                            type="submit"
                            label={l('employees.actions.create')}
                            loading={loading}
                            className="px-4 py-2 bg-blue-400 hover:bg-blue-500 border-blue-400 hover:border-blue-500 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateEmployee;
