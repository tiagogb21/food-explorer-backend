import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository';
import { CreateCategoryUseCase } from '@/use-cases/create-category';

export function makeCreateCategoryUseCase() {
    const CategoriesRepository = new PrismaCategoriesRepository();
    const createCategoryUseCase = new CreateCategoryUseCase(CategoriesRepository);

    return createCategoryUseCase;
}
