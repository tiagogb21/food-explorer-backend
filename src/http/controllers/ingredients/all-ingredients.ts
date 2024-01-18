import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { makeIngredientsListUseCase } from '';

export async function allIngredients(request: FastifyRequest, reply: FastifyReply) {
    const getIngredientsList = makeIngredientsListUseCase();

    const { ingredients } = await getIngredientsList.all();

    return reply.status(httpStatus.OK).send({
        ingredients,
    });
}