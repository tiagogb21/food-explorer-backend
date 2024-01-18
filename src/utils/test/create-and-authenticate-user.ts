import { hash } from 'bcrypt';
import request from 'supertest';
import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';

const dataUser = async (isAdmin: boolean): Promise<User> => ({
    id: randomUUID(),
    name: 'John Doe',
    email: 'johndoe@example.com',
    hash_password: await hash('123456', 6),
    role: isAdmin ? 'Admin' : 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
});

const mockUserLogin = {
    email: 'johndoe@example.com',
    password: '123456',
}

export async function createAndAuthenticateUser(
    app: FastifyInstance,
    isAdmin = false,
) {
    await prisma.user.create({
        data: await dataUser(isAdmin),
    });

    const authResponse = await request(app.server)
        .post('/sessions')
        .send(mockUserLogin);

    const { token } = authResponse.body;

    await prisma.user.delete({
        where: {
            email: mockUserLogin.email,
        },
    });

    return {
        token,
    };
}
