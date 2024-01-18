import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { makeCategoriesListUseCase } from '@/use-cases/factories/categories/make-categories-list-use-case';

export async function allCategories(request: FastifyRequest, reply: FastifyReply) {
    const getCategoriesList = makeCategoriesListUseCase();

    const { categories } = await getCategoriesList.all();

    return reply.status(httpStatus.OK).send({
        categories,
    });
}