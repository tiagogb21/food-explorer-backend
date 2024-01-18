import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { IngredientsRepository } from '../ingredients-repository';

export class PrismaIngredientsRepository implements IngredientsRepository {
    async findAll() {
        const ingredient = await prisma.ingredient.findMany();

        return ingredient;
    }    

    async findById(id: string) {
        const ingredient = await prisma.ingredient.findUnique({
            where: {
                id,
            },
        });

        return ingredient;
    }

    async findByName(name: string) {
        const ingredient = await prisma.ingredient.findFirst({
            where: {
                name,
            },
        });

        return ingredient;
    }

    async create(data: Prisma.IngredientCreateInput) {
        const ingredient = await prisma.ingredient.create({
            data,
        });

        return ingredient;
    }

    async update(data: Prisma.IngredientUpdateInput) {
        const ingredient = await prisma.ingredient.update({
            where: {
                id: data.id as string,
            },
            data,
        });

        return ingredient;
    }

    async delete(id: string) {
        await prisma.ingredient.delete({
            where: {
                id,
            },
        });
    }
}
