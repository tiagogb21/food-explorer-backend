import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { makeGetUserProfileUseCase } from '@/use-cases/factories/users/make-get-user-profile-use.case';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    const getUserProfile = makeGetUserProfileUseCase();

    const { user } = await getUserProfile.execute({
        userId: request.user.sub,
    });

    return reply.status(httpStatus.OK).send({
        user: {
            ...user,
            password_hash: undefined,
        },
    });
}
