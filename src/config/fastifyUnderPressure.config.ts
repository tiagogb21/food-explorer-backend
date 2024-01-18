import { FastifyUnderPressureError } from "@/utils/errors/fastify-under-pressure";
import { UnderPressureOptions } from "@fastify/under-pressure";
import { FastifyRegisterOptions } from "fastify";

export const fastifyUnderPressureOptions: FastifyRegisterOptions<UnderPressureOptions> = {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 100000000,
    maxRssBytes: 100000000,
    maxEventLoopUtilization:0.98,
    customError: FastifyUnderPressureError,
    retryAfter: 50,
}
