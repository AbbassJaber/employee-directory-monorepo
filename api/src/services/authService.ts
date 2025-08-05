import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
    LoginRequest,
    LoginResponse,
    RefreshTokenResponse,
    EmployeeWithPermissions,
} from '@/types';
import { generateAccessToken, generateRefreshTokenId } from '@/utils/jwt';
import { AuthenticationError } from '@/utils/errors';

const prisma = new PrismaClient();

class AuthService {
    static login = async (loginData: LoginRequest): Promise<LoginResponse> => {
        const { email, password } = loginData;

        const employee = await prisma.employee.findUnique({
            where: { email, deactivatedAt: null },
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

        if (!employee) {
            throw new AuthenticationError('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            employee.password
        );
        if (!isPasswordValid) {
            throw new AuthenticationError('Invalid email or password');
        }

        const accessToken = generateAccessToken(employee.id, employee.email);
        const refreshTokenId = generateRefreshTokenId();
        await prisma.refreshToken.create({
            data: {
                employeeId: employee.id,
                token: refreshTokenId,
                expiresAt: new Date(
                    Date.now() + +process.env['JWT_REFRESH_EXPIRES_IN']!
                ),
                isRevoked: false,
            },
        });

        // Transform permissions to flat array
        const userWithPermissions: EmployeeWithPermissions = {
            ...employee,
            permissions: employee.permissions.map(ep => ep.permission),
        };

        return {
            accessToken,
            refreshToken: refreshTokenId,
            user: userWithPermissions,
        };
    };

    static refreshToken = async (
        refreshTokenId: string
    ): Promise<RefreshTokenResponse> => {
        if (!refreshTokenId) {
            throw new AuthenticationError('Refresh token is required');
        }

        // Find and validate refresh token with employee data
        const tokenRecord = await prisma.refreshToken.findUnique({
            where: { token: refreshTokenId },
            include: {
                employee: {
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
                },
            },
        });

        // Validate token
        if (!tokenRecord) {
            throw new AuthenticationError('Invalid refresh token');
        }

        if (tokenRecord.isRevoked) {
            throw new AuthenticationError('Refresh token has been revoked');
        }

        if (tokenRecord.expiresAt < new Date()) {
            throw new AuthenticationError('Refresh token has expired');
        }

        // Check if employee is still active (not deactivated)
        if (tokenRecord.employee.deactivatedAt) {
            // Revoke the token since employee is inactive
            await prisma.refreshToken.update({
                where: { id: tokenRecord.id },
                data: { isRevoked: true },
            });
            throw new AuthenticationError('Employee account is inactive');
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(
            tokenRecord.employee.id,
            tokenRecord.employee.email
        );
        const newRefreshTokenId = generateRefreshTokenId();

        // Revoke old token and create new one in a transaction (refresh token rotation)
        await prisma.$transaction([
            prisma.refreshToken.update({
                where: { id: tokenRecord.id },
                data: { isRevoked: true },
            }),
            prisma.refreshToken.create({
                data: {
                    employeeId: tokenRecord.employee.id,
                    token: newRefreshTokenId,
                    expiresAt: new Date(
                        Date.now() + +process.env['JWT_REFRESH_EXPIRES_IN']!
                    ),
                    isRevoked: false,
                },
            }),
        ]);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshTokenId,
        };
    };

    static logout = async (refreshTokenId: string): Promise<void> => {
        if (!refreshTokenId) {
            return; // No token to revoke
        }

        await prisma.refreshToken.updateMany({
            where: {
                token: refreshTokenId,
                isRevoked: false,
            },
            data: { isRevoked: true },
        });
    };
}

export default AuthService;
