
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createBlockchainService } from './blockchain.service.js';
import * as models from '../../features/fantasy-leagues/fantasy-leagues-model.js';
import { ethers } from 'ethers';

// Mock models
vi.mock('../../features/fantasy-leagues/fantasy-leagues-model.js', () => ({
    updateFantasyLeagueInDatabaseById: vi.fn(),
    updateFantasyLeagueMembershipInDatabaseById: vi.fn(),
    retrieveFantasyLeagueMembershipByLeagueAndUser: vi.fn(),
    retrieveFantasyLeagueFromDatabaseById: vi.fn()
}));

// Mock ethers
const mockOn = vi.fn();
const mockContract = {
    on: mockOn,
    // Helper to simulate event emission
    emitEvent: async (eventName: string, ...args: any[]) => {
        // Find the callback for this event
        const call = mockOn.mock.calls.find(call => call[0] === eventName);
        if (call && call[1]) {
            await call[1](...args, {}); // Execute callback
        }
    },
    payoutWinners: vi.fn().mockResolvedValue({ wait: vi.fn() })
};

vi.mock('ethers', async () => {
    return {
        ethers: {
            JsonRpcProvider: vi.fn(),
            Wallet: vi.fn(),
            Contract: vi.fn(() => mockContract),
            parseEther: (val: string) => BigInt(val) * BigInt(1e18) // Simple mock
        }
    };
});

describe('Blockchain Listener E2E', () => {
    const service = createBlockchainService('http://mock-rpc', '', '0xAddress', '0xKey');

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('given LeagueCreated event happens: it should update league status to open', async () => {
        service.listenForEvents();

        expect(mockOn).toHaveBeenCalledWith('LeagueCreated', expect.any(Function));
        
        // Emit event
        const leagueId = 'league_1';
        const userId = 'user_1';
        await mockContract.emitEvent('LeagueCreated', leagueId, userId, 500, '0xCreator', 0);

        expect(models.updateFantasyLeagueInDatabaseById).toHaveBeenCalledWith({
            id: leagueId,
            league: { status: 'open', ownerId: userId }
        });
    });

    it('given Stake event happens: it should update membership status to active', async () => {
        // Setup mock return
        const mockMembership = { id: 'mem_1', userId: 'user_1', leagueId: 'league_1' };
        vi.mocked(models.retrieveFantasyLeagueMembershipByLeagueAndUser).mockResolvedValue(mockMembership as any);

        service.listenForEvents();

        const leagueId = 'league_1';
        const userId = 'user_1';
        const amount = BigInt(100);
        
        await mockContract.emitEvent('Stake', '0xUser', amount, userId, leagueId);

        expect(models.retrieveFantasyLeagueMembershipByLeagueAndUser).toHaveBeenCalledWith(leagueId, userId);
        expect(models.updateFantasyLeagueMembershipInDatabaseById).toHaveBeenCalledWith({
            id: 'mem_1',
            membership: { status: 'active' }
        });
    });

    it('given PayoutCompleted event happens: it should update league status to completed', async () => {
        service.listenForEvents();

        const leagueId = 'league_1';
        await mockContract.emitEvent('PayoutCompleted', leagueId, BigInt(1000), BigInt(100));

        expect(models.updateFantasyLeagueInDatabaseById).toHaveBeenCalledWith({
            id: leagueId,
            league: { status: 'completed' }
        });
    });
});
