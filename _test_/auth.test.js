const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Auth API', () => {
    it('should register a user', async () => {
        const res = await request(app)
            .post('/v1/auth/register')
            .send({ email: 'tester5@example.com', password: 'password123' });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User registered successfully');
    });

    it('should login successfully', async () => {
        const res = await request(app)
            .post('/v1/auth/login')
            .send({ email: 'tester3@example.com', password: 'password123' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body.user).toHaveProperty('email', 'tester3@example.com');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
