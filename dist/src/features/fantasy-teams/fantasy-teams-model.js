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
 * Saves a new Team to the database.
 *
 * @param team - Parameters of the Team that should be created.
 * @returns The newly created Team.
 */
export function saveTeamToDatabase(team) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.team.create({ data: team });
    });
}
// READ
/**
 * Retrieves a Team record from the database based on its id.
 *
 * @param id - The id of the Team to get.
 * @returns The Team with a given id or null if it wasn't found.
 */
export function retrieveTeamFromDatabaseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.team.findUnique({ where: { id } });
    });
}
/**
 * Retrieves all Team records from the database.
 *
 * @returns An array of all Teams.
 */
export function retrieveAllTeamsFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.team.findMany();
    });
}
// UPDATE
/**
 * Updates a Team in the database.
 *
 * @param options - An object with the Team's id and the new values.
 * @returns The updated Team.
 */
export function updateTeamInDatabaseById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, team, }) {
        return yield prisma.team.update({
            where: { id },
            data: team,
        });
    });
}
// DELETE
/**
 * Removes a Team from the database.
 *
 * @param id - The id of the Team you want to delete.
 * @returns The Team that was deleted.
 */
export function deleteTeamFromDatabaseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.team.delete({ where: { id } });
    });
}
