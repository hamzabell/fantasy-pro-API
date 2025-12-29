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
 * Saves a new User to the database.
 *
 * @param user - Parameters of the User that should be created.
 * @returns The newly created User.
 */
export function saveUserToDatabase(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user.create({ data: user });
    });
}
// Adapting to TaskEither for functional architecture conformance
import * as TE from 'fp-ts/es6/TaskEither.js';
import { databaseError, notFoundError } from '../../fp/domain/errors/AppError.js';
// Removed invalid import
/**
 * Retrieves a User record from the database based on its email.
 */
export const retrieveUserFromDatabaseByEmail = (email) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () { return prisma.user.findUnique({ where: { email } }); }), (e) => databaseError('Read', 'User', e));
export const retrieveUserFromDatabaseById = (id) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () { return prisma.user.findUnique({ where: { id } }); }), (e) => databaseError('Read', 'User', e));
/**
 * Retrieves user statistics: matches (leagues joined), total points, and trophies (wins).
 */
export const retrieveUserStats = (userId) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
    const memberships = yield prisma.fantasyLeagueMembership.findMany({
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
}), (e) => databaseError('Read', 'UserStats', e));
// UPDATE
/**
 * Updates a User in the database.
 *
 * @param options - An object with the User's id and the new values.
 * @returns The updated User.
 */
export function updateUserInDatabaseById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, user, }) {
        return yield prisma.user.update({
            where: { id: userId },
            data: user,
        });
    });
}
// DELETE
/**
 * Removes a User from the database.
 *
 * @param id - The id of the User you want to delete.
 * @returns The User that was deleted.
 */
export function deleteUserFromDatabaseById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prisma.user.delete({ where: { id: userId } });
        }
        catch (error) {
            // If the user doesn't exist, return null instead of throwing an error
            if (error instanceof Error && error.message.includes('No record was found for a delete')) {
                return null;
            }
            // Re-throw other errors
            throw error;
        }
    });
}
/**
 * Removes all Users from the database.
 *
 * @returns The number of Users that were deleted.
 */
export function deleteAllUsersFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        // Delete dependencies first to satisfy foreign key constraints
        yield prisma.team.deleteMany();
        // Check if wallet model exists on prisma client before trying to delete
        // @ts-ignore
        if (prisma.wallet) {
            // @ts-ignore
            yield prisma.wallet.deleteMany();
        }
        return yield prisma.user.deleteMany();
    });
}
/**
 * Increments the user's coins.
 */
export function incrementUserCoins(userId, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user.update({
            where: { id: userId },
            data: {
                coins: {
                    increment: amount
                }
            }
        });
    });
}
