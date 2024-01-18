import { PrismaIngredientsRepository } from '@/repositories/prisma/prisma-ingredients-repository';
import { CreateCategoryUseCase } from '@/use-cases/create-category';

export function makeCreateCategoryUseCase() {
    const ingredientsRepository = new PrismaIngredientsRepository();
    const createCategoryUseCase = new CreateCategoryUseCase(ingredientsRepository);

    return createCategoryUseCase;
}
