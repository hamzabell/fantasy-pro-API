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

// READ

/**
 * Retrieves a User record from the database based on its id.
 *
 * @param id - The id of the User to get.
 * @returns The User with a given id or null if it wasn't found.
 */
export async function retrieveUserFromDatabaseById(userId: User["id"]) {
	return await prisma.user.findUnique({
		where: { id: userId }
	})
}

/**
 * Retrieves all User records from the database.
 *
 * @returns An array of all Users.
 */
export async function retrieveAllUsersFromDatabase() {
	return await prisma.user.findMany();
}

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
	return await prisma.user.deleteMany();
}
