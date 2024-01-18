import { Prisma, Category } from '@prisma/client';

export interface CategoriesRepository {
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    update(data: Prisma.CategoryUpdateInput): Promise<Category>;
    delete(id: string): void;
}
