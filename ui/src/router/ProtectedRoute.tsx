import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ProgressSpinner } from 'primereact/progressspinner';
import AppLayout from '../components/AppLayout';
import { ReactNode } from 'react';
import { PERMISSIONS } from '../utils/constants';

type Permission = keyof typeof PERMISSIONS;

export const withPermission = (
    component: ReactNode,
    permission?: Permission
) => (
    <ProtectedRoute
        permission={permission ? PERMISSIONS[permission] : undefined}
    >
        {component}
    </ProtectedRoute>
);

interface ProtectedRouteProps {
    children: React.ReactNode;
    permission?: string;
}

export const withAuth = (component: ReactNode) => withPermission(component);
export const withReadEmployee = (component: ReactNode) =>
    withPermission(component, 'READ_EMPLOYEE');
export const withCreateEmployee = (component: ReactNode) =>
    withPermission(component, 'CREATE_EMPLOYEE');
export const withUpdateEmployee = (component: ReactNode) =>
    withPermission(component, 'UPDATE_EMPLOYEE');
export const withDeleteEmployee = (component: ReactNode) =>
    withPermission(component, 'DELETE_EMPLOYEE');

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    permission,
}) => {
    const { isAuthenticated, isLoading, hasPermission } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <ProgressSpinner
                    style={{ width: '50px', height: '50px' }}
                    strokeWidth="8"
                />
            </div>
        );
    }
    if (!isAuthenticated) {
        // Redirect to login with the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (permission && !hasPermission(permission)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <AppLayout>{children}</AppLayout>;
};

export default ProtectedRoute;
