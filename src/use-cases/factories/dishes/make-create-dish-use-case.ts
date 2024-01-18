import { PrismaDishesRepository } from '@/repositories/prisma/prisma-dishes-repository';
import { CreateDishUseCase } from '@/use-cases/create-dish';

export function makeCreateDishUseCase() {
    const dishesRepository = new PrismaDishesRepository();
    const createDishUseCase = new CreateDishUseCase(dishesRepository);

    return createDishUseCase;
}
