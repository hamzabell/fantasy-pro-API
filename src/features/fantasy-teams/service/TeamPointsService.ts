import * as RTE from 'fp-ts/lib/ReaderTaskEither.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
import * as F from 'fp-ts/lib/function.js';
const { pipe } = F;
import type { RealLifeLeague } from '../../../generated/prisma/index.js';
import type { AppEnvironment } from '../../../fp/infrastructure/Environment.js';
import type { AppError } from '../../../fp/domain/errors/AppError.js';
import { notFoundError, externalApiError } from '../../../fp/domain/errors/AppError.js';
import { findTeamByUserAndLeague } from '../repository/TeamRepository.js';
import { fetchPlayerStatsByGameweek } from '../../fantasy-premier-league/fantasy-premier-league-api.js';

export interface PlayerGameweekStats {
    id: number;
    name: string;
    position: string;
    stats: {
        points: number;
        goals: number;
        assists: number;
        clean_sheets: number;
        goals_conceded: number;
        own_goals: number;
        penalties_saved: number;
        penalties_missed: number;
        yellow_cards: number;
        red_cards: number;
        saves: number;
        bonus: number;
        minutes: number;
    };
}

export interface TeamGameweekPoints {
    gameweekId: number;
    totalPoints: number;
    players: PlayerGameweekStats[];
}

const fetchPlayerStatsTE = (playerId: number, gameweekId: number): TE.TaskEither<AppError, any> =>
    TE.tryCatch(
        () => fetchPlayerStatsByGameweek(playerId, gameweekId),
        (error) => externalApiError('FPL', `Failed to fetch stats for player ${playerId}: ${String(error)}`)
    );

export const getTeamPointsService = (
    userId: string,
    gameweekId: number,
    realLifeLeague: RealLifeLeague = 'PREMIER_LEAGUE'
): RTE.ReaderTaskEither<AppEnvironment, AppError, TeamGameweekPoints> =>
    pipe(
        // 1. Find user's team
        findTeamByUserAndLeague(userId, realLifeLeague),
        
        // 2. Fetch stats for each player
        RTE.chainW((team) => 
            pipe(
                RTE.traverseArray((playerId: number) => 
                    pipe(
                        RTE.fromTaskEither(fetchPlayerStatsTE(playerId, gameweekId)),
                        RTE.map((stats) => ({
                            id: playerId,
                            stats
                        }))
                    )
                )(team.teamPlayers),
                RTE.map((playersStats) => ({ team, playersStats }))
            )
        ),

        // 3. Format response
        RTE.map(({ team, playersStats }) => {
            const players = playersStats.map((p) => ({
                id: p.id,
                name: p.stats.name, // We'll need name from fetchPlayerStatsByGameweek
                position: p.stats.position,
                stats: {
                    points: p.stats.total_points,
                    goals: p.stats.goals_scored,
                    assists: p.stats.assists,
                    clean_sheets: p.stats.clean_sheets,
                    goals_conceded: p.stats.goals_conceded,
                    own_goals: p.stats.own_goals,
                    penalties_saved: p.stats.penalties_saved,
                    penalties_missed: p.stats.penalties_missed,
                    yellow_cards: p.stats.yellow_cards,
                    red_cards: p.stats.red_cards,
                    saves: p.stats.saves,
                    bonus: p.stats.bonus,
                    minutes: p.stats.minutes
                }
            }));

            const totalPoints = players.reduce((sum: number, p: any) => sum + p.stats.points, 0);

            return {
                gameweekId,
                totalPoints,
                players
            };
        })
    );
