import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository';
import { GetCategoryListByNameUseCase } from '@/use-cases/get-category-list-by-name';

export function makeCategoryListByNameUseCase() {
    const categoriesRepository = new PrismaCategoriesRepository();
    const useCase = new GetCategoryListByNameUseCase(categoriesRepository);

    return useCase;
}