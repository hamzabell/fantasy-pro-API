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
 * Saves a new UserPowerUp to the database.
 *
 * @param userPowerUp - The data for the UserPowerUp that should be created.
 * @returns The newly created UserPowerUp.
 */
export function saveUserPowerUpToDatabase(userPowerUp) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.userPowerUp.create({ data: userPowerUp });
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
 * Retrieves all PowerUp records from the database.
 *
 * @returns An array of all PowerUps.
 */
export function retrieveAllPowerUpsFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.powerUp.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
    });
}
/**
 * Retrieves a UserPowerUp record from the database based on its id.
 *
 * @param id - The id of the UserPowerUp to get.
 * @returns The UserPowerUp with a given id or null if it wasn't found.
 */
export function retrieveUserPowerUpFromDatabaseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.userPowerUp.findUnique({ where: { id } });
    });
}
/**
 * Retrieves all UserPowerUp records for a specific user.
 *
 * @param userId - The id of the User whose power-ups to retrieve.
 * @returns An array of UserPowerUps for the user.
 */
export function retrieveUserPowerUpsByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.userPowerUp.findMany({
            where: {
                userId,
                isBurnt: false
            },
            include: {
                powerUp: true
            }
        });
    });
}
/**
 * Retrieves a FantasyLeagueMembershipPowerUp record from the database based on its id.
 *
 * @param id - The id of the FantasyLeagueMembershipPowerUp to get.
 * @returns The FantasyLeagueMembershipPowerUp with a given id or null if it wasn't found.
 */
export function retrieveFantasyLeagueMembershipPowerUpFromDatabaseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembershipPowerUp.findUnique({ where: { id } });
    });
}
/**
 * Retrieves all FantasyLeagueMembershipPowerUp records for a specific membership.
 *
 * @param membershipId - The id of the FantasyLeagueMembership whose power-ups to retrieve.
 * @returns An array of FantasyLeagueMembershipPowerUps for the membership.
 */
export function retrieveFantasyLeagueMembershipPowerUpsByMembershipId(membershipId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembershipPowerUp.findMany({
            where: {
                fantasyLeagueMembershipId: membershipId,
                isBurnt: false
            },
            include: {
                powerUp: true
            }
        });
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
                fantasyLeagueMembershipId: membership.id,
                isBurnt: false
            },
            include: {
                powerUp: true
            }
        });
    });
}
/**
 * Retrieves all featured PowerUp records from the database.
 *
 * @returns An array of featured PowerUps.
 */
export function retrieveFeaturedPowerUpsFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.powerUp.findMany({
            where: {
                isActive: true,
                isFeatured: true
            },
            orderBy: { createdAt: 'desc' }
        });
    });
}
// UPDATE
/**
 * Updates a PowerUp in the database.
 *
 * @param options - An object with the PowerUp's id and the new values.
 * @returns The updated PowerUp.
 */
export function updatePowerUpInDatabaseById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, powerUp, }) {
        return yield prisma.powerUp.update({
            where: { id },
            data: powerUp,
        });
    });
}
/**
 * Updates a UserPowerUp in the database.
 *
 * @param options - An object with the UserPowerUp's id and the new values.
 * @returns The updated UserPowerUp.
 */
export function updateUserPowerUpInDatabaseById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, userPowerUp, }) {
        return yield prisma.userPowerUp.update({
            where: { id },
            data: userPowerUp,
        });
    });
}
/**
 * Updates a FantasyLeagueMembershipPowerUp in the database.
 *
 * @param options - An object with the FantasyLeagueMembershipPowerUp's id and the new values.
 * @returns The updated FantasyLeagueMembershipPowerUp.
 */
export function updateFantasyLeagueMembershipPowerUpInDatabaseById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, fantasyLeagueMembershipPowerUp, }) {
        return yield prisma.fantasyLeagueMembershipPowerUp.update({
            where: { id },
            data: fantasyLeagueMembershipPowerUp,
        });
    });
}
// DELETE
/**
 * Removes a PowerUp from the database.
 *
 * @param id - The id of the PowerUp you want to delete.
 * @returns The PowerUp that was deleted.
 */
export function deletePowerUpFromDatabaseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.powerUp.delete({ where: { id } });
    });
}
/**
 * Removes all PowerUps from the database.
 *
 * @returns The number of PowerUps that were deleted.
 */
export function deleteAllPowerUpsFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.powerUp.deleteMany();
    });
}
/**
 * Removes all UserPowerUps from the database.
 *
 * @returns The number of UserPowerUps that were deleted.
 */
export function deleteAllUserPowerUpsFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.userPowerUp.deleteMany();
    });
}
/**
 * Removes all FantasyLeagueMembershipPowerUps from the database.
 *
 * @returns The number of FantasyLeagueMembershipPowerUps that were deleted.
 */
export function deleteAllFantasyLeagueMembershipPowerUpsFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembershipPowerUp.deleteMany();
    });
}
