import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { DishesRepository } from '@/repositories/dishes-repository';

export class PrismaDishesRepository implements DishesRepository {
    async findAll() {
        const dish = await prisma.dish.findMany();

        return dish;
    }    

    async findById(id: string) {
        const dish = await prisma.dish.findUnique({
            where: {
                id,
            },
        });

        return dish;
    }

    async findByName(name: string) {
        const dish = await prisma.dish.findFirst({
            where: {
                name,
            },
        });

        return dish;
    }

    async create(data: Prisma.DishCreateInput) {
        const dish = await prisma.dish.create({
            data,
        });

        return dish;
    }

    async update(data: Prisma.DishUpdateInput) {
        const dish = await prisma.dish.update({
            where: {
                id: data.id as string,
            },
            data,
        });

        return dish;
    }

    async delete(id: string) {
        await prisma.dish.delete({
            where: {
                id,
            },
        });
    }
}
