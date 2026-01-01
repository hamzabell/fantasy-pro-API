import { describe, test, expect, vi, beforeAll } from 'vitest';
import app from '../../index.js';
import { Prisma } from '../../generated/prisma/index.js';
import prisma from '../../prisma.js';
import { createAuthHeaders } from '../../utils/testUtils.js';
import { 
    saveUserToDatabase, 
    deleteUserFromDatabaseById 
} from '../users/users-model.js';
import { createPopulatedUser } from '../users/users-factories.js';
import { 
    saveFantasyLeagueToDatabase, 
    deleteFantasyLeagueFromDatabaseById 
} from './fantasy-leagues-model.js';
import { createPopulatedFantasyLeague } from './fantasy-leagues-factories.js';
import { mockSupabaseAuthSuccess } from '../../utils/supabaseMocks.js';
import { supabase } from '../supabase/supabase-helpers.js';
import { createMockUser } from '../../utils/supabaseMocks-factories.js';

// Mocks must be defined before imports that use them
const mocks = vi.hoisted(() => ({
    getUserWallet: vi.fn(),
    payoutWinners: vi.fn(),
}));

vi.mock('../wallet/wallet.service.js', () => ({
    createWalletService: () => ({
        getUserWallet: mocks.getUserWallet,
        getWalletBalance: vi.fn().mockReturnValue({ _tag: 'Right', right: '1000' }),
        createWalletForUser: vi.fn().mockReturnValue({ _tag: 'Right', right: { address: '0xMock', encryptedPrivateKey: 'mockKey' } }),
    })
}));

vi.mock('../../infrastructure/blockchain/blockchain.service.js', () => ({
    createBlockchainService: () => ({
        payoutWinners: mocks.payoutWinners
    })
}));

vi.mock('../fantasy-premier-league/fantasy-premier-league-api.js');

vi.mock('../wallet/encryption.js', () => ({
    decrypt: vi.fn().mockResolvedValue('mock-private-key'),
    encrypt: vi.fn().mockReturnValue('mock-encrypted-key')
}));

describe("Fantasy Leagues Membership Status", () => {
    beforeAll(async () => {
        process.env.PLATFORM_WALLET_ADDRESS = '0xPlatformWallet';
    });

    test('given an authenticated user requests leagues: it should return membershipStatus for leagues they have joined', async () => {
        // setup
        const user = createPopulatedUser();
        const savedUser = await saveUserToDatabase(user);

        // Create a league
        const league = createPopulatedFantasyLeague({
            ownerId: savedUser.id,
            leagueType: 'public',
            status: 'open'
        });
        const savedLeague = await saveFantasyLeagueToDatabase(league);

        // Add user as pending member (simulating join without payment confirm)
        await prisma.fantasyLeagueMembership.create({
            data: {
                userId: savedUser.id,
                leagueId: savedLeague.id,
                status: 'pending',
                teamName: 'Pending Team'
            }
        });

        // mock supabase Auth
        const mockSupabase = mockSupabaseAuthSuccess(createMockUser(savedUser));
        vi.spyOn(supabase.auth, 'getUser').mockImplementation(() => mockSupabase.auth.getUser());

        // Request with isMember=true to get my leagues
        const response = await app.request('/api/fantasy-leagues?isMember=true', {
            method: 'GET',
            ...createAuthHeaders(savedUser.id)
        });

        expect(response.status).toBe(200);

        const actual = await response.json();
        const myLeague = actual.leagues.find((l: any) => l.id === savedLeague.id);

        expect(myLeague).toBeDefined();
        expect(myLeague.membershipStatus).toBe('pending');

        // clean up
        await deleteFantasyLeagueFromDatabaseById(savedLeague.id);
        await deleteUserFromDatabaseById(savedUser.id);
    });
});
