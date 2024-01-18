import { Dish } from '@prisma/client';

import { DishesRepository } from '@/repositories/dishes-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetAllDishesListUseCaseRequest {
    dishes: Dish[];
}

interface GetDishListUseCaseResponse {
    dish: Dish;
}

export class GetDishListUseCase {
    constructor(private dishesRepository: DishesRepository) {}

    async all(): Promise<GetAllDishesListUseCaseRequest> {
        const dishes = await this.dishesRepository.findAll();

        return {
            dishes,
        };
    }
}
