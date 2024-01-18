import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { listByName } from '@/http/controllers/dishes/list-by-name';
import { createDish } from '@/http/controllers/dishes/create-dish';
import { allDishes } from '@/http/controllers/dishes/all-dishes';
import {
    getAllOptionsDishRoutes,
    getOneOptionsDishRoutes,
    postOptionsDishRoutes,
} from '@/lib/swagger/dishes';

export async function dishesRoutes(app: FastifyInstance) {
    /** Authenticated */
    app.get(
        '/dishes',
        {
            schema: getAllOptionsDishRoutes,
        },
        allDishes,
    );

    app.get(
        '/dish/:id',
        // {
        //     schema: getOneOptionsDishRoutes,
        // },
        listByName,
    );

    app.post(
        '/create-dish',
        {
            onRequest: [verifyJwt],
            schema: postOptionsDishRoutes,
        },
        createDish,
    );
}
