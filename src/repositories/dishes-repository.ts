import { Prisma, Dish, Address } from '@prisma/client';

export interface DishesRepository {
    findAll(): Promise<Dish[]>;
    findById(id: string): Promise<Dish | null>;
    findByName(name: string): Promise<Dish | null>;
    create(data: Prisma.DishCreateInput): Promise<Dish>;
    update(data: Prisma.DishUpdateInput): Promise<Dish>;
    delete(id: string): void;
}
