import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { UsersRepository } from '@/repositories/users-repository';

export class PrismaUsersRepository implements UsersRepository {
    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        return user;
    }

    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    }

    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({
            data,
        });

        return user;
    }

    async update(data: Prisma.UserUpdateInput) {
        const user = await prisma.user.update({
            where: {
                id: data.id as string,
            },
            data,
        });

        return user;
    }

    async delete(data: Prisma.UserDeleteArgs) {
        await prisma.user.delete(data);
    }
}
