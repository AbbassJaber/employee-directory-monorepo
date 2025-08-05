import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '@/types';
import { verifyAccessToken } from '@/utils/jwt';
import { asyncHandler, AuthenticationError } from '@/utils/errors';

const prisma = new PrismaClient();

export const authenticate = asyncHandler(
    async (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('Access token required');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            const decoded = verifyAccessToken(token);

            // Get user with permissions
            const user = await prisma.employee.findUnique({
                where: { id: decoded.userId },
                include: {
                    permissions: {
                        include: {
                            permission: true,
                        },
                    },
                    department: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    location: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    reportsTo: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    reports: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    profileAsset: {
                        select: {
                            id: true,
                            url: true,
                            cloudFrontUrl: true,
                        },
                    },
                },
            });

            if (!user) {
                throw new AuthenticationError('User not found');
            }

            // Transform permissions to flat array
            const userWithPermissions = {
                ...user,
                permissions: user.permissions.map(ep => ep.permission),
            };

            req.user = userWithPermissions;
            next();
        } catch (error) {
            throw new AuthenticationError('Invalid access token');
        }
    }
);
