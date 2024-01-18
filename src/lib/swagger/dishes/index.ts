export const getAllOptionsDishRoutes = {
    title: 'Get All Dishes',
    description: 'List all dishes, paginated using a cursor paginator.',
    tags: ['dishes'],
    version: '0.1.0',
    produces: ['application/json'],
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'integer', default: 1, description: 'Page number' },
            limit: { type: 'integer', default: 10, description: 'Items per page' },
            sortBy: { type: 'string', enum: ['name', 'price'], description: 'Sort by field' },
            sortOrder: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
            search: { type: 'string', description: 'Search term' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                results: {
                    type: 'array',  // Indica que 'results' é um array
                    items: {
                        type: 'object',  // Cada elemento do array é um objeto
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                            },
                            name: {
                                type: 'string',
                            },
                            description: {
                                type: 'string',
                            },
                            price: {
                                type: 'string',
                            },
                            photo: {
                                type: 'string',
                            },
                            category: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'number',
                                    },
                                },
                            },
                            ingredients: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: {
                                            type: 'number',
                                        },
                                    },
                                },
                            },
                            tags: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: {
                                            type: 'number',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            pagination: {
                type: 'object',
                properties: {
                    totalItems: { type: 'integer', description: 'Total number of items' },
                    currentPage: { type: 'integer', description: 'Current page' },
                    totalPages: { type: 'integer', description: 'Total number of pages' },
                    nextPage: { type: 'integer', description: 'Next page number' },
                    prevPage: { type: 'integer', description: 'Previous page number' },
                },
            },
        },
    },
};

export const getOneOptionsDishRoutes = {
    description: 'This route returns an specific dish by name',
    tags: ['dishes'],
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
            },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    format: 'uuid',
                },
                name: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                price: {
                    type: 'string',
                },
                photo: {
                    type: 'string',
                },
            },
        },
    },
};

export const postOptionsDishRoutes = {
    description: 'This route creates a new dish',
    tags: ['dishes'],
    body: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            price: {
                type: 'string',
            },
            photo: {
                type: 'string',
            },
        },
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    format: 'uuid',
                },
                name: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                price: {
                    type: 'string',
                },
                photo: {
                    type: 'string',
                },
            },
        },
    },
};
