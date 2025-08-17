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
	// For test users, we might want to let Prisma generate the ID
	// unless we specifically need to control it
	return await prisma.user.create({ data: user });
}

// READ

/**
 * Retrieves a User record from the database based on its id.
 *
 * @param id - The id of the User to get.
 * @returns The User with a given id or null if it wasn't found.
 */
export async function retrieveUserFromDatabaseById(id: User["id"]) {
	// Ensure the user ID is a valid string
	const userId = String(id);
	return await prisma.user.findUnique({
 			where: { id: userId },   
	});
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
	id,
	user,
}: {
	/**
	 * The id of the User you want to update.
	 */
	id: User["id"];
	/**
	 * The values of the User you want to change.
	 */
	user: Partial<Omit<Parameters<typeof prisma.user.update>, "id">>;
}) {
	// Ensure the user ID is a valid string
	const userId = String(id);
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
export async function deleteUserFromDatabaseById(id: User["id"]) {
	// Ensure the user ID is a valid string
	const userId = String(id);
	return await prisma.user.delete({ where: { id: userId } });
}

/**
 * Removes all Users from the database.
 *
 * @returns The number of Users that were deleted.
 */
export async function deleteAllUsersFromDatabase() {
	const result = await prisma.user.deleteMany();
	return result.count;
}
