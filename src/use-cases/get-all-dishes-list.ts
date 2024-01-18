import { Dish } from '@prisma/client';

import { DishesRepository } from '@/repositories/dishes-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetDishListUseCaseResponse {
    dishes: Dish[];
}

export class GetDishListUseCase {
    constructor(private dishesRepository: DishesRepository) {}

    async all(): Promise<GetDishListUseCaseResponse> {
        const dishes = await this.dishesRepository.findAll();

        return {
            dishes,
        };
    }
}
