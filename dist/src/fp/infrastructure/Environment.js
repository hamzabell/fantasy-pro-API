var _a, _b;
import { createWalletRepository } from '../../features/wallet/wallet.repository.js';
import { createWalletService } from '../../features/wallet/wallet.service.js';
import { createBlockchainService } from '../../infrastructure/blockchain/blockchain.service.js';
import { createPaymentService } from '../../infrastructure/payment/payment.service.js';
import { createPublicLeagueService } from '../../features/fantasy-leagues/public-league-service.js';
// Constructor for creating the environment (called at app startup)
export const createEnvironment = (prisma, logger, config) => {
    const walletRepo = createWalletRepository(prisma);
    // TODO: Move these to config/env vars
    const blockchainService = createBlockchainService(process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC', process.env.TON_API_KEY || '', process.env.LEAGUE_ESCROW_ADDRESS || '', // Keeper/Escrow Address
    process.env.SERVER_MNEMONIC || '');
    const walletService = createWalletService(walletRepo, blockchainService);
    const paymentService = createPaymentService();
    const publicLeagueService = createPublicLeagueService(prisma, walletService);
    return {
        prisma,
        logger,
        config,
        walletRepo,
        walletService,
        blockchainService,
        paymentService,
        publicLeagueService
    };
};
// Default configuration from environment variables
export const defaultConfig = {
    budgetLimit: 40,
    minPlayers: 5,
    maxPlayers: 5,
    webhookApiToken: (_a = process.env.WEBHOOK_API_TOKEN) !== null && _a !== void 0 ? _a : '',
    tonNetwork: (_b = process.env.TON_NETWORK) !== null && _b !== void 0 ? _b : 'testnet'
};
