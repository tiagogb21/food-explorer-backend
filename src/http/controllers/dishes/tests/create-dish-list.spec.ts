import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import httpStatus from 'http-status';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

const mockDish = {
    name: 'Salada Radish',
    description: 'Rabanetes, folhas verdes e molho agridoce, salpicado com gergelim.',
    price: '25.97',
    photo: '',
}

describe('Register (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();

        await prisma.dish.delete({
            where: {
                name: mockDish.name,
            },
        });
    });

    it('should be able to create a dish', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const response = await request(app.server)
            .post('/create-dish')
            .set('Authorization', `Bearer ${token}`)
            .send(mockDish);

        expect(response.statusCode).toEqual(httpStatus.CREATED);
    });

    it('should return 409 if dish already register', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const response = await request(app.server)
            .post('/create-dish')
            .set('Authorization', `Bearer ${token}`)
            .send(mockDish);

        expect(response.statusCode).toEqual(httpStatus.CONFLICT);
    });
});
