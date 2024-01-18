import { ZodError } from 'zod';
import httpStatus from 'http-status';
import fastifyJwt from '@fastify/jwt';
import fastifyHelmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyUnderPressure from '@fastify/under-pressure';
import fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { env } from '@/env';
import { usersRoutes } from '@/http/routes/users/user.route';
import { dishesRoutes } from './http/routes/dishes/dish.route';
import { swaggerOptions, swaggerUiOptions } from './config/swagger.config';
import { fastifyUnderPressureOptions } from './config/fastifyUnderPressure.config';

export const app = fastify(/* { logger: true } */);

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    },
});

app.register(fastifyUnderPressure, fastifyUnderPressureOptions)

app.register(fastifyHelmet, {
    global: true,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
            scriptSrc: ["'self'", 'https:', 'unpkg.com'],
        },
    }
});

app.register(fastifySwagger, swaggerOptions);
app.register(fastifySwaggerUi, swaggerUiOptions);

app.register(fastifyCookie);

app.register(usersRoutes);
app.register(dishesRoutes);

app.setErrorHandler((
    error: FastifyError,
    _: FastifyRequest,
    reply: FastifyReply
) => {
    if (error instanceof ZodError) {
        return reply
            .status(httpStatus.BAD_REQUEST)
            .send({ message: 'Validation error.', issues: error.format() });
    }

    // if (env.NODE_ENV !== 'production') {
    //     console.error(error);
    // } else {
    //     // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
    // }

    return reply.status(500).send({ message: 'Internal server error.' });
});

