import { Dish } from '@prisma/client';

import { DishesRepository } from '@/repositories/dishes-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetDishListUseCaseRequest {
    name: string;
}

interface GetDishListUseCaseResponse {
    dish: Dish;
}

export class GetDishListUseCase {
    constructor(private dishesRepository: DishesRepository) {}

    async all({
        name,
    }: GetDishListUseCaseRequest): Promise<GetDishListUseCaseResponse> {
        const dish = await this.dishesRepository.findByName(name);

        if (!dish) {
            throw new ResourceNotFoundError();
        }

        return {
            dish,
        };
    }
}
