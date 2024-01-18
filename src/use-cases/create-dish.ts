import { Dish } from '@prisma/client';

import { DishesRepository } from '@/repositories/dishes-repository';
import { DishAlreadyExistsError } from './errors/dish-already-exists-error';


interface CreateDishUseCaseRequest {
    name: string;
    price: number;
    description: string;
    photo?: string;
}

interface CreateDishUseCaseResponse {
    dish: Dish;
}

export class CreateDishUseCase {
    constructor(private dishesRepository: DishesRepository) {}

    async execute({
        name,
        price,
        description,
        photo,
    }: CreateDishUseCaseRequest): Promise<CreateDishUseCaseResponse> {
        const dishWithSameName = await this.dishesRepository.findByName(name);

        if (dishWithSameName) {
            throw new DishAlreadyExistsError();
        }

        const dish = await this.dishesRepository.create({
            name,
            price,
            description,
            photo,
        });

        return {
            dish,
        };
    }
}
