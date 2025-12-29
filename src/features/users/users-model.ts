import type { User } from "../../generated/prisma/index.js";
import prisma from "../../prisma.js";

// CREATE

/**
 * Saves a new User to the database.
 *
 * @param user - Parameters of the User that should be created.
 * @returns The newly created User.
 */
export async function saveUserToDatabase(user: Parameters<typeof prisma.user.create>[0]['data']) {
	return await prisma.user.create({ data: user });
}

// Adapting to TaskEither for functional architecture conformance
import * as TE from 'fp-ts/lib/TaskEither.js';
import { databaseError, notFoundError } from '../../fp/domain/errors/AppError.js';
// Removed invalid import

/**
 * Retrieves a User record from the database based on its email.
 */
export const retrieveUserFromDatabaseByEmail = (email: string) =>
    TE.tryCatch(
        async () => prisma.user.findUnique({ where: { email } }),
        (e) => databaseError('Read', 'User', e)
    );

export const retrieveUserFromDatabaseById = (id: string) =>
    TE.tryCatch(
        async () => prisma.user.findUnique({ where: { id } }),
        (e) => databaseError('Read', 'User', e)
    );

/**
 * Retrieves user statistics: matches (leagues joined), total points, and trophies (wins).
 */
export const retrieveUserStats = (userId: string) =>
    TE.tryCatch(
        async () => {
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
        },
        (e) => databaseError('Read', 'UserStats', e)
    );


// UPDATE

/**
 * Updates a User in the database.
 *
 * @param options - An object with the User's id and the new values.
 * @returns The updated User.
 */
export async function updateUserInDatabaseById({
	userId,
	user,
}: {
	/**
	 * The id of the User you want to update.
	 */
	userId: User["id"];
	/**
	 * The values of the User you want to change.
	 */
	user: Partial<Omit<Parameters<typeof prisma.user.update>, "id">>;
}) {
	return await prisma.user.update({
		where: { id: userId },
		data: user,
	});
}

// DELETE

/**
 * Removes a User from the database.
 *
 * @param id - The id of the User you want to delete.
 * @returns The User that was deleted.
 */
export async function deleteUserFromDatabaseById(userId: User["id"]) {
	try {
		return await prisma.user.delete({ where: { id: userId } });
	} catch (error) {
		// If the user doesn't exist, return null instead of throwing an error
		if (error instanceof Error && error.message.includes('No record was found for a delete')) {
			return null;
		}
		// Re-throw other errors
		throw error;
	}
}

/**
 * Removes all Users from the database.
 *
 * @returns The number of Users that were deleted.
 */
export async function deleteAllUsersFromDatabase() {
	// Delete dependencies first to satisfy foreign key constraints
	await prisma.team.deleteMany();
	// Check if wallet model exists on prisma client before trying to delete
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
