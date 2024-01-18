import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import httpStatus from 'http-status';

describe('List (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to get dishes list', async () => {

        
        const dishListResponse = await request(app.server)
            .get('/dish/teste')
            .send();

        expect(dishListResponse.statusCode).toEqual(httpStatus.OK);
    });
});
