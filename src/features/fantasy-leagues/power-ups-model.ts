import type { PowerUp, PowerUpUsage, FantasyLeagueMembershipPowerUp } from "../../generated/prisma/index.js";
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
 * Saves a new PowerUpUsage to the database.
 *
 * @param powerUpUsage - The data for the PowerUpUsage that should be created.
 * @returns The newly created PowerUpUsage.
 */
export async function savePowerUpUsageToDatabase(powerUpUsage: Omit<PowerUpUsage, 'id' | 'createdAt' | 'updatedAt'>) {
	return await prisma.powerUpUsage.create({ data: powerUpUsage });
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
 * Retrieves a PowerUpUsage record from the database based on transaction ID.
 *
 * @param transactionId - The transaction ID to get.
 * @returns The PowerUpUsage with a given transaction ID or null if it wasn't found.
 */
export async function retrievePowerUpUsageByTransactionId(transactionId: string) {
	return await prisma.powerUpUsage.findUnique({ where: { transactionId } });
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
			fantasyLeagueMembershipId: membership.id
		},
		include: {
			powerUpUsage: {
				include: {
					powerUp: true
				}
			}
		}
	});
}

/**
 * Updates a PowerUpUsage in the database.
 *
 * @param options - An object with the PowerUpUsage's id and the new values.
 * @returns The updated PowerUpUsage.
 */
export async function updatePowerUpUsageInDatabaseById({
	id,
	powerUpUsage,
}: {
	/**
	 * The id of the PowerUpUsage you want to update.
	 */
	id: PowerUpUsage["id"];
	/**
	 * The values of the PowerUpUsage you want to change.
	 */
	powerUpUsage: Partial<PowerUpUsage>;
}) {
	return await prisma.powerUpUsage.update({
		where: { id },
		data: powerUpUsage,
	});
}