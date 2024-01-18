import { Prisma, Ingredient } from '@prisma/client';

export interface IngredientsRepository {
    findAll(): Promise<Ingredient[]>;
    findById(id: string): Promise<Ingredient | null>;
    findByName(name: string): Promise<Ingredient | null>;
    create(data: Prisma.IngredientCreateInput): Promise<Ingredient>;
    update(data: Prisma.IngredientUpdateInput): Promise<Ingredient>;
    delete(id: string): void;
}
