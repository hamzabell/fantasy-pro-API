var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, test, expect, vi } from 'vitest';
import { calculateUserTotalPointsWithPowerUps } from './player-stats-with-powerups-facade.js';
import { calculateUserTeamStats } from './player-stats-utils.js';
import { retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId } from '../power-ups/power-ups-model.js';
import { retrieveTeamFromDatabaseByUserId } from '../fantasy-teams/fantasy-teams-model.js';
import { fetchPlayerPointsByGameweek } from '../fantasy-premier-league/fantasy-premier-league-api.js';
// Mock the dependencies
vi.mock('./player-stats-utils.js');
vi.mock('../power-ups/power-ups-model.js');
vi.mock('../fantasy-teams/fantasy-teams-model.js');
vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js');
describe('Player Stats with Power-Ups Facade', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    test('should calculate points with no power-ups', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the team without a captain
        vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
            id: 'team123',
            userId: 'user123',
            teamValue: 100,
            teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            captainId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Mock the base stats calculation
        vi.mocked(calculateUserTeamStats).mockResolvedValue({ points: 50, goals: 3 });
        // Mock no power-ups
        vi.mocked(retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId).mockResolvedValue([]);
        const result = yield calculateUserTotalPointsWithPowerUps('user123', 'league456', 1);
        expect(result).toEqual({
            points: 50,
            goals: 3,
            basePoints: 50,
            powerUpBonuses: [],
            powerUpBonus: 0
        });
    }));
    test('should calculate points with Double Points power-up', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the team without a captain
        vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
            id: 'team123',
            userId: 'user123',
            teamValue: 100,
            teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            captainId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Mock the base stats calculation
        vi.mocked(calculateUserTeamStats).mockResolvedValue({ points: 50, goals: 3 });
        // Mock Double Points power-up
        vi.mocked(retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId).mockResolvedValue([
            {
                id: 'membership-powerup-1',
                fantasyLeagueMembershipId: 'membership-1',
                powerUpId: 'powerup-1',
                isBurnt: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                powerUp: {
                    id: 'powerup-1',
                    name: 'Double Points',
                    description: 'Double your points for one gameweek',
                    price: '10',
                    tokenId: '1',
                    contractAddress: '0x1234567890123456789012345678901234567890',
                    metadataUri: 'https://example.com/metadata/1',
                    imageUrl: 'https://example.com/images/1.png',
                    isActive: true,
                    isFeatured: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        ]);
        const result = yield calculateUserTotalPointsWithPowerUps('user123', 'league456', 1);
        expect(result).toEqual({
            points: 100, // 50 (base) + 50 (double points)
            goals: 3,
            basePoints: 50,
            powerUpBonuses: [{ name: 'Double Points', bonus: 50 }],
            powerUpBonus: 50
        });
    }));
    test('should calculate points with Triple Captain power-up (no captain)', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the team without a captain
        vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
            id: 'team123',
            userId: 'user123',
            teamValue: 100,
            teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            captainId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Mock the base stats calculation
        vi.mocked(calculateUserTeamStats).mockResolvedValue({ points: 50, goals: 3 });
        // Mock Triple Captain power-up
        vi.mocked(retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId).mockResolvedValue([
            {
                id: 'membership-powerup-1',
                fantasyLeagueMembershipId: 'membership-1',
                powerUpId: 'powerup-1',
                isBurnt: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                powerUp: {
                    id: 'powerup-1',
                    name: 'Triple Captain',
                    description: "Captain's points are tripled instead of doubled.",
                    price: '15',
                    tokenId: '1',
                    contractAddress: '0x1234567890123456789012345678901234567890',
                    metadataUri: 'https://example.com/metadata/1',
                    imageUrl: 'https://example.com/images/1.png',
                    isActive: true,
                    isFeatured: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        ]);
        const result = yield calculateUserTotalPointsWithPowerUps('user123', 'league456', 1);
        expect(result).toEqual({
            points: 50, // 50 (base) + 0 (no captain)
            goals: 3,
            basePoints: 50,
            powerUpBonuses: [],
            powerUpBonus: 0
        });
    }));
    test('should calculate points with Triple Captain power-up (with captain)', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the team with a captain
        vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
            id: 'team123',
            userId: 'user123',
            teamValue: 100,
            teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            captainId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Mock the base stats calculation
        vi.mocked(calculateUserTeamStats).mockResolvedValue({ points: 50, goals: 3 });
        // Mock the captain's points (doubled by default)
        vi.mocked(fetchPlayerPointsByGameweek).mockResolvedValue(10);
        // Mock Triple Captain power-up
        vi.mocked(retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId).mockResolvedValue([
            {
                id: 'membership-powerup-1',
                fantasyLeagueMembershipId: 'membership-1',
                powerUpId: 'powerup-1',
                isBurnt: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                powerUp: {
                    id: 'powerup-1',
                    name: 'Triple Captain',
                    description: "Captain's points are tripled instead of doubled.",
                    price: '15',
                    tokenId: '1',
                    contractAddress: '0x1234567890123456789012345678901234567890',
                    metadataUri: 'https://example.com/metadata/1',
                    imageUrl: 'https://example.com/images/1.png',
                    isActive: true,
                    isFeatured: true,
                    categoryId: null,
                    category: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        ]);
        const result = yield calculateUserTotalPointsWithPowerUps('user123', 'league456', 1);
        expect(result).toEqual({
            points: 60, // 50 (base) + 10 (triple captain bonus: tripled points (30) - doubled points (20))
            goals: 3,
            basePoints: 50,
            powerUpBonuses: [{ name: 'Triple Captain', bonus: 10 }],
            powerUpBonus: 10
        });
    }));
    test('should calculate points with Defensive Wall power-up', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the team without a captain
        vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
            id: 'team123',
            userId: 'user123',
            teamValue: 100,
            teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            captainId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Mock the base stats calculation
        vi.mocked(calculateUserTeamStats).mockResolvedValue({ points: 50, goals: 3 });
        // Mock Defensive Wall power-up
        vi.mocked(retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId).mockResolvedValue([
            {
                id: 'membership-powerup-1',
                fantasyLeagueMembershipId: 'membership-1',
                powerUpId: 'powerup-1',
                isBurnt: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                powerUp: {
                    id: 'powerup-1',
                    name: 'Defensive Wall',
                    description: 'All defenders get +2 extra points for a clean sheet.',
                    price: '8',
                    tokenId: '1',
                    contractAddress: '0x1234567890123456789012345678901234567890',
                    metadataUri: 'https://example.com/metadata/1',
                    imageUrl: 'https://example.com/images/1.png',
                    isActive: true,
                    isFeatured: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        ]);
        const result = yield calculateUserTotalPointsWithPowerUps('user123', 'league456', 1);
        expect(result).toEqual({
            points: 53, // 50 (base) + 3 (defensive wall)
            goals: 3,
            basePoints: 50,
            powerUpBonuses: [{ name: 'Defensive Wall', bonus: 3 }],
            powerUpBonus: 3
        });
    }));
    test('should calculate points with Momentum Boost power-up (threshold met)', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the team without a captain
        vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
            id: 'team123',
            userId: 'user123',
            teamValue: 100,
            teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            captainId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Mock the base stats calculation above threshold
        vi.mocked(calculateUserTeamStats).mockResolvedValue({ points: 85, goals: 3 });
        // Mock Momentum Boost power-up
        vi.mocked(retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId).mockResolvedValue([
            {
                id: 'membership-powerup-1',
                fantasyLeagueMembershipId: 'membership-1',
                powerUpId: 'powerup-1',
                isBurnt: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                powerUp: {
                    id: 'powerup-1',
                    name: 'Momentum Boost',
                    description: 'If the team scores above a set threshold (e.g., 80 points), they get +10 bonus points.',
                    price: '12',
                    tokenId: '1',
                    contractAddress: '0x1234567890123456789012345678901234567890',
                    metadataUri: 'https://example.com/metadata/1',
                    imageUrl: 'https://example.com/images/1.png',
                    isActive: true,
                    isFeatured: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        ]);
        const result = yield calculateUserTotalPointsWithPowerUps('user123', 'league456', 1);
        expect(result).toEqual({
            points: 95, // 85 (base) + 10 (momentum boost)
            goals: 3,
            basePoints: 85,
            powerUpBonuses: [{ name: 'Momentum Boost', bonus: 10 }],
            powerUpBonus: 10
        });
    }));
    test('should calculate points with Momentum Boost power-up (threshold not met)', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the team without a captain
        vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
            id: 'team123',
            userId: 'user123',
            teamValue: 100,
            teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            captainId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Mock the base stats calculation below threshold
        vi.mocked(calculateUserTeamStats).mockResolvedValue({ points: 75, goals: 3 });
        // Mock Momentum Boost power-up
        vi.mocked(retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId).mockResolvedValue([
            {
                id: 'membership-powerup-1',
                fantasyLeagueMembershipId: 'membership-1',
                powerUpId: 'powerup-1',
                isBurnt: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                powerUp: {
                    id: 'powerup-1',
                    name: 'Momentum Boost',
                    description: 'If the team scores above a set threshold (e.g., 80 points), they get +10 bonus points.',
                    price: '12',
                    tokenId: '1',
                    contractAddress: '0x1234567890123456789012345678901234567890',
                    metadataUri: 'https://example.com/metadata/1',
                    imageUrl: 'https://example.com/images/1.png',
                    isActive: true,
                    isFeatured: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        ]);
        const result = yield calculateUserTotalPointsWithPowerUps('user123', 'league456', 1);
        expect(result).toEqual({
            points: 75, // 75 (base) + 0 (no momentum boost)
            goals: 3,
            basePoints: 75,
            powerUpBonuses: [],
            powerUpBonus: 0
        });
    }));
    test('should calculate points with Point Multiplier power-up', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the team without a captain
        vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
            id: 'team123',
            userId: 'user123',
            teamValue: 100,
            teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            captainId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Mock the base stats calculation
        vi.mocked(calculateUserTeamStats).mockResolvedValue({ points: 60, goals: 3 });
        // Mock Point Multiplier power-up
        vi.mocked(retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId).mockResolvedValue([
            {
                id: 'membership-powerup-1',
                fantasyLeagueMembershipId: 'membership-1',
                powerUpId: 'powerup-1',
                isBurnt: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                powerUp: {
                    id: 'powerup-1',
                    name: 'Point Multiplier',
                    description: 'Apply a 1.5x multiplier to the entire team\'s points for a single Gameweek.',
                    price: '25',
                    tokenId: '1',
                    contractAddress: '0x1234567890123456789012345678901234567890',
                    metadataUri: 'https://example.com/metadata/1',
                    imageUrl: 'https://example.com/images/1.png',
                    isActive: true,
                    isFeatured: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        ]);
        const result = yield calculateUserTotalPointsWithPowerUps('user123', 'league456', 1);
        expect(result).toEqual({
            points: 90, // 60 (base) + 30 (multiplier bonus)
            goals: 3,
            basePoints: 60,
            powerUpBonuses: [{ name: 'Point Multiplier', bonus: 30 }],
            powerUpBonus: 30
        });
    }));
    test('should calculate points with Bench Boost power-up', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the team without a captain
        vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
            id: 'team123',
            userId: 'user123',
            teamValue: 100,
            teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            captainId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Mock the base stats calculation
        vi.mocked(calculateUserTeamStats).mockResolvedValue({ points: 50, goals: 3 });
        // Mock Bench Boost power-up
        vi.mocked(retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId).mockResolvedValue([
            {
                id: 'membership-powerup-1',
                fantasyLeagueMembershipId: 'membership-1',
                powerUpId: 'powerup-1',
                isBurnt: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                powerUp: {
                    id: 'powerup-1',
                    name: 'Bench Boost',
                    description: 'Use your bench players.',
                    price: '8',
                    tokenId: '1',
                    contractAddress: '0x1234567890123456789012345678901234567890',
                    metadataUri: 'https://example.com/metadata/1',
                    imageUrl: 'https://example.com/images/1.png',
                    isActive: true,
                    isFeatured: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        ]);
        const result = yield calculateUserTotalPointsWithPowerUps('user123', 'league456', 1);
        expect(result).toEqual({
            points: 52, // 50 (base) + 2 (bench boost)
            goals: 3,
            basePoints: 50,
            powerUpBonuses: [{ name: 'Bench Boost', bonus: 2 }],
            powerUpBonus: 2
        });
    }));
    test('should calculate points with multiple power-ups', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the team with a captain
        vi.mocked(retrieveTeamFromDatabaseByUserId).mockResolvedValue({
            id: 'team123',
            userId: 'user123',
            teamValue: 100,
            teamPlayers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            captainId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Mock the base stats calculation
        vi.mocked(calculateUserTeamStats).mockResolvedValue({ points: 50, goals: 3 });
        // Mock the captain's points (doubled by default)
        vi.mocked(fetchPlayerPointsByGameweek).mockResolvedValue(10);
        // Mock multiple power-ups
        vi.mocked(retrieveFantasyLeagueMembershipPowerUpsByLeagueIdAndUserId).mockResolvedValue([
            {
                id: 'membership-powerup-1',
                fantasyLeagueMembershipId: 'membership-1',
                powerUpId: 'powerup-1',
                isBurnt: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                powerUp: {
                    id: 'powerup-1',
                    name: 'Double Points',
                    description: 'Double your points for one gameweek',
                    price: '10',
                    tokenId: '1',
                    contractAddress: '0x1234567890123456789012345678901234567890',
                    metadataUri: 'https://example.com/metadata/1',
                    imageUrl: 'https://example.com/images/1.png',
                    isActive: true,
                    isFeatured: true,
                    categoryId: null,
                    category: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            },
            {
                id: 'membership-powerup-2',
                fantasyLeagueMembershipId: 'membership-1',
                powerUpId: 'powerup-2',
                isBurnt: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                powerUp: {
                    id: 'powerup-2',
                    name: 'Triple Captain',
                    description: "Captain's points are tripled instead of doubled.",
                    price: '15',
                    tokenId: '2',
                    contractAddress: '0x1234567890123456789012345678901234567890',
                    metadataUri: 'https://example.com/metadata/2',
                    imageUrl: 'https://example.com/images/2.png',
                    isActive: true,
                    isFeatured: false,
                    categoryId: null,
                    category: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        ]);
        const result = yield calculateUserTotalPointsWithPowerUps('user123', 'league456', 1);
        expect(result).toEqual({
            points: 110, // 50 (base) + 50 (double points) + 10 (triple captain)
            goals: 3,
            basePoints: 50,
            powerUpBonuses: [
                { name: 'Double Points', bonus: 50 },
                { name: 'Triple Captain', bonus: 10 }
            ],
            powerUpBonus: 60
        });
    }));
});
