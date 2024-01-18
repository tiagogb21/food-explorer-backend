export class FastifyUnderPressureError extends Error {
    constructor() {
        super('Under pressure!');
        Error.captureStackTrace(
            this,
            FastifyUnderPressureError
        );
    }
}
