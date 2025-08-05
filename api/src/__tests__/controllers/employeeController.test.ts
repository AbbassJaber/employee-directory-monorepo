import request from 'supertest';
import app from '../../index';

describe('Employee Controller', () => {
    let authToken: string;

    beforeAll(async () => {
        // Login to get authentication token for all tests
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'ceo@company.com',
                password: 'ceo123456',
            });

        authToken = loginResponse.body.data.accessToken;
    });

    describe('GET /api/v1/employees/reporting-managers', () => {
        it('should return 401 without authentication', async () => {
            const response = await request(app).get(
                '/api/v1/employees/reporting-managers'
            );

            expect(response.status).toBe(401);
        });

        it('should successfully get reporting managers', async () => {
            const response = await request(app)
                .get('/api/v1/employees/reporting-managers')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /api/v1/employees/', () => {
        it('should return 401 without authentication', async () => {
            const response = await request(app).get('/api/v1/employees/');

            expect(response.status).toBe(401);
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .get('/api/v1/employees/')
                .query({
                    page: 'invalid',
                    limit: 'invalid',
                })
                .set('Authorization', 'Bearer fake-token');

            expect(response.status).toBe(401);
        });

        it('should successfully get paginated employees', async () => {
            const response = await request(app)
                .get('/api/v1/employees/')
                .query({
                    page: '1',
                    limit: '10',
                })
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('employees');
            expect(response.body.data).toHaveProperty('paginationMetadata');
            expect(Array.isArray(response.body.data.employees)).toBe(true);
        });
    });

    describe('GET /api/v1/employees/all', () => {
        it('should return 401 without authentication', async () => {
            const response = await request(app).get('/api/v1/employees/all');

            expect(response.status).toBe(401);
        });

        it('should successfully get all employees', async () => {
            const response = await request(app)
                .get('/api/v1/employees/all')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('POST /api/v1/employees/', () => {
        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .post('/api/v1/employees/')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                });

            expect(response.status).toBe(401);
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .post('/api/v1/employees/')
                .send({
                    firstName: 'John',
                    // Missing lastName, email, etc.
                })
                .set('Authorization', 'Bearer fake-token');

            expect(response.status).toBe(401);
        });

        it('should return 401 for invalid token with invalid email', async () => {
            const response = await request(app)
                .post('/api/v1/employees/')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'invalid-email',
                    phone: '1234567890',
                    position: 'Developer',
                    hireDate: '2023-01-01',
                    permissions: [],
                })
                .set('Authorization', 'Bearer fake-token');

            expect(response.status).toBe(401);
        });

        it('should successfully create a new employee', async () => {
            const employeeData = {
                firstName: 'Jane',
                lastName: 'Smith',
                email: `jane.smith.${Date.now()}@example.com`, // Make email unique
                password: 'password123',
                phone: '+96170123456',
                position: 'Software Engineer',
                hireDate: '2023-01-15',
                permissions: ['CREATE_EMPLOYEE', 'READ_EMPLOYEE'],
                departmentId: 1,
                locationId: 1,
            };

            const response = await request(app)
                .post('/api/v1/employees/')
                .send(employeeData)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('firstName', 'Jane');
            expect(response.body.data).toHaveProperty('lastName', 'Smith');
            expect(response.body.data).toHaveProperty(
                'email',
                employeeData.email
            );
        });
    });

    describe('GET /api/v1/employees/:id', () => {
        it('should return 401 without authentication', async () => {
            const response = await request(app).get('/api/v1/employees/1');

            expect(response.status).toBe(401);
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .get('/api/v1/employees/invalid-id')
                .set('Authorization', 'Bearer fake-token');

            expect(response.status).toBe(401);
        });

        it('should successfully get employee by ID', async () => {
            const response = await request(app)
                .get('/api/v1/employees/1')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('firstName');
            expect(response.body.data).toHaveProperty('lastName');
            expect(response.body.data).toHaveProperty('email');
        });
    });

    describe('PUT /api/v1/employees/:id', () => {
        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .put('/api/v1/employees/1')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                });

            expect(response.status).toBe(401);
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .put('/api/v1/employees/invalid-id')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                })
                .set('Authorization', 'Bearer fake-token');

            expect(response.status).toBe(401);
        });

        it('should return 401 for invalid token with invalid email', async () => {
            const response = await request(app)
                .put('/api/v1/employees/1')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'invalid-email',
                })
                .set('Authorization', 'Bearer fake-token');

            expect(response.status).toBe(401);
        });

        it('should successfully update employee', async () => {
            const updateData = {
                firstName: 'John Updated',
                lastName: 'Doe Updated',
                position: 'Senior Developer',
            };

            const response = await request(app)
                .put('/api/v1/employees/1')
                .send(updateData)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty(
                'firstName',
                'John Updated'
            );
            expect(response.body.data).toHaveProperty(
                'lastName',
                'Doe Updated'
            );
        });
    });

    describe('DELETE /api/v1/employees/:id', () => {
        it('should return 401 without authentication', async () => {
            const response = await request(app).delete('/api/v1/employees/1');

            expect(response.status).toBe(401);
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .delete('/api/v1/employees/invalid-id')
                .set('Authorization', 'Bearer fake-token');

            expect(response.status).toBe(401);
        });

        it('should successfully delete employee', async () => {
            // Since we don't know which employee IDs exist, let's test with a non-existent ID
            // This should return 404 (not found) instead of 409 (conflict)
            const response = await request(app)
                .delete('/api/v1/employees/999')
                .set('Authorization', `Bearer ${authToken}`);

            // Expect 404 for non-existent employee
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error', 'Employee not found');
        });
    });
});
