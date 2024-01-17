import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

export async function verifyJwt(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.status(httpStatus.UNAUTHORIZED)
            .send({ message: 'Unauthorized.' });
    }
}
