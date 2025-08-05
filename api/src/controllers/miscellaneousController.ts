import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import MiscellaneousService from '@/services/miscellaneousService';
import { asyncHandler } from '@/utils/errors';
import { ApiResponse } from '@/types';

class MiscellaneousController {
    static getPermissions = asyncHandler(
        async (_: AuthenticatedRequest, res: Response) => {
            const permissions = await MiscellaneousService.listPermissions();

            const response: ApiResponse = {
                success: true,
                data: permissions,
            };

            res.status(200).json(response);
        }
    );

    static getDepartments = asyncHandler(
        async (_: AuthenticatedRequest, res: Response) => {
            const departments = await MiscellaneousService.listDepartments();

            const response: ApiResponse = {
                success: true,
                data: departments,
            };

            res.status(200).json(response);
        }
    );

    static getLocations = asyncHandler(
        async (_: AuthenticatedRequest, res: Response) => {
            const locations = await MiscellaneousService.listLocations();

            const response: ApiResponse = {
                success: true,
                data: locations,
            };

            res.status(200).json(response);
        }
    );
}

export default MiscellaneousController;
