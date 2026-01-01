var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testClient } from 'hono/testing';
import tonWebhookApp from './ton-webhook-route.js';
import * as fantasyLeaguesModel from '../fantasy-leagues/fantasy-leagues-model.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';
// Mock the model functions
vi.mock('../fantasy-leagues/fantasy-leagues-model.js', () => ({
    updateFantasyLeagueInDatabaseById: vi.fn(),
    updateFantasyLeagueMembershipInDatabaseById: vi.fn(),
    retrieveFantasyLeagueMembershipByLeagueAndUser: vi.fn(),
    retrieveUserByWalletAddress: vi.fn(),
    finalizeLeagueMemberships: vi.fn()
}));
// Mock rollbar
vi.mock('../../fp/infrastructure/Rollbar.js', () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn()
    }
}));
// Mock logger
vi.mock('../../fp/infrastructure/Logger.js', () => ({
    createLogger: () => ({
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn()
    })
}));
describe('TON Webhook', () => {
    const client = testClient(tonWebhookApp);
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should handle LeagueCreated event', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            event_name: 'LeagueCreated',
            data: {
                leagueId: 'league_123',
                userId: 'user_1',
                feePaid: true
            },
            tx_hash: 'tx_league_created'
        };
        const response = yield client.index.$post({
            json: payload
        });
        expect(response.status).toBe(200);
        expect(fantasyLeaguesModel.updateFantasyLeagueInDatabaseById).toHaveBeenCalledWith({
            id: 'league_123',
            league: {
                status: 'open',
                blockchainTxHash: 'tx_league_created'
            }
        });
    }));
    it('should handle StakeEvent', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock membership finding
        vi.mocked(fantasyLeaguesModel.retrieveFantasyLeagueMembershipByLeagueAndUser).mockResolvedValue({
            id: 'membership_123'
        });
        const payload = {
            event_name: 'StakeEvent',
            data: {
                leagueId: 'league_123',
                userId: 'user_2',
                amount: '1000'
            },
            tx_hash: 'tx_stake'
        };
        const response = yield client.index.$post({
            json: payload
        });
        expect(response.status).toBe(200);
        expect(fantasyLeaguesModel.retrieveFantasyLeagueMembershipByLeagueAndUser).toHaveBeenCalledWith('league_123', 'user_2');
        expect(fantasyLeaguesModel.updateFantasyLeagueMembershipInDatabaseById).toHaveBeenCalledWith({
            id: 'membership_123',
            membership: {
                status: 'active',
                blockchainTxHash: 'tx_stake',
                stakeAmount: expect.any(Decimal)
            }
        });
    }));
    it('should handle PayoutEvent', () => __awaiter(void 0, void 0, void 0, function* () {
        vi.mocked(fantasyLeaguesModel.retrieveUserByWalletAddress).mockResolvedValue({
            id: 'winner_user_id'
        });
        vi.mocked(fantasyLeaguesModel.retrieveFantasyLeagueMembershipByLeagueAndUser).mockResolvedValue({
            id: 'winner_membership_id'
        });
        const payload = {
            event_name: 'PayoutEvent',
            data: {
                leagueId: 'league_123',
                winner: 'EQ_WINNER_ADDR',
                amount: '5000'
            },
            tx_hash: 'tx_payout'
        };
        const response = yield client.index.$post({
            json: payload
        });
        expect(response.status).toBe(200);
        expect(fantasyLeaguesModel.retrieveUserByWalletAddress).toHaveBeenCalledWith('EQ_WINNER_ADDR');
        expect(fantasyLeaguesModel.retrieveFantasyLeagueMembershipByLeagueAndUser).toHaveBeenCalledWith('league_123', 'winner_user_id');
        expect(fantasyLeaguesModel.updateFantasyLeagueMembershipInDatabaseById).toHaveBeenCalledWith({
            id: 'winner_membership_id',
            membership: {
                status: 'won',
                payoutAmount: expect.any(Decimal),
                blockchainTxHash: 'tx_payout',
                payoutStatus: 'completed'
            }
        });
    }));
    it('should handle PayoutCompletedEvent', () => __awaiter(void 0, void 0, void 0, function* () {
        vi.mocked(fantasyLeaguesModel.finalizeLeagueMemberships).mockResolvedValue({ count: 5 });
        const payload = {
            event_name: 'PayoutCompletedEvent',
            data: {
                leagueId: 'league_123'
            },
            tx_hash: 'tx_completed'
        };
        const response = yield client.index.$post({
            json: payload
        });
        expect(response.status).toBe(200);
        expect(fantasyLeaguesModel.updateFantasyLeagueInDatabaseById).toHaveBeenCalledWith({
            id: 'league_123',
            league: {
                status: 'completed',
                blockchainTxHash: 'tx_completed'
            }
        });
        expect(fantasyLeaguesModel.finalizeLeagueMemberships).toHaveBeenCalledWith('league_123');
    }));
});
