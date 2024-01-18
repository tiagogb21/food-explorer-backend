import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import httpStatus from 'http-status';
import { prisma } from '@/lib/prisma';

const mockDish = {
    name: 'Salada Radish',
    description: 'Rabanetes, folhas verdes e molho agridoce, salpicado com gergelim.',
    price: '25.97',
    photo: '',
}

describe('List (e2e)', () => {
    beforeAll(async () => {
        await app.ready();

        await prisma.dish.create({
            data: mockDish
        })        
    });

    afterAll(async () => {
        await prisma.dish.delete({
            where: {
                name: mockDish.name,
            },
        });

        await app.close();
    });

    it('should be able to get dish list when passed name', async () => {
        const dishListResponse = await request(app.server)
            .get('/dish/salada-radish')
            .send();

        expect(dishListResponse.statusCode).toEqual(httpStatus.OK);
    });
});
