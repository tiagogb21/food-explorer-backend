import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { makeDishesListByNameUseCase } from '@/use-cases/factories/dishes/make-dish-list-by-name-use-case';
import { DishAlreadyExistsError } from '@/use-cases/errors/dish-already-exists-error';

function formatId(str: string): string {
    const formattedStr = str.replace(/\b\w/g, match => match.toUpperCase());
    return formattedStr.replace(/-/g, ' '); // Substitui todos os hifens por espaços
}

export async function listByName(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const dishIdFormatted = formatId(id);

    let dish;

    try {
        const getDishesList = makeDishesListByNameUseCase();

        const { dish: dishData } = await getDishesList.execute({
            name: dishIdFormatted,
        });

        dish = dishData;
    } catch (error) {
        if (error instanceof DishAlreadyExistsError) {
            return reply.status(httpStatus.CONFLICT)
                .send({ message: error.message });
        }

        throw error;
    }

    return reply.status(httpStatus.OK).send({
        dish,
    });
}
