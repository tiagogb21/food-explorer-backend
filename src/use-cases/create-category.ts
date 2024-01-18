import { Category } from '@prisma/client';

import { CategoriesRepository } from '@/repositories/categories-repository';
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error';


interface CreateCategoryUseCaseRequest {
    name: string;
}

interface CreateCategoryUseCaseResponse {
    Category: Category;
}

export class CreateCategoryUseCase {
    constructor(private categoriesRepository: CategoriesRepository) {}

    async execute({
        name,
    }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
        const categoryWithSameName = await this.categoriesRepository.findByName(name);

        if (categoryWithSameName) {
            throw new CategoryAlreadyExistsError();
        }

        const category = await this.categoriesRepository.create({
            name,
        });

        return {
            ...category,
        };
    }
}
