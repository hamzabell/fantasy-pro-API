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
import { fetchGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
// CREATE
/**
 * Saves a new FantasyLeague to the database.
 *
 * @param league - The data for the FantasyLeague that should be created.
 * @returns The newly created FantasyLeague.
 */
export function saveFantasyLeagueToDatabase(league) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeague.create({ data: league });
    });
}
/**
 * Saves a new FantasyLeagueMembership to the database.
 *
 * @param membership - The data for the FantasyLeagueMembership that should be created.
 * @returns The newly created FantasyLeagueMembership.
 */
export function saveFantasyLeagueMembershipToDatabase(membership) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembership.create({ data: membership });
    });
}
// READ
/**
 * Retrieves a FantasyLeague record from the database based on its id.
 *
 * @param id - The id of the FantasyLeague to get.
 * @returns The FantasyLeague with a given id or null if it wasn't found.
 */
export function retrieveFantasyLeagueFromDatabaseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeague.findUnique({ where: { id } });
    });
}
/**
 * Retrieves all FantasyLeague records from the database.
 *
 * @returns An array of all FantasyLeagues.
 */
export function retrieveAllFantasyLeaguesFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeague.findMany();
    });
}
/**
 * Retrieves all FantasyLeague records owned by a specific user.
 *
 * @param userId - The id of the User who owns the leagues.
 * @returns An array of FantasyLeagues owned by the user.
 */
export function retrieveFantasyLeaguesByOwnerId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeague.findMany({ where: { ownerId: userId } });
    });
}
/**
 * Retrieves a FantasyLeagueMembership record from the database based on its id.
 *
 * @param id - The id of the FantasyLeagueMembership to get.
 * @returns The FantasyLeagueMembership with a given id or null if it wasn't found.
 */
export function retrieveFantasyLeagueMembershipFromDatabaseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembership.findUnique({ where: { id } });
    });
}
/**
 * Retrieves all FantasyLeagueMembership records for a specific user.
 *
 * @param userId - The id of the User whose memberships to retrieve.
 * @returns An array of FantasyLeagueMemberships for the user.
 */
export function retrieveFantasyLeagueMembershipsByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembership.findMany({ where: { userId } });
    });
}
/**
 * Retrieves all FantasyLeagueMembership records for a specific league.
 *
 * @param leagueId - The id of the FantasyLeague whose memberships to retrieve.
 * @returns An array of FantasyLeagueMemberships for the league.
 */
export function retrieveFantasyLeagueMembershipsByLeagueId(leagueId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembership.findMany({ where: { leagueId } });
    });
}
/**
 * Retrieves a FantasyLeagueMembership record from the database based on leagueId and userId.
 *
 * @param leagueId - The id of the FantasyLeague.
 * @param userId - The id of the User.
 * @returns The FantasyLeagueMembership or null.
 */
export function retrieveFantasyLeagueMembershipByLeagueAndUser(leagueId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembership.findFirst({
            where: {
                leagueId,
                userId
            }
        });
    });
}
/**
 * Counts the number of FantasyLeagueMembership records for a specific league.
 *
 * @param leagueId - The id of the FantasyLeague whose memberships to count.
 * @returns The number of FantasyLeagueMemberships for the league.
 */
export function countFantasyLeagueMembershipsByLeagueId(leagueId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembership.count({ where: { leagueId } });
    });
}
/**
 * Retrieves a User record from the database based on its id.
 *
 * @param id - The id of the User to get.
 * @returns The User with a given id or null if it wasn't found.
 */
export function retrieveUserFromDatabaseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user.findUnique({ where: { id } });
    });
}
/**
 * Retrieves a FantasyLeague record from the database based on its code.
 *
 * @param code - The code of the FantasyLeague to get.
 * @returns The FantasyLeague with a given code or null if it wasn't found.
 */
export function retrieveFantasyLeagueFromDatabaseByCode(code) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeague.findUnique({ where: { code } });
    });
}
// UPDATE
/**
 * Updates a FantasyLeague in the database.
 *
 * @param options - An object with the FantasyLeague's id and the new values.
 * @returns The updated FantasyLeague.
 */
export function updateFantasyLeagueInDatabaseById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, league, }) {
        return yield prisma.fantasyLeague.update({
            where: { id },
            data: league,
        });
    });
}
/**
 * Updates a FantasyLeagueMembership in the database.
 *
 * @param options - An object with the FantasyLeagueMembership's id and the new values.
 * @returns The updated FantasyLeagueMembership.
 */
export function updateFantasyLeagueMembershipInDatabaseById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, membership, }) {
        return yield prisma.fantasyLeagueMembership.update({
            where: { id },
            data: membership,
        });
    });
}
// DELETE
/**
 * Removes a FantasyLeague from the database.
 *
 * @param id - The id of the FantasyLeague you want to delete.
 * @returns The FantasyLeague that was deleted.
 */
export function deleteFantasyLeagueFromDatabaseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeague.delete({ where: { id } });
    });
}
/**
 * Removes all FantasyLeagues from the database.
 *
 * @returns The number of FantasyLeagues that were deleted.
 */
export function deleteAllFantasyLeaguesFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeague.deleteMany();
    });
}
/**
 * Removes a FantasyLeagueMembership from the database.
 *
 * @param id - The id of the FantasyLeagueMembership you want to delete.
 * @returns The FantasyLeagueMembership that was deleted.
 */
export function deleteFantasyLeagueMembershipFromDatabaseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembership.delete({ where: { id } });
    });
}
/**
 * Removes all FantasyLeagueMemberships from the database.
 *
 * @returns The number of FantasyLeagueMemberships that were deleted.
 */
export function deleteAllFantasyLeagueMembershipsFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.fantasyLeagueMembership.deleteMany();
    });
}
