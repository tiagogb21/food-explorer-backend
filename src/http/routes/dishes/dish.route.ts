import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { listByName } from '@/http/controllers/dishes/list-by-name';
import { createDish } from '@/http/controllers/dishes/create-dish-list';
import { allDishes } from '@/http/controllers/dishes/all-dishes';

export async function dishesRoutes(app: FastifyInstance) {
    /** Authenticated */
    app.get('/dishes', { onRequest: [verifyJwt] }, allDishes);

    app.get('/dish/{id}', { onRequest: [verifyJwt] }, listByName);

    app.post('/create-dish', { onRequest: [verifyJwt] }, createDish);
}
