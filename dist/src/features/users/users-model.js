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
// READ
/**
 * Retrieves a User record from the database based on its id.
 *
 * @param id - The id of the User to get.
 * @returns The User with a given id or null if it wasn't found.
 */
export function retrieveUserFromDatabaseById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user.findUnique({
            where: { id: userId }
        });
    });
}
/**
 * Retrieves all User records from the database.
 *
 * @returns An array of all Users.
 */
export function retrieveAllUsersFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user.findMany();
    });
}
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
        return yield prisma.user.deleteMany();
    });
}
