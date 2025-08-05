import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import AuthService from '@/services/authService';
import { asyncHandler } from '@/utils/errors';
import { ApiResponse } from '@/types';
import { ENV } from '@/utils/constants';

class AuthController {
    static login = asyncHandler(async (req: Request, res: Response) => {
        const result = await AuthService.login(req.body);

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env['NODE_ENV'] === ENV.PROD,
            sameSite: 'strict',
            maxAge: +process.env['JWT_REFRESH_EXPIRES_IN']!,
            path: '/',
        });

        const response: ApiResponse = {
            success: true,
            data: {
                accessToken: result.accessToken,
                user: result.user,
            },
            message: 'Login successful',
        };

        return res.status(200).json(response);
    });

    static refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const refreshTokenId = req.cookies['refreshToken'];

        if (!refreshTokenId) {
            return res.status(401).json({
                success: false,
                error: 'Refresh token not found',
            });
        }

        const result = await AuthService.refreshToken(refreshTokenId);

        // Set new refresh token as HTTP-only cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env['NODE_ENV'] === ENV.PROD,
            sameSite: 'strict',
            maxAge: +process.env['JWT_REFRESH_EXPIRES_IN']!,
            path: '/',
        });

        const response: ApiResponse = {
            success: true,
            data: {
                accessToken: result.accessToken,
            },
            message: 'Token refreshed successfully',
        };
        return res.status(200).json(response);
    });

    static logout = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const refreshTokenId = req.cookies['refreshToken'];

            if (refreshTokenId) {
                try {
                    await AuthService.logout(refreshTokenId);
                } catch (error) {}
            }

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === ENV.PROD,
                sameSite: 'strict',
                path: '/',
            });

            const response: ApiResponse = {
                success: true,
                message: 'Logout successful',
            };

            return res.status(200).json(response);
        }
    );
}

export default AuthController;
