import { z } from 'zod';

export const createDishBodySchema = z.object({
    name: z.string(),
    price: z.coerce.number(),
    description: z.string(),
    photo: z.string().optional(),
});
