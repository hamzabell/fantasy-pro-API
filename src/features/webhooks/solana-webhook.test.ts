import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testClient } from 'hono/testing';
import solanaWebhookApp from './solana-webhook-route.js';
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

// Mock Anchor to control decoding
vi.mock('@coral-xyz/anchor', () => {
    return {
        BorshCoder: vi.fn().mockImplementation(() => ({
            events: {
                decode: vi.fn((data) => {
                    if (data === 'LEAGUE_CREATED_DATA') {
                        return { 
                            name: 'LeagueCreated', 
                            data: { leagueId: 'league_123', userId: 'user_1', feePaid: true } 
                        };
                    }
                    if (data === 'STAKE_EVENT_DATA') {
                        return { 
                            name: 'StakeEvent', 
                            data: { leagueId: 'league_123', userId: 'user_2', amount: '1000' } // BN is mocked as string/number usually, assuming toString() works
                        };
                    }
                    if (data === 'PAYOUT_EVENT_DATA') {
                         return {
                             name: 'PayoutEvent',
                             data: { leagueId: 'league_123', winner: 'WALLET_ADDR', amount: '5000' }
                         };
                    }
                    if (data === 'PAYOUT_COMPLETED_DATA') {
                        return {
                            name: 'PayoutCompletedEvent',
                            data: { leagueId: 'league_123' }
                        };
                    }
                    return null;
                })
            }
        }))
    };
});

// Mock logger to avoid clutter
vi.mock('../../fp/infrastructure/Logger.js', () => ({
    createLogger: () => ({
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn()
    })
}));

describe('Solana Webhook', () => {
    const client = testClient(solanaWebhookApp);

    beforeEach(() => {
        vi.clearAllMocks();
    });


    it('should handle LeagueCreated event', async () => {
        const payload = [{
            txHash: 'sig_league_created',
            blockTime: 123456789,
            logs: [
                'Program data: LEAGUE_CREATED_DATA'
            ]
        }];

        const response = await client.index.$post({
            json: payload
        });

        expect(response.status).toBe(200);
        expect(fantasyLeaguesModel.updateFantasyLeagueInDatabaseById).toHaveBeenCalledWith({
            id: 'league_123',
            league: {
                status: 'open',
                blockchainTxHash: 'sig_league_created'
            }
        });
    });

    it('should handle StakeEvent', async () => {
        // Mock membership finding
        vi.mocked(fantasyLeaguesModel.retrieveFantasyLeagueMembershipByLeagueAndUser).mockResolvedValue({
            id: 'membership_123'
        } as any);

        const payload = [{
            txHash: 'sig_stake',
            logs: [
                'Program data: STAKE_EVENT_DATA'
            ]
        }];

        const response = await client.index.$post({
            json: payload
        });

        expect(response.status).toBe(200);
        expect(fantasyLeaguesModel.retrieveFantasyLeagueMembershipByLeagueAndUser).toHaveBeenCalledWith('league_123', 'user_2');
        expect(fantasyLeaguesModel.updateFantasyLeagueMembershipInDatabaseById).toHaveBeenCalledWith({
            id: 'membership_123',
            membership: {
                status: 'active',
                blockchainTxHash: 'sig_stake',
                stakeAmount: expect.any(Decimal)
            }
        });
    });

    it('should handle PayoutEvent', async () => {
         vi.mocked(fantasyLeaguesModel.retrieveUserByWalletAddress).mockResolvedValue({
             id: 'winner_user_id'
         } as any);
         
         vi.mocked(fantasyLeaguesModel.retrieveFantasyLeagueMembershipByLeagueAndUser).mockResolvedValue({
             id: 'winner_membership_id'
         } as any);

         const payload = [{
            txHash: 'sig_payout',
            logs: [
                'Program data: PAYOUT_EVENT_DATA'
            ]
        }];

        const response = await client.index.$post({
            json: payload
        });

        expect(response.status).toBe(200);
        expect(fantasyLeaguesModel.retrieveUserByWalletAddress).toHaveBeenCalledWith('WALLET_ADDR');
        expect(fantasyLeaguesModel.retrieveFantasyLeagueMembershipByLeagueAndUser).toHaveBeenCalledWith('league_123', 'winner_user_id');
        expect(fantasyLeaguesModel.updateFantasyLeagueMembershipInDatabaseById).toHaveBeenCalledWith({
            id: 'winner_membership_id',
            membership: {
                status: 'won',
                payoutAmount: expect.any(Decimal),
                blockchainTxHash: 'sig_payout',
                payoutStatus: 'completed'
            }
        });
    });

    it('should handle PayoutCompletedEvent', async () => {
        vi.mocked(fantasyLeaguesModel.finalizeLeagueMemberships).mockResolvedValue({ count: 5 });

        const payload = [{
            txHash: 'sig_completed',
            logs: [
                'Program data: PAYOUT_COMPLETED_DATA'
            ]
        }];

        const response = await client.index.$post({
            json: payload
        });

        expect(response.status).toBe(200);
        expect(fantasyLeaguesModel.updateFantasyLeagueInDatabaseById).toHaveBeenCalledWith({
            id: 'league_123',
            league: {
                status: 'completed',
                blockchainTxHash: 'sig_completed'
            }
        });
        expect(fantasyLeaguesModel.finalizeLeagueMemberships).toHaveBeenCalledWith('league_123');
    });
});
