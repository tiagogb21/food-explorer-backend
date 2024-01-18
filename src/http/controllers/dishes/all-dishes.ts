import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { makeDishesListUseCase } from '@/use-cases/factories/dishes/make-dishes-list-use-case';

export async function allDishes(request: FastifyRequest, reply: FastifyReply) {
    const getDishesList = makeDishesListUseCase();

    const { dishes } = await getDishesList.all();

    return reply.status(httpStatus.OK).send({
        dish: {
            ...dishes,
        },
    });
}