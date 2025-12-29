var _a, _b;
import { createWalletRepository } from '../../features/wallet/wallet.repository.js';
import { createWalletService } from '../../features/wallet/wallet.service.js';
import { createBlockchainService } from '../../infrastructure/blockchain/blockchain.service.js';
import { createPaymentService } from '../../infrastructure/payment/payment.service.js';
// Constructor for creating the environment (called at app startup)
export const createEnvironment = (prisma, logger, config) => {
    const walletRepo = createWalletRepository(prisma);
    // TODO: Move these to config/env vars
    const blockchainService = createBlockchainService(process.env.POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com', process.env.USDC_ADDRESS || '0x0', process.env.ESCROW_ADDRESS || '0x0');
    const walletService = createWalletService(walletRepo, blockchainService);
    const paymentService = createPaymentService();
    return {
        prisma,
        logger,
        config,
        walletRepo,
        walletService,
        blockchainService,
        paymentService
    };
};
// Default configuration from environment variables
export const defaultConfig = {
    budgetLimit: 100,
    minPlayers: 5,
    maxPlayers: 5,
    webhookApiToken: (_a = process.env.WEBHOOK_API_TOKEN) !== null && _a !== void 0 ? _a : '',
    polygonNetwork: (_b = process.env.POLYGON_NETWORK) !== null && _b !== void 0 ? _b : 'mumbai'
};
