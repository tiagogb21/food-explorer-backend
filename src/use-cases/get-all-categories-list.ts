import { Category } from '@prisma/client';

import { CategoriesRepository } from '@/repositories/categories-repository';

interface GetCategoryListUseCaseResponse {
    categories: Category[];
}

export class GetCategoriesListUseCase {
    constructor(private categoriesRepository: CategoriesRepository) {}

    async all(): Promise<GetCategoryListUseCaseResponse> {
        const categories = await this.categoriesRepository.findAll();

        return {
            categories,
        };
    }
}
