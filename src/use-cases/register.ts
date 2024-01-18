import { hash } from 'bcrypt';
import { User } from '@prisma/client';

import { UsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
    role: 'Admin' | 'User';
}

interface RegisterUseCaseResponse {
    user: User;
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({
        name,
        email,
        password,
        role,
    }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const passwordHash = await hash(password, 6);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        console.log(userWithSameEmail);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const user = await this.usersRepository.create({
            name,
            email,
            hash_password: passwordHash,
            role,
        });

        return {
            user,
        };
    }
}
