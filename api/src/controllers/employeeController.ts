import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import EmployeeService from '@/services/employeeService';
import AssetService from '@/services/assetService';
import { asyncHandler } from '@/utils/errors';
import { ApiResponse, PaginationParams } from '@/types';
import { parseIdArray } from '@/utils/helpers';

class EmployeeController {
    static getEmployee = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const employeeId = parseInt(req.params['id'] || '0');
            const employee = await EmployeeService.getEmployeeById(employeeId);

            const response: ApiResponse = {
                success: true,
                data: employee,
                message: 'Employee retrieved successfully',
            };

            res.status(200).json(response);
        }
    );

    static listEmployees = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const page = parseInt(req.query['page'] as string) || 1;
            const limit = parseInt(req.query['limit'] as string) || 15;
            const offset = (page - 1) * limit;
            const search = req.query['search'] as string | undefined;

            const filters = req.query['filters'] as any;

            const departmentIds = parseIdArray(filters?.departmentIds);
            const locationIds = parseIdArray(filters?.locationIds);
            const reportsToIds = parseIdArray(filters?.reportsToIds);

            const sortField = req.query['sortField'] as string;
            const sortOrder = req.query['sortOrder'] as 'asc' | 'desc';

            const pagination: PaginationParams = {
                page,
                limit,
                offset,
                sortField,
                sortOrder,
            };

            const filterParams = {
                ...(search && { search }),
                ...(departmentIds && { departmentIds }),
                ...(locationIds && { locationIds }),
                ...(reportsToIds && { reportsToIds }),
            };

            const result = await EmployeeService.listEmployees(
                pagination,
                filterParams
            );

            const response: ApiResponse = {
                success: true,
                data: result,
            };

            res.status(200).json(response);
        }
    );

    static listAllEmployees = asyncHandler(
        async (_: AuthenticatedRequest, res: Response) => {
            const result = await EmployeeService.listAllEmployees();

            const response: ApiResponse = {
                success: true,
                data: result,
            };

            res.status(200).json(response);
        }
    );

    static listReportingManagers = asyncHandler(
        async (_: AuthenticatedRequest, res: Response) => {
            const result = await EmployeeService.listReportingManagers();
            const response: ApiResponse = {
                success: true,
                data: result,
            };
            res.status(200).json(response);
        }
    );

    static createEmployee = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            // Parse permissions if it's a JSON string
            let employeeData = { ...req.body };
            if (typeof employeeData.permissions === 'string') {
                try {
                    employeeData.permissions = JSON.parse(
                        employeeData.permissions
                    );
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid permissions format',
                    });
                }
            }

            // Convert string IDs to integers
            if (employeeData.departmentId) {
                employeeData.departmentId = parseInt(
                    employeeData.departmentId as string
                );
            }
            if (employeeData.locationId) {
                employeeData.locationId = parseInt(
                    employeeData.locationId as string
                );
            }
            if (employeeData.reportsToId) {
                employeeData.reportsToId = parseInt(
                    employeeData.reportsToId as string
                );
            }

            // Handle profile photo if uploaded
            let profileAssetId: number | undefined;
            if (req.file) {
                const asset = await AssetService.createAsset(req.file);
                profileAssetId = asset.id;
            }

            const employee = await EmployeeService.createEmployee(
                employeeData,
                profileAssetId
            );

            const response: ApiResponse = {
                success: true,
                data: employee,
                message: 'Employee created successfully',
            };

            return res.status(201).json(response);
        }
    );

    static updateEmployee = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const employeeId = parseInt(req.params['id'] || '0');

            // Parse permissions if it's a JSON string
            let employeeData = { ...req.body };
            if (typeof employeeData.permissions === 'string') {
                try {
                    employeeData.permissions = JSON.parse(
                        employeeData.permissions
                    );
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid permissions format',
                    });
                }
            }

            if (employeeData.departmentId) {
                employeeData.departmentId = parseInt(
                    employeeData.departmentId as string
                );
            }
            if (employeeData.locationId) {
                employeeData.locationId = parseInt(
                    employeeData.locationId as string
                );
            }
            if (employeeData.reportsToId) {
                employeeData.reportsToId = parseInt(
                    employeeData.reportsToId as string
                );
            }

            let profileAssetId: number | null | undefined = undefined;

            if (req.file) {
                // New photo uploaded
                const asset = await AssetService.createAsset(req.file);
                profileAssetId = asset.id;
            } else if (req.body.removeProfilePhoto === 'true') {
                // Photo explicitly removed
                profileAssetId = null;
            }

            const employee = await EmployeeService.updateEmployee(
                employeeId,
                employeeData,
                profileAssetId
            );

            const response: ApiResponse = {
                success: true,
                data: employee,
                message: 'Employee updated successfully',
            };

            return res.status(200).json(response);
        }
    );

    static deleteEmployee = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const employeeId = parseInt(req.params['id'] || '0');
            await EmployeeService.deleteEmployee(employeeId, req.user!.id);

            const response: ApiResponse = {
                success: true,
                message: 'Employee deleted successfully',
            };

            return res.status(200).json(response);
        }
    );
}
export default EmployeeController;
