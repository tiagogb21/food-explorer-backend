import httpStatus from 'http-status';
import { FastifyReply, FastifyRequest } from 'fastify';

import { CategoryAlreadyExistsError } from '@/use-cases/errors/category-already-exists-error';
import { makeCreateCategoryUseCase } from '@/use-cases/factories/categories/make-create-category-use-case';
import { createCategoryBodySchema } from '@/validate/createCategoryBodySchema';

export async function createCategory(request: FastifyRequest, reply: FastifyReply) {
    const {
        name,
    } = createCategoryBodySchema.parse(
        request.body,
    );

    try {
        const createUseCase = makeCreateCategoryUseCase();

        await createUseCase.execute({
            name,
        });
    } catch (error) {
        if (error instanceof CategoryAlreadyExistsError) {
            return reply.status(httpStatus.CONFLICT)
                .send({ message: error.message });
        }

        throw error;
    }

    return reply.status(httpStatus.CREATED).send();
}
