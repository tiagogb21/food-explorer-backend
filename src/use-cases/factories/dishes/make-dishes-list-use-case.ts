import { PrismaDishesRepository } from '@/repositories/prisma/prisma-dishes-repository';
import { GetDishListUseCase } from '@/use-cases/get-all-dishes-list';

export function makeDishesListUseCase() {
    const dishesRepository = new PrismaDishesRepository();
    const useCase = new GetDishListUseCase(dishesRepository);

    return useCase;
}