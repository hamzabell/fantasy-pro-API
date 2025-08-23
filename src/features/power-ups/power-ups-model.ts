import type { PowerUp, UserPowerUp, FantasyLeagueMembershipPowerUp } from "../../generated/prisma/index.js";
import prisma from "../../prisma.js";

// CREATE

/**
 * Saves a new PowerUp to the database.
 *
 * @param powerUp - The data for the PowerUp that should be created.
 * @returns The newly created PowerUp.
 */
export async function savePowerUpToDatabase(powerUp: Omit<PowerUp, 'id' | 'createdAt' | 'updatedAt'>) {
	return await prisma.powerUp.create({ data: powerUp });
}

/**
 * Saves a new UserPowerUp to the database.
 *
 * @param userPowerUp - The data for the UserPowerUp that should be created.
 * @returns The newly created UserPowerUp.
 */
export async function saveUserPowerUpToDatabase(userPowerUp: Omit<UserPowerUp, 'id' | 'createdAt' | 'updatedAt'>) {
	return await prisma.userPowerUp.create({ data: userPowerUp });
}

/**
 * Saves a new FantasyLeagueMembershipPowerUp to the database.
 *
 * @param fantasyLeagueMembershipPowerUp - The data for the FantasyLeagueMembershipPowerUp that should be created.
 * @returns The newly created FantasyLeagueMembershipPowerUp.
 */
export async function saveFantasyLeagueMembershipPowerUpToDatabase(fantasyLeagueMembershipPowerUp: Omit<FantasyLeagueMembershipPowerUp, 'id' | 'createdAt' | 'updatedAt'>) {
	return await prisma.fantasyLeagueMembershipPowerUp.create({ data: fantasyLeagueMembershipPowerUp });
}

// READ

/**
 * Retrieves a PowerUp record from the database based on its id.
 *
 * @param id - The id of the PowerUp to get.
 * @returns The PowerUp with a given id or null if it wasn't found.
 */
export async function retrievePowerUpFromDatabaseById(id: PowerUp["id"]) {
	return await prisma.powerUp.findUnique({ where: { id } });
}

/**
 * Retrieves all PowerUp records from the database.
 *
 * @returns An array of all PowerUps.
 */
export async function retrieveAllPowerUpsFromDatabase() {
	return await prisma.powerUp.findMany({
		where: { isActive: true },
		orderBy: { createdAt: 'desc' }
	});
}

/**
 * Retrieves a UserPowerUp record from the database based on its id.
 *
 * @param id - The id of the UserPowerUp to get.
 * @returns The UserPowerUp with a given id or null if it wasn't found.
 */
export async function retrieveUserPowerUpFromDatabaseById(id: UserPowerUp["id"]) {
	return await prisma.userPowerUp.findUnique({ where: { id } });
}

/**
 * Retrieves all UserPowerUp records for a specific user.
 *
 * @param userId - The id of the User whose power-ups to retrieve.
 * @returns An array of UserPowerUps for the user.
 */
export async function retrieveUserPowerUpsByUserId(userId: string) {
	return await prisma.userPowerUp.findMany({ 
		where: { 
			userId,
			isBurnt: false
		},
		include: {
			powerUp: true
		}
	});
}

/**
 * Retrieves a FantasyLeagueMembershipPowerUp record from the database based on its id.
 *
 * @param id - The id of the FantasyLeagueMembershipPowerUp to get.
 * @returns The FantasyLeagueMembershipPowerUp with a given id or null if it wasn't found.
 */
export async function retrieveFantasyLeagueMembershipPowerUpFromDatabaseById(id: FantasyLeagueMembershipPowerUp["id"]) {
	return await prisma.fantasyLeagueMembershipPowerUp.findUnique({ where: { id } });
}

/**
 * Retrieves all FantasyLeagueMembershipPowerUp records for a specific membership.
 *
 * @param membershipId - The id of the FantasyLeagueMembership whose power-ups to retrieve.
 * @returns An array of FantasyLeagueMembershipPowerUps for the membership.
 */
export async function retrieveFantasyLeagueMembershipPowerUpsByMembershipId(membershipId: string) {
	return await prisma.fantasyLeagueMembershipPowerUp.findMany({ 
		where: { 
			fantasyLeagueMembershipId: membershipId,
			isBurnt: false
		},
		include: {
			powerUp: true
		}
	});
}

/**
 * Retrieves all FantasyLeagueMembershipPowerUp records for a specific league and user.
 *
 * @param leagueId - The id of the FantasyLeague whose power-ups to retrieve.
 * @param userId - The id of the User whose power-ups to retrieve.
 * @returns An array of FantasyLeagueMembershipPowerUps for the membership.
 */
export async function retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId(leagueId: string, userId: string) {
	// First, find the membership for this user in this league
	const membership = await prisma.fantasyLeagueMembership.findUnique({
		where: {
			userId_leagueId: {
				userId,
				leagueId
			}
		}
	});
	
	// If no membership found, return empty array
	if (!membership) {
		return [];
	}
	
	// Then retrieve the power-ups for that membership
	return await prisma.fantasyLeagueMembershipPowerUp.findMany({ 
		where: { 
			fantasyLeagueMembershipId: membership.id,
			isBurnt: false
		},
		include: {
			powerUp: true
		}
	});
}

/**
 * Retrieves all featured PowerUp records from the database.
 *
 * @returns An array of featured PowerUps.
 */
export async function retrieveFeaturedPowerUpsFromDatabase() {
	return await prisma.powerUp.findMany({
		where: { 
			isActive: true,
			isFeatured: true
		},
		orderBy: { createdAt: 'desc' }
	});
}

// UPDATE

/**
 * Updates a PowerUp in the database.
 *
 * @param options - An object with the PowerUp's id and the new values.
 * @returns The updated PowerUp.
 */
export async function updatePowerUpInDatabaseById({
	id,
	powerUp,
}: {
	/**
	 * The id of the PowerUp you want to update.
	 */
	id: PowerUp["id"];
	/**
	 * The values of the PowerUp you want to change.
	 */
	powerUp: Partial<PowerUp>;
}) {
	return await prisma.powerUp.update({
		where: { id },
		data: powerUp,
	});
}

/**
 * Updates a UserPowerUp in the database.
 *
 * @param options - An object with the UserPowerUp's id and the new values.
 * @returns The updated UserPowerUp.
 */
export async function updateUserPowerUpInDatabaseById({
	id,
	userPowerUp,
}: {
	/**
	 * The id of the UserPowerUp you want to update.
	 */
	id: UserPowerUp["id"];
	/**
	 * The values of the UserPowerUp you want to change.
	 */
	userPowerUp: Partial<UserPowerUp>;
}) {
	return await prisma.userPowerUp.update({
		where: { id },
		data: userPowerUp,
	});
}

/**
 * Updates a FantasyLeagueMembershipPowerUp in the database.
 *
 * @param options - An object with the FantasyLeagueMembershipPowerUp's id and the new values.
 * @returns The updated FantasyLeagueMembershipPowerUp.
 */
export async function updateFantasyLeagueMembershipPowerUpInDatabaseById({
	id,
	fantasyLeagueMembershipPowerUp,
}: {
	/**
	 * The id of the FantasyLeagueMembershipPowerUp you want to update.
	 */
	id: FantasyLeagueMembershipPowerUp["id"];
	/**
	 * The values of the FantasyLeagueMembershipPowerUp you want to change.
	 */
	fantasyLeagueMembershipPowerUp: Partial<FantasyLeagueMembershipPowerUp>;
}) {
	return await prisma.fantasyLeagueMembershipPowerUp.update({
		where: { id },
		data: fantasyLeagueMembershipPowerUp,
	});
}

// DELETE

/**
 * Removes a PowerUp from the database.
 *
 * @param id - The id of the PowerUp you want to delete.
 * @returns The PowerUp that was deleted.
 */
export async function deletePowerUpFromDatabaseById(id: PowerUp["id"]) {
	return await prisma.powerUp.delete({ where: { id } });
}

/**
 * Removes all PowerUps from the database.
 *
 * @returns The number of PowerUps that were deleted.
 */
export async function deleteAllPowerUpsFromDatabase() {
	return await prisma.powerUp.deleteMany();
}

/**
 * Removes all UserPowerUps from the database.
 *
 * @returns The number of UserPowerUps that were deleted.
 */
export async function deleteAllUserPowerUpsFromDatabase() {
	return await prisma.userPowerUp.deleteMany();
}

/**
 * Removes all FantasyLeagueMembershipPowerUps from the database.
 *
 * @returns The number of FantasyLeagueMembershipPowerUps that were deleted.
 */
export async function deleteAllFantasyLeagueMembershipPowerUpsFromDatabase() {
	return await prisma.fantasyLeagueMembershipPowerUp.deleteMany();
}