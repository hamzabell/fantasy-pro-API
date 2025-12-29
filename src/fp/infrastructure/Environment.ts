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
}

// Application configuration
export interface AppConfig {
	budgetLimit: number
	minPlayers: number
	maxPlayers: number
	webhookApiToken: string
	tonNetwork: 'mainnet' | 'testnet'
}

// Constructor for creating the environment (called at app startup)
export const createEnvironment = (
	prisma: PrismaClient,
	logger: Logger,
	config: AppConfig
): AppEnvironment => {
	const walletRepo = createWalletRepository(prisma)
	
	// TODO: Move these to config/env vars
	const blockchainService = createBlockchainService(
		process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC',
		process.env.TON_API_KEY || '',
		process.env.LEAGUE_ESCROW_ADDRESS || '', // Keeper/Escrow Address
        process.env.SERVER_MNEMONIC || ''
	)

	const walletService = createWalletService(walletRepo, blockchainService)
	const paymentService = createPaymentService()
	const publicLeagueService = createPublicLeagueService(prisma, walletService)

	return {
		prisma,
		logger,
		config,
		walletRepo,
		walletService,
		blockchainService,
		paymentService,
		publicLeagueService
	}
}

// Default configuration from environment variables
export const defaultConfig: AppConfig = {
	budgetLimit: 40,
	minPlayers: 5,
	maxPlayers: 5,
	webhookApiToken: process.env.WEBHOOK_API_TOKEN ?? '',
	tonNetwork: (process.env.TON_NETWORK as 'mainnet' | 'testnet') ?? 'testnet'
}
