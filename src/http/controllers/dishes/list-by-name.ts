import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { makeDishesListUseCase } from '@/use-cases/factories/dishes/make-dishes-list-use-case';

export async function listByName(request: FastifyRequest, reply: FastifyReply) {
    const getDishesList = makeDishesListUseCase();

    const { dish } = await getDishesList.execute({
        dishId: request.id,
    });

    return reply.status(httpStatus.OK).send({
        dish: {
            ...dish,
        },
    });
}