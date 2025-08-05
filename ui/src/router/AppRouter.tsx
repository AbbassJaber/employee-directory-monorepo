import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
    withAuth,
    withReadEmployee,
    withCreateEmployee,
    withUpdateEmployee,
} from './ProtectedRoute';
import LoginPage from '../features/auth/components/LoginPage';
import Dashboard from '../features/dashboard/components/Dashboard';
import ListEmployees from '../features/employees/components/ListEmployees';
import CreateEmployee from '../features/employees/components/CreateEmployee';
import UpdateEmployee from '../features/employees/components/UpdateEmployee';
import ViewEmployee from '../features/employees/components/ViewEmployee';

const AppRouter = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={withAuth(<Navigate to="/dashboard" replace />)}
                />
                <Route path="/dashboard" element={withAuth(<Dashboard />)} />
                <Route path="/employees" element={withReadEmployee(<Outlet />)}>
                    <Route index element={<ListEmployees />} />
                    <Route
                        path="create"
                        element={withCreateEmployee(<CreateEmployee />)}
                    />
                    <Route
                        path=":id/edit"
                        element={withUpdateEmployee(<UpdateEmployee />)}
                    />
                    <Route
                        path=":id/view"
                        element={withReadEmployee(<ViewEmployee />)}
                    />
                </Route>
                <Route path="/profile" element={withAuth(<Outlet />)}>
                    <Route index element={<ViewEmployee isProfile={true} />} />
                </Route>
            </Routes>
        </div>
    );
};

export default AppRouter;
