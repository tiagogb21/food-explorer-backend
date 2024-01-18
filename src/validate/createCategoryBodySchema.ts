import { z } from 'zod';

export const createCategoryBodySchema = z.object({
    name: z.string(),
});
