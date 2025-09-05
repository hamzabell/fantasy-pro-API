var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../../prisma.js";
// CREATE
/**
 * Saves a new PowerUp to the database.
 *
 * @param powerUp - The data for the PowerUp that should be created.
 * @returns The newly created PowerUp.
 */
export function savePowerUpToDatabase(powerUp) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.powerUp.create({ data: powerUp });
    });
}
/**
 * Saves a new PowerUpUsage to the database.
 *
 * @param powerUpUsage - The data for the PowerUpUsage that should be created.
 * @returns The newly created PowerUpUsage.
 */
export function savePowerUpUsageToDatabase(powerUpUsage) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.powerUpUsage.create({ data: powerUpUsage });
    });
}
/**
 * Saves a new FantasyLeagueMembershipPowerUp to the database.
 *
 * @param fantasyLeagueMembershipPowerUp - The data for the FantasyLeagueMembershipPowerUp that should be created.
 * @returns The newly created FantasyLeagueMembershipPowerUp.
 */
export function saveFantasyLeagueMembershipPowerUpToDatabase(fantasyLeagueMembershipPowerUp) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembershipPowerUp.create({ data: fantasyLeagueMembershipPowerUp });
    });
}
// READ
/**
 * Retrieves a PowerUp record from the database based on its id.
 *
 * @param id - The id of the PowerUp to get.
 * @returns The PowerUp with a given id or null if it wasn't found.
 */
export function retrievePowerUpFromDatabaseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.powerUp.findUnique({ where: { id } });
    });
}
/**
 * Retrieves a PowerUpUsage record from the database based on transaction ID.
 *
 * @param transactionId - The transaction ID to get.
 * @returns The PowerUpUsage with a given transaction ID or null if it wasn't found.
 */
export function retrievePowerUpUsageByTransactionId(transactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.powerUpUsage.findUnique({ where: { transactionId } });
    });
}
/**
 * Retrieves all FantasyLeagueMembershipPowerUp records for a specific league and user.
 *
 * @param leagueId - The id of the FantasyLeague whose power-ups to retrieve.
 * @param userId - The id of the User whose power-ups to retrieve.
 * @returns An array of FantasyLeagueMembershipPowerUps for the membership.
 */
export function retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId(leagueId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // First, find the membership for this user in this league
        const membership = yield prisma.fantasyLeagueMembership.findUnique({
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
        return yield prisma.fantasyLeagueMembershipPowerUp.findMany({
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
    });
}
/**
 * Updates a PowerUpUsage in the database.
 *
 * @param options - An object with the PowerUpUsage's id and the new values.
 * @returns The updated PowerUpUsage.
 */
export function updatePowerUpUsageInDatabaseById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, powerUpUsage, }) {
        return yield prisma.powerUpUsage.update({
            where: { id },
            data: powerUpUsage,
        });
    });
}
