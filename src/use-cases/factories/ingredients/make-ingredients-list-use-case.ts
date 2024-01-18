import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository';
import { GetCategoriesListUseCase } from '@/use-cases/get-all-categories-list';

export function makeCategoriesListUseCase() {
    const categoriesRepository = new PrismaCategoriesRepository();
    const useCase = new GetCategoriesListUseCase(categoriesRepository);

    return useCase;
}