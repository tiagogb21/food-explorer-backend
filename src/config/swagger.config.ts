const tagsOptions = (option: string) => ({
    name: option,
    description: `${option} related end-points`,
});

export const swaggerOptions = {
    swagger: {
        info: {
            title: "RESTful API using Fastify - Food explorer",
            description: "CRUDs using Swagger, Fastify and Prisma.",
            version: "1.0.0",
        },
        host: "localhost",
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [
            tagsOptions("Users"),
            tagsOptions("Dishes"),
            tagsOptions("Categories"),
        ],
    },
};

export const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
};