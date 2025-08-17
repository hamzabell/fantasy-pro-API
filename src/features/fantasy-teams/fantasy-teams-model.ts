import type { Team, User } from "../../generated/prisma/index.js";
import prisma from "../../prisma.js";

export type PartialTeamParameters = Parameters<typeof prisma.team.create>;

// CREATE

/**
 * Saves a new Team to the database.
 *
 * @param team - The data for the Team that should be created.
 * @returns The newly created Team.
 */
export async function saveTeamToDatabase(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) {
	return await prisma.team.create({ data: team });
}

// READ

/**
 * Retrieves a Team record from the database based on its id.
 *
 * @param id - The id of the Team to get.
 * @returns The Team with a given id or null if it wasn't found.
 */
export async function retrieveTeamFromDatabaseById(id: Team["id"]) {
	return await prisma.team.findUnique({ where: { id } });
}


/**
 * Retrieves a Team record from the database based on its user id.
 *
 * @param id - The id of the User to get the Team for.
 * @returns The Team with a given id or null if it wasn't found.
 */
export async function retrieveTeamFromDatabaseByUserId(userId: User["id"]) {
	return await prisma.team.findUnique({ where: {
		userId
	}});
}

/**
 * Retrieves all Team records from the database.
 *
 * @returns An array of all Teams.
 */
export async function retrieveAllTeamsFromDatabase() {
	return await prisma.team.findMany();
}

// UPDATE

/**
 * Updates a Team in the database.
 *
 * @param options - An object with the Team's id and the new values.
 * @returns The updated Team.
 */
export async function updateTeamInDatabaseById({
	id,
	team,
}: {
	/**
	 * The id of the Team you want to update.
	 */
	id: Team["id"];
	/**
	 * The values of the Team you want to change.
	 */
	team: Partial<Omit<Parameters<typeof prisma.team.update>, "id">>;
}) {
	return await prisma.team.update({
		where: { id },
		data: team,
	});
}

// DELETE

/**
 * Removes a Team from the database.
 *
 * @param id - The id of the Team you want to delete.
 * @returns The Team that was deleted.
 */
export async function deleteTeamFromDatabaseById(id: Team["id"]) {
	return await prisma.team.delete({ where: { id } });
}

/**
 * Removes all Teams from the database.
 *
 * @returns The number of Teams that were deleted.
 */
export async function deleteAllTeamsFromDatabase() {
	const result = await prisma.team.deleteMany();
	return result.count;
}
