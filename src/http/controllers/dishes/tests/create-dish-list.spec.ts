import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import httpStatus from 'http-status';

const mockDish = {
    name: 'Salada Radish',
    description: 'Rabanetes, folhas verdes e molho agridoce, salpicado com gergelim.',
    price: '25.97',
}

describe('Register (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to register', async () => {
        const response = await request(app.server)
            .post('/create-dish')
            .send(mockDish);

        expect(response.statusCode).toEqual(httpStatus.CREATED);
    });

    it('should return 409 if dishe already register', async () => {
        const response = await request(app.server)
            .post('/create-dish')
            .send(mockDish);

        expect(response.statusCode).toEqual(httpStatus.CONFLICT);
    });
});
