import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import httpStatus from 'http-status';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('List (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to get dishes list', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const dishListResponse = await request(app.server)
            .get('/dishes')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(dishListResponse.statusCode).toEqual(httpStatus.OK);
    });
});
