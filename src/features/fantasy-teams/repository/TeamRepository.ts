import type { Team, RealLifeLeague } from '../../../generated/prisma/index.js'
import prisma from '../../../prisma.js' // Importing global prisma instance
import { databaseError, notFoundError } from '../../../fp/domain/errors/AppError.js'

// Types for repository operations
export interface CreateTeamData {
	userId: string
	teamValue: number
	teamPlayers: number[]
	captainId?: number
}

export interface UpdateTeamData {
	teamValue?: number
	teamPlayers?: number[]
	captainId?: number
    realLifeLeague?: RealLifeLeague 
}

// Repository functions - returning Promise

export const createTeam = async (
	data: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Team> => {
    try {
        return await prisma.team.create({ data });
    } catch (e: any) {
        throw databaseError('Create', 'Team', e);
    }
}

export const findTeamById = async (
	id: string
): Promise<Team> => {
    try {
        const team = await prisma.team.findUnique({ where: { id } });
        if (!team) throw notFoundError('Team', id);
        return team;
    } catch (e: any) {
        // If it's already an AppError, rethrow. Otherwise wrap.
        // Simplified for now.
        if (e._tag) throw e;
        throw databaseError('Read', 'Team', e);
    }
}


export const findTeamByUserAndLeague = async (
	userId: string,
    realLifeLeague: RealLifeLeague
): Promise<Team> => {
    try {
        const team = await prisma.team.findUnique({ 
            where: { 
                userId_realLifeLeague: {
                    userId,
                    realLifeLeague
                }
            } 
        });
        if (!team) throw notFoundError('Team', `${userId}-${realLifeLeague}`);
        return team;
    } catch (e: any) {
        if (e._tag) throw e;
        throw databaseError('Read', 'Team', e);
    }
}

// Optional version - returns null instead of throwing when not found
export const findTeamByUserAndLeagueOptional = async (
	userId: string,
    realLifeLeague: RealLifeLeague
): Promise<Team | null> => {
    try {
        return await prisma.team.findUnique({ 
            where: { 
                userId_realLifeLeague: {
                    userId,
                    realLifeLeague
                }
            } 
        });
    } catch (e: any) {
        throw databaseError('Read', 'Team', e);
    }
}

export const findAllTeams = async (
    realLifeLeague?: RealLifeLeague
): Promise<Team[]> => {
    try {
        return await prisma.team.findMany({
            where: realLifeLeague ? { realLifeLeague } : undefined
        });
    } catch (e: any) {
        throw databaseError('Read', 'Team', e);
    }
}

export const updateTeam = async (
	id: string,
	data: Partial<Team>
): Promise<Team> => {
    try {
        return await prisma.team.update({ where: { id }, data });
    } catch (e: any) {
        throw databaseError('Update', 'Team', e);
    }
}

export const deleteTeam = async (
	id: string
): Promise<Team> => {
    try {
        return await prisma.team.delete({ where: { id } });
    } catch (e: any) {
        throw databaseError('Delete', 'Team', e);
    }
}

export const deleteAllTeams = async (): Promise<{ count: number }> => {
    try {
        return await prisma.team.deleteMany();
    } catch (e: any) {
        throw databaseError('Delete', 'Team', e);
    }
}
