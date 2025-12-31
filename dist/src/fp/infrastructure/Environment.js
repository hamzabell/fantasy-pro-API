var _a;
import { createWalletRepository } from '../../features/wallet/wallet.repository.js';
import { createWalletService } from '../../features/wallet/wallet.service.js';
import { createBlockchainService } from '../../infrastructure/blockchain/blockchain.service.js';
import { createPaymentService } from '../../infrastructure/payment/payment.service.js';
import { createPublicLeagueService } from '../../features/fantasy-leagues/public-league-service.js';
// Constructor for creating the environment (called at app startup)
export const createEnvironment = (prisma, logger, config) => {
    const walletRepo = createWalletRepository(prisma);
    // User provided Alchemy Key: 
    const alchemyKey = process.env.ALCHEMY_API_KEY;
    const networkName = process.env.NETWORK_NAME;
    const alchemyRpcUrl = `https://${networkName}.g.alchemy.com/v2/${alchemyKey}`;
    const alchemyWsUrl = `wss://${networkName}.g.alchemy.com/v2/${alchemyKey}`;
    const rpcEndpoint = process.env.POLYGON_RPC_ENDPOINT || alchemyRpcUrl;
    const blockchainService = createBlockchainService(rpcEndpoint, process.env.LEAGUE_CONTRACT_ADDRESS || '0x0', process.env.SERVER_PRIVATE_KEY || '');
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
};
