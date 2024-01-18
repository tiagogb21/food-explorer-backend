import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { makeRegisterUseCase } from '@/use-cases/factories/users/make-register-use-case';
import { registerBodySchema } from '@/validate/registerBodySchema';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const {
        name,
        email,
        password,
        role
    } = registerBodySchema.parse(
        request.body,
    );

    try {
        const registerUseCase = makeRegisterUseCase();

        await registerUseCase.execute({
            name,
            email,
            password,
            role,
        });
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(httpStatus.CONFLICT)
                .send({ message: error.message });
        }

        throw error;
    }

    return reply.status(httpStatus.CREATED).send();
}
