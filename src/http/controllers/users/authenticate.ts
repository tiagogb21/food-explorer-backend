import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { authenticateBodySchema } from '@/validate/authenticateBodySchema';

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply,
) {


    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
        const authenticateUseCase = makeAuthenticateUseCase();

        const { user } = await authenticateUseCase.execute({
            email,
            password,
        });

        const token = await reply.jwtSign(
            {
                role: user.role,
            },
            {
                sign: {
                    sub: user.id,
                },
            },
        );

        const refreshToken = await reply.jwtSign(
            {
                role: user.role,
            },
            {
                sign: {
                    sub: user.id,
                    expiresIn: '7d',
                },
            },
        );

        return reply
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                sameSite: true,
                httpOnly: true,
            })
            .status(httpStatus.OK)
            .send({
                token,
            });
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(httpStatus.BAD_REQUEST)
                .send({ message: err.message });
        }

        throw err;
    }
}
