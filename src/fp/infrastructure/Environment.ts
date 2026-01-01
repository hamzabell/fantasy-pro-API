import type { PrismaClient } from '../../generated/prisma/index.js'
import type { Logger } from './Logger.js'
import type { WalletRepository } from '../../features/wallet/wallet.repository.js'
import { createWalletRepository } from '../../features/wallet/wallet.repository.js'
import type { WalletService } from '../../features/wallet/wallet.service.js'
import { createWalletService } from '../../features/wallet/wallet.service.js'
import type { BlockchainService } from '../../infrastructure/blockchain/blockchain.service.js'
import { createBlockchainService } from '../../infrastructure/blockchain/blockchain.service.js'
import type { PaymentService } from '../../infrastructure/payment/payment.service.js'
import { createPaymentService } from '../../infrastructure/payment/payment.service.js'
import type { PublicLeagueService } from '../../features/fantasy-leagues/public-league-service.js'
import { createPublicLeagueService } from '../../features/fantasy-leagues/public-league-service.js'

import { TonClient } from '@ton/ton'

// The environment that all ReaderTaskEither functions depend on
export interface AppEnvironment {
	prisma: PrismaClient
	logger: Logger
	config: AppConfig
	walletRepo: WalletRepository
	walletService: WalletService
	blockchainService: BlockchainService
	paymentService: PaymentService
	publicLeagueService: PublicLeagueService
	tonClient: TonClient
}

// Application configuration
export interface AppConfig {
	budgetLimit: number
	minPlayers: number
	maxPlayers: number
	webhookApiToken: string
}

// Constructor for creating the environment (called at app startup)
export const createEnvironment = (
	prisma: PrismaClient,
	logger: Logger,
	config: AppConfig
): AppEnvironment => {
	const walletRepo = createWalletRepository(prisma)
	
	// User provided Alchemy Key: 
	const alchemyKey = process.env.ALCHEMY_API_KEY;
	const networkName = process.env.NETWORK_NAME 
	;
	
	const alchemyRpcUrl = `https://${networkName}.g.alchemy.com/v2/${alchemyKey}`;
	const alchemyWsUrl = `wss://${networkName}.g.alchemy.com/v2/${alchemyKey}`;

	const rpcEndpoint = process.env.POLYGON_RPC_ENDPOINT || alchemyRpcUrl;

	const blockchainService = createBlockchainService(
		rpcEndpoint,
		process.env.LEAGUE_CONTRACT_ADDRESS || '0x0',
        process.env.SERVER_PRIVATE_KEY || ''
	)

	const walletService = createWalletService(walletRepo, blockchainService)
	const paymentService = createPaymentService()
	const publicLeagueService = createPublicLeagueService(prisma, walletService)

	const tonEndpoint = process.env.TON_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC';
	const tonApiKey = process.env.TON_API_KEY;

	const tonClient = new TonClient({
		endpoint: tonEndpoint,
		apiKey: tonApiKey
	});

	return {
		prisma,
		logger,
		config,
		walletRepo,
		walletService,
		blockchainService,
		paymentService,
		publicLeagueService,
		tonClient
	}
}

// Default configuration from environment variables
export const defaultConfig: AppConfig = {
	budgetLimit: 40,
	minPlayers: 5,
	maxPlayers: 5,
	webhookApiToken: process.env.WEBHOOK_API_TOKEN ?? '',
}
