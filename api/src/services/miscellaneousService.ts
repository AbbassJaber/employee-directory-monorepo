import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class MiscellaneousService {
    static listPermissions = async () => {
        const permissions = await prisma.permission.findMany({
            orderBy: { name: 'asc' },
        });

        return permissions;
    };

    static listDepartments = async () => {
        const departments = await prisma.department.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
            },
        });

        return departments;
    };

    static listLocations = async () => {
        const locations = await prisma.location.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
            },
        });

        return locations;
    };
}

export default MiscellaneousService;
