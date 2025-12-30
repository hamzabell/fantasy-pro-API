import type { User } from '../../../generated/prisma/index.js'
import type { AppEnvironment } from '../../../fp/infrastructure/Environment.js'
import {
	prismaPromise,
	findUniquePromise
} from '../../../fp/adapters/PrismaAdapter.js'

// Let's use `safePrisma` style or `prismaPromise` from adapter.
// The adapter has `prismaPromise`, `findUniquePromise`, `findFirstPromise`.

export const createUser = (
	data: Omit<User, 'createdAt' | 'updatedAt'>
) => (env: AppEnvironment): Promise<User> =>
    prismaPromise<User>('Create', 'User')(
        env.prisma.user.create({ data })
    );

export const findUserById = (
	id: string
) => (env: AppEnvironment): Promise<User> =>
    findUniquePromise<User>('User', id)(
        env.prisma.user.findUnique({ where: { id } })
    );

export const findUserByIdOptional = (
	userId: string
) => async (env: AppEnvironment): Promise<User | null> => {
    // We can just call prisma directly for optional
    return await env.prisma.user.findUnique({ where: { id: userId } });
};


export const findAllUsers = () => (env: AppEnvironment): Promise<User[]> =>
    prismaPromise<User[]>('Read', 'User')(
        env.prisma.user.findMany()
    );

export const updateUser = (
	id: string,
	data: Partial<User>
) => (env: AppEnvironment): Promise<User> =>
    prismaPromise<User>('Update', 'User')(
        env.prisma.user.update({ where: { id }, data })
    );

export const deleteUser = (
	id: string
) => (env: AppEnvironment): Promise<User> =>
    prismaPromise<User>('Delete', 'User')(
        env.prisma.user.delete({ where: { id } })
    );

export const deleteAllUsers = () => (env: AppEnvironment): Promise<{ count: number }> =>
    prismaPromise<{ count: number }>('Delete', 'User')(
        env.prisma.user.deleteMany()
    );

export const getOrCreateUser = (
	userData: Omit<User, 'createdAt' | 'updatedAt'>
) => async (env: AppEnvironment): Promise<User> => {
    const existing = await env.prisma.user.findUnique({ where: { id: userData.id } });
    if (existing) return existing;
    return await env.prisma.user.create({ data: userData });
};
