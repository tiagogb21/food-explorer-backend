import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { DishAlreadyExistsError } from '@/use-cases/errors/dish-already-exists-error';
import { makeCreateDishUseCase } from '@/use-cases/factories/dishes/make-create-dish-use-case';
import { createDishBodySchema } from '@/validate/createDishBodySchema';

export async function createDish(request: FastifyRequest, reply: FastifyReply) {
    const {
        name,
        price,
        description,
        photo,
    } = createDishBodySchema.parse(
        request.body,
    );

    try {
        const createUseCase = makeCreateDishUseCase();

        await createUseCase.execute({
            name,
            price,
            description,
            photo,
        });
    } catch (error) {
        if (error instanceof DishAlreadyExistsError) {
            return reply.status(httpStatus.CONFLICT)
                .send({ message: error.message });
        }

        throw error;
    }

    return reply.status(httpStatus.CREATED).send();
}
