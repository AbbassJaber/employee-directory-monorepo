export const swaggerSchemas = {
    Employee: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            hireDate: { type: 'string', format: 'date-time' },
            isActive: { type: 'boolean' },
            departmentId: { type: 'integer' },
            locationId: { type: 'integer' },
            reportsToId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateEmployeeRequest: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName', 'hireDate'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            firstName: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
            },
            lastName: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
            },
            phone: { type: 'string' },
            hireDate: { type: 'string', format: 'date' },
            departmentId: { type: 'integer' },
            locationId: { type: 'integer' },
            reportsToId: { type: 'integer' },
        },
    },
    UpdateEmployeeRequest: {
        type: 'object',
        properties: {
            firstName: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
            },
            lastName: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
            },
            phone: { type: 'string' },
            isActive: { type: 'boolean' },
            departmentId: { type: 'integer' },
            locationId: { type: 'integer' },
            reportsToId: { type: 'integer' },
        },
    },
};
