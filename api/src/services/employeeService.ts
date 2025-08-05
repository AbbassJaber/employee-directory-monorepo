import { Employee, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
    ListEmployeesResponse,
    PaginationParams,
    EmployeeWithPermissions,
} from '@/types';
import { NotFoundError, ConflictError } from '@/utils/errors';
import { buildOrderBy } from '@/utils/sorting';
import AssetService from './assetService';

const prisma = new PrismaClient();

export interface CreateEmployeeRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    position: string;
    hireDate: string;
    departmentId?: number;
    locationId?: number;
    reportsToId?: number;
    permissions?: string[];
}

export interface UpdateEmployeeRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    departmentId?: number;
    locationId?: number;
    reportsToId?: number;
    position?: string;
    hireDate?: string;
    permissions?: string[];
}

class EmployeeService {
    static getEmployeeById = async (
        id: number
    ): Promise<EmployeeWithPermissions> => {
        const employee = await prisma.employee.findUnique({
            where: { id },
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
            throw new NotFoundError('Employee not found');
        }

        return {
            ...employee,
            permissions: employee.permissions.map(ep => ep.permission),
        };
    };

    static listAllEmployees = async (): Promise<Partial<Employee>[]> => {
        const where = {
            deactivatedAt: null,
        };

        const employees = await prisma.employee.findMany({
            where,
            orderBy: {
                firstName: 'asc',
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
        });

        return employees;
    };

    static listEmployees = async (
        pagination: PaginationParams,
        filters: {
            search?: string;
            departmentIds?: number[];
            locationIds?: number[];
            reportsToIds?: number[];
        }
    ): Promise<ListEmployeesResponse> => {
        const { page, limit, offset, sortField, sortOrder } = {
            page: Number(pagination.page),
            limit: Number(pagination.limit),
            offset: Number(pagination.offset),
            sortField: pagination.sortField,
            sortOrder: pagination.sortOrder,
        };
        const { search, departmentIds, locationIds, reportsToIds } = filters;

        const where = {
            deactivatedAt: null,
            ...(departmentIds?.length && {
                departmentId: { in: departmentIds.map(Number) },
            }),
            ...(locationIds?.length && {
                locationId: { in: locationIds.map(Number) },
            }),
            ...(reportsToIds?.length && {
                reportsToId: { in: reportsToIds.map(Number) },
            }),
            ...(search && {
                OR: [
                    { firstName: { contains: search } },
                    { lastName: { contains: search } },
                    { email: { contains: search } },
                    { position: { contains: search } },
                ],
            }),
        };
        const total = await prisma.employee.count({ where });

        const employees = await prisma.employee.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: buildOrderBy(sortField, sortOrder),
            include: {
                profileAsset: {
                    select: {
                        id: true,
                        cloudFrontUrl: true,
                    },
                },
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
                    },
                },
            },
        });

        const employeesWithPermissions = employees.map(employee => ({
            ...employee,
            permissions: employee.permissions.map(ep => ep.permission),
        })) as EmployeeWithPermissions[];

        return {
            employees: employeesWithPermissions,
            paginationMetadata: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    };

    static listReportingManagers = async (): Promise<Partial<Employee>[]> => {
        const employees = await prisma.employee.findMany({
            where: { deactivatedAt: null, reports: { some: {} } },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
        });

        return employees;
    };

    static createEmployee = async (
        employeeData: CreateEmployeeRequest,
        profileAssetId?: number
    ): Promise<EmployeeWithPermissions> => {
        // Check if email already exists
        const existingEmployee = await prisma.employee.findUnique({
            where: { email: employeeData.email },
        });

        if (existingEmployee) {
            throw new ConflictError('Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(employeeData.password, 12);

        // Create employee with permissions
        const employee = await prisma.$transaction(async tx => {
            // Create the employee
            const newEmployee = await tx.employee.create({
                data: {
                    email: employeeData.email,
                    password: hashedPassword,
                    firstName: employeeData.firstName,
                    lastName: employeeData.lastName,
                    phone: employeeData.phone || null,
                    position: employeeData.position,
                    hireDate: new Date(employeeData.hireDate),
                    departmentId: employeeData.departmentId || null,
                    locationId: employeeData.locationId || null,
                    reportsToId: employeeData.reportsToId || null,
                    profileAssetId: profileAssetId || null,
                    permissions: {
                        create:
                            employeeData.permissions &&
                            employeeData.permissions.length > 0
                                ? employeeData.permissions.map(
                                      permissionName => ({
                                          permission: {
                                              connect: { name: permissionName },
                                          },
                                      })
                                  )
                                : [],
                    },
                },
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

            return newEmployee;
        });

        return {
            ...employee,
            permissions: employee.permissions.map(ep => ep.permission),
        };
    };

    static updateEmployee = async (
        employeeId: number,
        employeeData: UpdateEmployeeRequest,
        profileAssetId?: number | null
    ) => {
        // Get current employee to check if profile photo needs to be deleted
        const currentEmployee = await prisma.employee.findUnique({
            where: { id: employeeId },
            include: {
                profileAsset: true,
            },
        });

        if (!currentEmployee) {
            throw new NotFoundError('Employee not found');
        }

        if (
            employeeData.email &&
            employeeData.email !== currentEmployee.email
        ) {
            const existingEmployeeWithEmail = await prisma.employee.findUnique({
                where: { email: employeeData.email },
            });

            if (existingEmployeeWithEmail) {
                throw new ConflictError('Email already exists');
            }
        }

        // Delete old profile photo from AWS if it exists and we're updating/removing it
        if (
            currentEmployee.profileAsset &&
            (profileAssetId !== undefined || profileAssetId === null)
        ) {
            await AssetService.deleteAsset(currentEmployee.profileAsset.id);
        }

        const updateData: any = {
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            phone: employeeData.phone,
            position: employeeData.position,
            updatedAt: new Date(),
        };

        if (employeeData.hireDate) {
            updateData.hireDate = new Date(employeeData.hireDate);
        }

        if (employeeData.password) {
            updateData.password = await bcrypt.hash(employeeData.password, 12);
        }

        if (employeeData.departmentId) {
            updateData.department = {
                connect: { id: employeeData.departmentId },
            };
        }

        if (employeeData.locationId) {
            updateData.location = {
                connect: { id: employeeData.locationId },
            };
        }

        if (employeeData.reportsToId) {
            updateData.reportsTo = {
                connect: { id: employeeData.reportsToId },
            };
        }

        if (profileAssetId !== undefined) {
            if (profileAssetId === null) {
                updateData.profileAsset = {
                    disconnect: true,
                };
            } else {
                updateData.profileAsset = {
                    connect: { id: profileAssetId },
                };
            }
        }

        const employee = await prisma.$transaction(async tx => {
            const updatedEmployee = await tx.employee.update({
                where: { id: employeeId },
                data: updateData,
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

            if (employeeData.permissions) {
                await tx.employeePermission.deleteMany({
                    where: { employeeId },
                });

                for (const permissionName of employeeData.permissions) {
                    await tx.employeePermission.create({
                        data: {
                            employee: {
                                connect: { id: employeeId },
                            },
                            permission: {
                                connect: { name: permissionName },
                            },
                        },
                    });
                }
            }

            return updatedEmployee;
        });

        return employee;
    };

    static deleteEmployee = async (
        id: number,
        deletedBy: number
    ): Promise<void> => {
        const employee = await prisma.employee.findUnique({
            where: { id },
        });

        if (!employee) {
            throw new NotFoundError('Employee not found');
        }

        await prisma.employee.update({
            where: { id, reports: { none: {} }, deactivatedAt: null },
            data: {
                deactivatedAt: new Date(),
                deactivatedBy: deletedBy,
            },
        });
    };
}

export default EmployeeService;
