import { Router } from 'express';
import EmployeeController from '@/controllers/employeeController';
import { uploadProfilePhoto } from '@/middleware/upload';
import {
    createEmployeeValidation,
    updateEmployeeValidation,
    getEmployeeValidation,
    listEmployeesValidation,
} from '@/validators/employees';
import { authenticate } from '@/middleware/auth';
import {
    requirePermission,
    canAccessEmployee,
    canModifyEmployee,
    canDeleteEmployee,
} from '@/middleware/permissions';
import { PERMISSIONS } from '@/constants/permissions';

const router = Router();

router.get(
    '/reporting-managers',
    authenticate,
    requirePermission(PERMISSIONS.READ_EMPLOYEE),
    EmployeeController.listReportingManagers
);

router.get(
    '/',
    authenticate,
    requirePermission(PERMISSIONS.READ_EMPLOYEE),
    listEmployeesValidation,
    EmployeeController.listEmployees
);

router.get(
    '/all',
    authenticate,
    requirePermission(PERMISSIONS.READ_EMPLOYEE),
    EmployeeController.listAllEmployees
);

router.post(
    '/',
    authenticate,
    requirePermission(PERMISSIONS.CREATE_EMPLOYEE),
    uploadProfilePhoto,
    createEmployeeValidation,
    EmployeeController.createEmployee
);

router.get(
    '/:id',
    authenticate,
    canAccessEmployee(),
    getEmployeeValidation,
    EmployeeController.getEmployee
);

router.put(
    '/:id',
    authenticate,
    canModifyEmployee(),
    uploadProfilePhoto,
    updateEmployeeValidation,
    EmployeeController.updateEmployee
);

router.delete(
    '/:id',
    authenticate,
    canDeleteEmployee(),
    getEmployeeValidation,
    EmployeeController.deleteEmployee
);

export default router;
