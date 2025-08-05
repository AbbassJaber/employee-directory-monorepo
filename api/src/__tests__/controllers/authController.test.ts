import request from 'supertest';
import app from '../../index';

describe('Auth Controller', () => {
    describe('POST /api/v1/auth/login', () => {
        it('should return 400 for missing email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    password: 'password123',
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for missing password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid email format', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'invalid-email',
                    password: 'password123',
                });

            expect(response.status).toBe(400);
        });

        it('should successfully login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'ceo@company.com',
                    password: 'ceo123456',
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data.user).toHaveProperty('id');
            expect(response.body.data.user).toHaveProperty('email');
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        it('should return 401 without authentication', async () => {
            const response = await request(app).post('/api/v1/auth/logout');

            expect(response.status).toBe(401);
        });

        it('should successfully logout with valid token', async () => {
            // First login to get a valid token
            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'ceo@company.com',
                    password: 'ceo123456',
                });

            const token = loginResponse.body.data.accessToken;

            // Then logout with the token
            const response = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message');
        });
    });
});
