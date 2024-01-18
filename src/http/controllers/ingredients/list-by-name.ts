import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { makeCategoriesListUseCase } from '@/use-cases/factories/categories/make-categories-list-use-case';
import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error';

function formatId(str: string): string {
    const formattedStr = str.replace(/\b\w/g, match => match.toUpperCase());
    return formattedStr.replace(/-/g, ' '); // Substitui todos os hifens por espaços
}

export async function listByName(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const categoriIdFormatted = formatId(id);

    let category;

    try {
        const getCategoriesList = makeCategoriesListUseCase();

        const { category: categoryData } = await getCategoriesList.execute({
            name: categoriIdFormatted,
        });

        category = categoryData;
    } catch (error) {
        if (error instanceof CategoryAlreadyExistsError) {
            return reply.status(httpStatus.CONFLICT)
                .send({ message: error.message });
        }

        throw error;
    }

    return reply.status(httpStatus.OK).send({
        category,
    });
}
