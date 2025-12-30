import type { User } from "../../generated/prisma/index.js";
import prisma from "../../prisma.js";
import { databaseError } from '../../fp/domain/errors/AppError.js';
import { safePrisma } from '../../fp/utils/fp-utils.js';

// CREATE

/**
 * Saves a new User to the database.
 */
export async function saveUserToDatabase(user: Parameters<typeof prisma.user.create>[0]['data']) {
	return await prisma.user.create({ data: user });
}

// Adapting to standard async functions

/**
 * Retrieves a User record from the database based on its email.
 */
export const retrieveUserFromDatabaseByEmail = async (email: string) => {
    try {
        return await prisma.user.findUnique({ where: { email } });
    } catch (e: any) {
        throw databaseError('Read', 'User', e);
    }
};

export const retrieveUserFromDatabaseById = async (id: string) => {
    try {
        return await prisma.user.findUnique({ where: { id } });
    } catch (e: any) {
        throw databaseError('Read', 'User', e);
    }
};

/**
 * Retrieves user statistics: matches (leagues joined), total points, and trophies (wins).
 */
export const retrieveUserStats = async (userId: string) => {
    try {
        const memberships = await prisma.fantasyLeagueMembership.findMany({
            where: { userId },
            select: {
                score: true,
                position: true
            }
        });

        const matches = memberships.length;
        const points = memberships.reduce((acc, m) => acc + (Number(m.score) || 0), 0);
        const trophies = memberships.filter(m => m.position === 1).length;

        return { matches, points, trophies };
    } catch (e: any) {
        throw databaseError('Read', 'UserStats', e);
    }
};

// UPDATE

/**
 * Updates a User in the database.
 */
export async function updateUserInDatabaseById({
	userId,
	user,
}: {
	userId: User["id"];
	user: Parameters<typeof prisma.user.update>[0]['data'];
}) {
	return await prisma.user.update({
		where: { id: userId },
		data: user,
	});
}

// DELETE

/**
 * Removes a User from the database.
 */
export async function deleteUserFromDatabaseById(userId: User["id"]) {
	try {
		return await prisma.user.delete({ where: { id: userId } });
	} catch (error) {
		if (error instanceof Error && error.message.includes('No record was found for a delete')) {
			return null;
		}
		throw error;
	}
}

/**
 * Removes all Users from the database.
 */
export async function deleteAllUsersFromDatabase() {
	await prisma.team.deleteMany();
	// @ts-ignore
	if (prisma.wallet) {
		// @ts-ignore
		await prisma.wallet.deleteMany();
	}
	return await prisma.user.deleteMany();
}

/**
 * Increments the user's coins.
 */
export async function incrementUserCoins(userId: string, amount: number) {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            coins: {
                increment: amount
            }
        }
    });
}
