import { PrismaDishesRepository } from '@/repositories/prisma/prisma-dishes-repository';
import { GetDishListByNameUseCase } from '@/use-cases/get-dish-list-by-name';

export function makeDishesListByNameUseCase() {
    const dishesRepository = new PrismaDishesRepository();
    const useCase = new GetDishListByNameUseCase(dishesRepository);

    return useCase;
}