import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const mockUser = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
    role: 'User',
};

const prisma = vPrisma.client;

describe('Authenticate (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to authenticate', async () => {
        await request(app.server)
            .post('/users')
            .send(mockUser);

        const response = await request(app.server).post('/sessions').send({
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            token: expect.any(String),
        });
    });
});
