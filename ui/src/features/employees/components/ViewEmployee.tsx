import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { useLocalize } from '@/hooks/useLocalize';
import { employeeService } from '../../../services/employees.service';
import { useAuthStore } from '../../../stores/authStore';
import { cn } from '../../../utils/cn';
import { PERMISSIONS } from '@/utils/constants';

interface ViewEmployeeProps {
    employeeId?: number; // Optional - if not provided, shows current user
    isProfile?: boolean; // Whether this is being used for profile view
}

const ViewEmployee: React.FC<ViewEmployeeProps> = ({
    employeeId,
    isProfile = false,
}) => {
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthStore();
    const { l } = useLocalize();
    const navigate = useNavigate();
    const params = useParams();
    const { hasPermission } = useAuthStore();
    // Determine which employee ID to fetch
    const targetEmployeeId =
        employeeId || (isProfile ? user?.id : parseInt(params.id || '0'));

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!targetEmployeeId) {
                setError(l('employees.view.employeeNotFound'));
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response =
                    await employeeService.getEmployeeById(targetEmployeeId);
                setEmployee(response.data);
                setError(null);
            } catch (err: any) {
                setError(
                    err.response?.data?.error ||
                        l('employees.view.failedToFetchEmployee')
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [targetEmployeeId]);

    const handleEdit = () => {
        navigate(`/employees/${targetEmployeeId}/edit`);
    };

    const handleBack = () => {
        if (isProfile) {
            navigate('/dashboard');
        } else {
            navigate('/employees');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <ProgressSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Message severity="error" text={error} />
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Message
                    severity="warn"
                    text={l('employees.view.employeeNotFound')}
                />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <Card className="shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Avatar
                            image={
                                employee.profileAsset?.cloudFrontUrl ||
                                undefined
                            }
                            label={
                                !employee.profileAsset?.cloudFrontUrl
                                    ? `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`
                                    : undefined
                            }
                            size="xlarge"
                            shape="circle"
                            className={cn(
                                'w-16 h-16 sm:w-20 sm:h-20',
                                !employee.profileAsset?.cloudFrontUrl &&
                                    'bg-primary text-white text-xl sm:text-2xl'
                            )}
                        />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                                {employee.firstName} {employee.lastName}
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 truncate">
                                {employee.position}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {employee.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        {!isProfile &&
                            hasPermission(PERMISSIONS.UPDATE_EMPLOYEE) && (
                                <Button
                                    icon="pi pi-pencil"
                                    label={l('employees.view.edit')}
                                    className="p-button-outlined text-xs sm:text-sm"
                                    onClick={handleEdit}
                                />
                            )}
                        <Button
                            icon="pi pi-arrow-left"
                            label={l('employees.view.back')}
                            className="p-button-secondary text-xs sm:text-sm"
                            onClick={handleBack}
                        />
                    </div>
                </div>

                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            {l('employees.view.contactInformation')}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    {l('employees.view.email')}
                                </label>
                                <p className="text-gray-900 dark:text-gray-100 break-words">
                                    {employee.email}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    {l('employees.view.phone')}
                                </label>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {employee.phone}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            {l('employees.view.workInformation')}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    {l('employees.view.position')}
                                </label>
                                <p className="text-gray-900">
                                    {employee.position}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    {l('employees.view.hireDate')}
                                </label>
                                <p className="text-gray-900">
                                    {new Date(
                                        employee.hireDate
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            {l('employees.view.department')}
                        </h3>
                        <div className="flex items-center gap-3">
                            <i className="pi pi-building text-blue-500 text-xl"></i>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {employee.department?.name ||
                                        l('employees.view.notAssigned')}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            {l('employees.view.location')}
                        </h3>
                        <div className="flex items-center gap-3">
                            <i className="pi pi-map-marker text-green-500 text-xl"></i>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {employee.location?.name ||
                                        l('employees.view.notAssigned')}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="shadow-sm mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:!text-gray-200">
                        {l('employees.view.reportingStructure')}
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                {l('employees.view.reportsTo')}
                            </label>
                            <div className="flex items-center gap-3 mt-1">
                                {employee.reportsTo ? (
                                    <>
                                        <Avatar
                                            label={`${employee.reportsTo.firstName.charAt(0)}${employee.reportsTo.lastName.charAt(0)}`}
                                            size="normal"
                                            shape="circle"
                                            className="bg-blue-100 text-blue-600 text-xs w-8 h-8"
                                        />
                                        <p className="text-gray-900">
                                            {employee.reportsTo.firstName}{' '}
                                            {employee.reportsTo.lastName}
                                        </p>
                                        <span className="text-gray-500">
                                            ({employee.reportsTo.email})
                                        </span>
                                    </>
                                ) : (
                                    <p className="text-gray-500">
                                        {l('employees.view.noManagerAssigned')}
                                    </p>
                                )}
                            </div>
                        </div>
                        {employee.reports && employee.reports.length > 0 && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    {l('employees.view.directReports')}
                                </label>
                                <div className="mt-2 space-y-2">
                                    {employee.reports.map((report: any) => (
                                        <div
                                            key={report.id}
                                            className="flex items-center gap-3"
                                        >
                                            <Avatar
                                                label={`${report.firstName?.charAt(0)}${report.lastName?.charAt(0)}`}
                                                size="normal"
                                                shape="circle"
                                                className="bg-green-100 text-green-600 text-xs w-8 h-8"
                                            />
                                            <p className="text-gray-900">
                                                {report.firstName}{' '}
                                                {report.lastName}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        {l('employees.view.permissions')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {employee.permissions &&
                        employee.permissions.length > 0 ? (
                            employee.permissions.map((permission: any) => (
                                <Badge
                                    key={permission.name}
                                    value={permission.name}
                                    severity="info"
                                    className="text-xs"
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">
                                {l('employees.view.noPermissionsAssigned')}
                            </p>
                        )}
                    </div>
                </Card>
            </Card>
        </div>
    );
};

export default ViewEmployee;
