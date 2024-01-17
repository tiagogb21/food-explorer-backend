import { User } from '@prisma/client';
import { compare } from 'bcrypt';

import { UsersRepository } from '@/repositories/users-repository';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUseCaseResponse {
    user: User;
}

export class AuthenticateUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({
        email,
        password,
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const doestPasswordMatches = await compare(
            password,
            user.hash_password,
        );

        if (!doestPasswordMatches) {
            throw new InvalidCredentialsError();
        }

        return {
            user,
        };
    }
}
