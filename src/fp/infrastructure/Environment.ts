import type { PrismaClient } from '../../generated/prisma/index.js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Logger } from './Logger.js'

// The environment that all ReaderTaskEither functions depend on
export interface AppEnvironment {
	prisma: PrismaClient
	supabase: SupabaseClient
	logger: Logger
	config: AppConfig
}

// Application configuration
export interface AppConfig {
	budgetLimit: number
	minPlayers: number
	maxPlayers: number
	webhookApiToken: string
	polygonNetwork: 'mainnet' | 'mumbai'
}

// Constructor for creating the environment (called at app startup)
export const createEnvironment = (
	prisma: PrismaClient,
	supabase: SupabaseClient,
	logger: Logger,
	config: AppConfig
): AppEnvironment => ({
	prisma,
	supabase,
	logger,
	config
})

// Default configuration from environment variables
export const defaultConfig: AppConfig = {
	budgetLimit: 100,
	minPlayers: 11,
	maxPlayers: 11,
	webhookApiToken: process.env.WEBHOOK_API_TOKEN ?? '',
	polygonNetwork: (process.env.POLYGON_NETWORK as 'mainnet' | 'mumbai') ?? 'mumbai'
}
