import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
import { AuthenticationError, ForbiddenError } from '@/utils/errors';
import { PERMISSIONS } from '@/constants/permissions';
import { asyncHandler } from '@/utils/errors';

export const requirePermission = (permissionName: string) => {
    return asyncHandler(
        async (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
            if (!req.user) {
                throw new AuthenticationError('Authentication required');
            }

            const hasPermission = req.user.permissions.some(
                permission => permission.name === permissionName
            );

            if (!hasPermission) {
                throw new ForbiddenError(
                    `Permission '${permissionName}' required`
                );
            }

            next();
        }
    );
};

export const canAccessEmployee = (employeeIdParam: string = 'id') => {
    return asyncHandler(
        async (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
            if (!req.user) {
                throw new AuthenticationError('Authentication required');
            }

            const targetEmployeeId = parseInt(
                req.params[employeeIdParam] || '0'
            );

            // Users can always access their own profile
            if (req.user.id === targetEmployeeId) {
                return next();
            }

            // Check if user has permission to read employees
            const hasReadPermission = req.user.permissions.some(
                permission => permission.name === PERMISSIONS.READ_EMPLOYEE
            );

            if (!hasReadPermission) {
                throw new ForbiddenError(
                    'Permission to read employee data required'
                );
            }

            next();
        }
    );
};

export const canModifyEmployee = (employeeIdParam: string = 'id') => {
    return asyncHandler(
        async (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
            if (!req.user) {
                throw new AuthenticationError('Authentication required');
            }

            const targetEmployeeId = parseInt(
                req.params[employeeIdParam] || '0'
            );

            // Users can always modify their own profile
            if (req.user.id === targetEmployeeId) {
                return next();
            }

            // Check if user has permission to update employees
            const hasUpdatePermission = req?.user?.permissions?.some(
                permission => permission.name === PERMISSIONS.UPDATE_EMPLOYEE
            );

            if (!hasUpdatePermission) {
                throw new ForbiddenError(
                    'Permission to update employee data required'
                );
            }

            next();
        }
    );
};

export const canDeleteEmployee = (employeeIdParam: string = 'id') => {
    return asyncHandler(
        async (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
            const targetEmployeeId = parseInt(
                req.params[employeeIdParam] || '0'
            );

            // Users cannot delete themselves
            if (req!.user!.id === targetEmployeeId) {
                throw new ForbiddenError('Cannot delete your own account');
            }

            // Check if user has permission to delete employees
            const hasDeletePermission = req?.user?.permissions?.some(
                permission => permission.name === PERMISSIONS.DELETE_EMPLOYEE
            );

            if (!hasDeletePermission) {
                throw new ForbiddenError(
                    'Permission to delete employees required'
                );
            }

            next();
        }
    );
};
