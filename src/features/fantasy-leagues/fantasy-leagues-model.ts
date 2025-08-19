import type { FantasyLeague, FantasyLeagueMembership } from "../../generated/prisma/index.js";
import prisma from "../../prisma.js";

export type PartialFantasyLeagueParameters = Parameters<typeof prisma.fantasyLeague.create>;

// CREATE

/**
 * Saves a new FantasyLeague to the database.
 *
 * @param league - The data for the FantasyLeague that should be created.
 * @returns The newly created FantasyLeague.
 */
export async function saveFantasyLeagueToDatabase(league: Omit<FantasyLeague, 'id' | 'createdAt' | 'updatedAt'>) {
	return await prisma.fantasyLeague.create({ data: league });
}

/**
 * Saves a new FantasyLeagueMembership to the database.
 *
 * @param membership - The data for the FantasyLeagueMembership that should be created.
 * @returns The newly created FantasyLeagueMembership.
 */
export async function saveFantasyLeagueMembershipToDatabase(membership: Omit<FantasyLeagueMembership, 'id' | 'createdAt' | 'updatedAt'>) {
	return await prisma.fantasyLeagueMembership.create({ data: membership });
}

// READ

/**
 * Retrieves a FantasyLeague record from the database based on its id.
 *
 * @param id - The id of the FantasyLeague to get.
 * @returns The FantasyLeague with a given id or null if it wasn't found.
 */
export async function retrieveFantasyLeagueFromDatabaseById(id: FantasyLeague["id"]) {
	return await prisma.fantasyLeague.findUnique({ where: { id } });
}

/**
 * Retrieves all FantasyLeague records from the database.
 *
 * @returns An array of all FantasyLeagues.
 */
export async function retrieveAllFantasyLeaguesFromDatabase() {
	return await prisma.fantasyLeague.findMany();
}

/**
 * Retrieves all FantasyLeague records owned by a specific user.
 *
 * @param userId - The id of the User who owns the leagues.
 * @returns An array of FantasyLeagues owned by the user.
 */
export async function retrieveFantasyLeaguesByOwnerId(userId: string) {
	return await prisma.fantasyLeague.findMany({ where: { ownerId: userId } });
}

/**
 * Retrieves a FantasyLeagueMembership record from the database based on its id.
 *
 * @param id - The id of the FantasyLeagueMembership to get.
 * @returns The FantasyLeagueMembership with a given id or null if it wasn't found.
 */
export async function retrieveFantasyLeagueMembershipFromDatabaseById(id: FantasyLeagueMembership["id"]) {
	return await prisma.fantasyLeagueMembership.findUnique({ where: { id } });
}

/**
 * Retrieves all FantasyLeagueMembership records for a specific user.
 *
 * @param userId - The id of the User whose memberships to retrieve.
 * @returns An array of FantasyLeagueMemberships for the user.
 */
export async function retrieveFantasyLeagueMembershipsByUserId(userId: string) {
	return await prisma.fantasyLeagueMembership.findMany({ where: { userId } });
}

/**
 * Retrieves all FantasyLeagueMembership records for a specific league.
 *
 * @param leagueId - The id of the FantasyLeague whose memberships to retrieve.
 * @returns An array of FantasyLeagueMemberships for the league.
 */
export async function retrieveFantasyLeagueMembershipsByLeagueId(leagueId: string) {
	return await prisma.fantasyLeagueMembership.findMany({ where: { leagueId } });
}

// UPDATE

/**
 * Updates a FantasyLeague in the database.
 *
 * @param options - An object with the FantasyLeague's id and the new values.
 * @returns The updated FantasyLeague.
 */
export async function updateFantasyLeagueInDatabaseById({
	id,
	league,
}: {
	/**
	 * The id of the FantasyLeague you want to update.
	 */
	id: FantasyLeague["id"];
	/**
	 * The values of the FantasyLeague you want to change.
	 */
	league: Partial<Omit<Parameters<typeof prisma.fantasyLeague.update>, "id">>;
}) {
	return await prisma.fantasyLeague.update({
		where: { id },
		data: league,
	});
}

/**
 * Updates a FantasyLeagueMembership in the database.
 *
 * @param options - An object with the FantasyLeagueMembership's id and the new values.
 * @returns The updated FantasyLeagueMembership.
 */
export async function updateFantasyLeagueMembershipInDatabaseById({
	id,
	membership,
}: {
	/**
	 * The id of the FantasyLeagueMembership you want to update.
	 */
	id: FantasyLeagueMembership["id"];
	/**
	 * The values of the FantasyLeagueMembership you want to change.
	 */
	membership: Partial<Omit<Parameters<typeof prisma.fantasyLeagueMembership.update>, "id">>;
}) {
	return await prisma.fantasyLeagueMembership.update({
		where: { id },
		data: membership,
	});
}

// DELETE

/**
 * Removes a FantasyLeague from the database.
 *
 * @param id - The id of the FantasyLeague you want to delete.
 * @returns The FantasyLeague that was deleted.
 */
export async function deleteFantasyLeagueFromDatabaseById(id: FantasyLeague["id"]) {
	return await prisma.fantasyLeague.delete({ where: { id } });
}

/**
 * Removes all FantasyLeagues from the database.
 *
 * @returns The number of FantasyLeagues that were deleted.
 */
export async function deleteAllFantasyLeaguesFromDatabase() {
	// Delete memberships first as they reference leagues
	await prisma.fantasyLeagueMembership.deleteMany();
	// Then delete leagues
	const result = await prisma.fantasyLeague.deleteMany();
	return result.count;
}

/**
 * Removes a FantasyLeagueMembership from the database.
 *
 * @param id - The id of the FantasyLeagueMembership you want to delete.
 * @returns The FantasyLeagueMembership that was deleted.
 */
export async function deleteFantasyLeagueMembershipFromDatabaseById(id: FantasyLeagueMembership["id"]) {
	return await prisma.fantasyLeagueMembership.delete({ where: { id } });
}

/**
 * Removes all FantasyLeagueMemberships from the database.
 *
 * @returns The number of FantasyLeagueMemberships that were deleted.
 */
export async function deleteAllFantasyLeagueMembershipsFromDatabase() {
	const result = await prisma.fantasyLeagueMembership.deleteMany();
	return result.count;
}