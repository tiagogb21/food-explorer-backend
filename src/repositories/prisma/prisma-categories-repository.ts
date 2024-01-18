import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { CategoriesRepository } from '@/repositories/categories-repository';

export class PrismaCategoriesRepository implements CategoriesRepository {
    async findAll() {
        const category = await prisma.category.findMany();

        return category;
    }    

    async findById(id: string) {
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
        });

        return category;
    }

    async findByName(name: string) {
        const category = await prisma.category.findFirst({
            where: {
                name,
            },
        });

        return category;
    }

    async create(data: Prisma.CategoryCreateInput) {
        const category = await prisma.category.create({
            data,
        });

        return category;
    }

    async update(data: Prisma.CategoryUpdateInput) {
        const category = await prisma.category.update({
            where: {
                id: data.id as string,
            },
            data,
        });

        return category;
    }

    async delete(id: string) {
        await prisma.category.delete({
            where: {
                id,
            },
        });
    }
}
