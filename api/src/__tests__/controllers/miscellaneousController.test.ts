import request from 'supertest';
import app from '../../index';

describe('Miscellaneous Controller', () => {
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

    describe('GET /api/v1/misc/permissions', () => {
        it('should return 401 without authentication', async () => {
            const response = await request(app).get('/api/v1/misc/permissions');

            expect(response.status).toBe(401);
        });

        it('should successfully get permissions', async () => {
            const response = await request(app)
                .get('/api/v1/misc/permissions')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /api/v1/misc/departments', () => {
        it('should return 401 without authentication', async () => {
            const response = await request(app).get('/api/v1/misc/departments');

            expect(response.status).toBe(401);
        });

        it('should successfully get departments', async () => {
            const response = await request(app)
                .get('/api/v1/misc/departments')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /api/v1/misc/locations', () => {
        it('should return 401 without authentication', async () => {
            const response = await request(app).get('/api/v1/misc/locations');

            expect(response.status).toBe(401);
        });

        it('should successfully get locations', async () => {
            const response = await request(app)
                .get('/api/v1/misc/locations')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
});
