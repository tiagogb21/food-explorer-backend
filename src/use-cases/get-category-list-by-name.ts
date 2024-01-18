import { Category } from '@prisma/client';

import { CategoriesRepository } from '@/repositories/categories-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetCategoryListUseCaseRequest {
    name: string;
}

interface GetCategoryListUseCaseResponse {
    category: Category;
}

export class GetCategoryListByNameUseCase {
    constructor(private categoriesRepository: CategoriesRepository) {}

    async execute({
        name,
    }: GetCategoryListUseCaseRequest): Promise<GetCategoryListUseCaseResponse> {
        const category = await this.categoriesRepository.findByName(name);

        if (!category) {
            throw new ResourceNotFoundError();
        }

        return {
            category,
        };
    }
}
