import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import httpStatus from 'http-status';
import { prisma } from '@/lib/prisma';

const mockUser = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
}

describe('Register (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();

        await prisma.user.delete({
            where: {
                email: mockUser.email,
            },
        });
    });

    it('should be able to register', async () => {
        const response = await request(app.server)
            .post('/users')
            .send(mockUser);

        expect(response.statusCode).toEqual(httpStatus.CREATED);
    });

    it('should return 409 if user already register', async () => {
        const response = await request(app.server)
            .post('/users')
            .send(mockUser);

        expect(response.statusCode).toEqual(httpStatus.CONFLICT);
    });
});
