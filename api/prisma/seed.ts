import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PERMISSIONS } from '../src/constants/permissions';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create departments
    const departments = await Promise.all([
        prisma.department.upsert({
            where: { name: 'Executive' },
            update: {},
            create: {
                name: 'Executive',
                description: 'Executive leadership team',
            },
        }),
        prisma.department.upsert({
            where: { name: 'Engineering' },
            update: {},
            create: {
                name: 'Engineering',
                description: 'Software development and technical teams',
            },
        }),
        prisma.department.upsert({
            where: { name: 'Marketing' },
            update: {},
            create: {
                name: 'Marketing',
                description: 'Marketing and communications',
            },
        }),
        prisma.department.upsert({
            where: { name: 'Sales' },
            update: {},
            create: {
                name: 'Sales',
                description: 'Sales and business development',
            },
        }),
        prisma.department.upsert({
            where: { name: 'Human Resources' },
            update: {},
            create: {
                name: 'Human Resources',
                description: 'HR and people operations',
            },
        }),
        prisma.department.upsert({
            where: { name: 'Finance' },
            update: {},
            create: {
                name: 'Finance',
                description: 'Finance and accounting',
            },
        }),
    ]);

    console.log('✅ Departments created');

    // Create locations
    const locations = await Promise.all([
        prisma.location.upsert({
            where: { name: 'Beirut Office' },
            update: {},
            create: {
                name: 'Beirut Office',
                address: 'Hamra Street, Beirut Central District',
                city: 'Beirut',
                country: 'Lebanon',
                postalCode: '1103-2090',
            },
        }),
        prisma.location.upsert({
            where: { name: 'Tripoli Office' },
            update: {},
            create: {
                name: 'Tripoli Office',
                address: 'El Mina Street',
                city: 'Tripoli',
                country: 'Lebanon',
                postalCode: '1300',
            },
        }),
        prisma.location.upsert({
            where: { name: 'Jounieh Office' },
            update: {},
            create: {
                name: 'Jounieh Office',
                address: 'Kaslik Highway',
                city: 'Jounieh',
                country: 'Lebanon',
                postalCode: '1200',
            },
        }),
        prisma.location.upsert({
            where: { name: 'Saida Office' },
            update: {},
            create: {
                name: 'Saida Office',
                address: 'Riad El Solh Street',
                city: 'Saida',
                country: 'Lebanon',
                postalCode: '1600',
            },
        }),
        prisma.location.upsert({
            where: { name: 'Remote' },
            update: {},
            create: {
                name: 'Remote',
            },
        }),
    ]);

    console.log('✅ Locations created');

    // Create permissions
    const permissions = await Promise.all([
        prisma.permission.upsert({
            where: { name: PERMISSIONS.CREATE_EMPLOYEE },
            update: {},
            create: {
                name: PERMISSIONS.CREATE_EMPLOYEE,
                description: 'Can create new employees',
            },
        }),
        prisma.permission.upsert({
            where: { name: PERMISSIONS.READ_EMPLOYEE },
            update: {},
            create: {
                name: PERMISSIONS.READ_EMPLOYEE,
                description: 'Can read employee information',
            },
        }),
        prisma.permission.upsert({
            where: { name: PERMISSIONS.UPDATE_EMPLOYEE },
            update: {},
            create: {
                name: PERMISSIONS.UPDATE_EMPLOYEE,
                description: 'Can update employee information',
            },
        }),
        prisma.permission.upsert({
            where: { name: PERMISSIONS.DELETE_EMPLOYEE },
            update: {},
            create: {
                name: PERMISSIONS.DELETE_EMPLOYEE,
                description: 'Can delete employees',
            },
        }),
    ]);

    console.log('✅ Permissions created');

    // Create CEO user
    const hashedPassword = await bcrypt.hash('ceo123456', 12);

    const ceo = await prisma.employee.upsert({
        where: { email: 'ceo@company.com' },
        update: {},
        create: {
            email: 'ceo@company.com',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'Smith',
            phone: '+96170100200',
            position: 'Chief Executive Officer',
            hireDate: new Date('2024-01-01'),
            departmentId: departments[0].id, // Executive
            locationId: locations[0].id, // Beirut Office
        },
    });

    console.log('✅ CEO user created');

    // Assign all permissions to CEO
    const ceoPermissions = permissions.map(permission => ({
        employeeId: ceo.id,
        permissionId: permission.id,
    }));

    await prisma.employeePermission.createMany({
        data: ceoPermissions,
        skipDuplicates: true,
    });

    console.log('✅ CEO permissions assigned');

    // Create some sample employees
    const sampleEmployees = [
        {
            email: 'sarah.johnson@company.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
            phone: '+96170123456',
            position: 'Senior Software Engineer',
            departmentId: departments[1].id, // Engineering
            locationId: locations[1].id, // Tripoli Office
            reportsToId: ceo.id,
        },
        {
            email: 'mike.chen@company.com',
            firstName: 'Mike',
            lastName: 'Chen',
            phone: '+96171123457',
            position: 'Marketing Manager',
            departmentId: departments[2].id, // Marketing
            locationId: locations[2].id, // Jounieh Office
            reportsToId: ceo.id,
        },
        {
            email: 'emma.wilson@company.com',
            firstName: 'Emma',
            lastName: 'Wilson',
            phone: '+96176123458',
            position: 'Sales Representative',
            departmentId: departments[3].id, // Sales
            locationId: locations[3].id, // Saida Office
            reportsToId: ceo.id,
        },
        {
            email: 'ahmad.hassan@company.com',
            firstName: 'Ahmad',
            lastName: 'Hassan',
            phone: '+96178234567',
            position: 'HR Manager',
            departmentId: departments[4].id, // Human Resources
            locationId: locations[0].id, // Beirut Office
            reportsToId: ceo.id,
        },
        {
            email: 'fatima.khoury@company.com',
            firstName: 'Fatima',
            lastName: 'Khoury',
            phone: '+96179345678',
            position: 'Financial Analyst',
            departmentId: departments[5].id, // Finance
            locationId: locations[0].id, // Beirut Office
            reportsToId: ceo.id,
        },
        {
            email: 'david.rodriguez@company.com',
            firstName: 'David',
            lastName: 'Rodriguez',
            phone: '+96170456789',
            position: 'Frontend Developer',
            departmentId: departments[1].id, // Engineering
            locationId: locations[4].id, // Remote
            reportsToId: ceo.id,
        },
        {
            email: 'maya.aboud@company.com',
            firstName: 'Maya',
            lastName: 'Aboud',
            phone: '+96171567890',
            position: 'UX Designer',
            departmentId: departments[1].id, // Engineering
            locationId: locations[0].id, // Beirut Office
            reportsToId: ceo.id,
        },
        {
            email: 'james.taylor@company.com',
            firstName: 'James',
            lastName: 'Taylor',
            phone: '+96172678901',
            position: 'Digital Marketing Specialist',
            departmentId: departments[2].id, // Marketing
            locationId: locations[1].id, // Tripoli Office
            reportsToId: ceo.id,
        },
        {
            email: 'layla.najjar@company.com',
            firstName: 'Layla',
            lastName: 'Najjar',
            phone: '+96173789012',
            position: 'Sales Manager',
            departmentId: departments[3].id, // Sales
            locationId: locations[2].id, // Jounieh Office
            reportsToId: ceo.id,
        },
        {
            email: 'robert.kim@company.com',
            firstName: 'Robert',
            lastName: 'Kim',
            phone: '+96174890123',
            position: 'Backend Developer',
            departmentId: departments[1].id, // Engineering
            locationId: locations[3].id, // Saida Office
            reportsToId: ceo.id,
        },
        {
            email: 'nour.said@company.com',
            firstName: 'Nour',
            lastName: 'Said',
            phone: '+96175901234',
            position: 'HR Specialist',
            departmentId: departments[4].id, // Human Resources
            locationId: locations[4].id, // Remote
            reportsToId: ceo.id,
        },
        {
            email: 'alex.morgan@company.com',
            firstName: 'Alex',
            lastName: 'Morgan',
            phone: '+96176012345',
            position: 'Accountant',
            departmentId: departments[5].id, // Finance
            locationId: locations[1].id, // Tripoli Office
            reportsToId: ceo.id,
        },
        {
            email: 'yasmin.farah@company.com',
            firstName: 'Yasmin',
            lastName: 'Farah',
            phone: '+96177123456',
            position: 'Content Marketing Manager',
            departmentId: departments[2].id, // Marketing
            locationId: locations[0].id, // Beirut Office
            reportsToId: ceo.id,
        },
        {
            email: 'chris.brown@company.com',
            firstName: 'Chris',
            lastName: 'Brown',
            phone: '+96178234567',
            position: 'DevOps Engineer',
            departmentId: departments[1].id, // Engineering
            locationId: locations[2].id, // Jounieh Office
            reportsToId: ceo.id,
        },
    ];

    for (const employeeData of sampleEmployees) {
        const hashedPassword = await bcrypt.hash('password123', 12);

        const employee = await prisma.employee.upsert({
            where: { email: employeeData.email },
            update: {},
            create: {
                ...employeeData,
                password: hashedPassword,
                hireDate: new Date('2024-01-01'),
            },
        });

        // Assign basic permissions (read own profile)
        await prisma.employeePermission.createMany({
            data: [
                {
                    employeeId: employee.id,
                    permissionId: permissions.find(
                        p => p.name === PERMISSIONS.READ_EMPLOYEE
                    )!.id,
                },
            ],
            skipDuplicates: true,
        });
    }

    console.log('✅ Sample employees created');
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Default login credentials:');
    console.log('CEO: ceo@company.com / ceo123456');
}

main()
    .catch(e => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
