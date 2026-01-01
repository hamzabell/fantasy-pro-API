var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { createLogger } from "../../fp/infrastructure/Logger.js";
import * as TE from 'fp-ts/lib/TaskEither.js';
import { blockchainError } from '../../fp/domain/errors/AppError.js';
const logger = createLogger('TonBlockchainService');
export class TonBlockchainService {
    constructor(endpoint, mnemonic) {
        this.endpoint = endpoint;
        this.mnemonic = mnemonic;
        this.client = null;
        this.wallet = null;
        this.walletKey = null; // KeyPair
        this.payoutWinners = (leagueId, winners, percentages, commissionPercentage) => {
            return TE.tryCatch(() => __awaiter(this, void 0, void 0, function* () {
                // TODO: Implement actual contract call for payout
                // For now, returning a mock hash to satify the interface and allow seeding to proceed
                logger.info(`[TON] Payout winners for league ${leagueId}. Winners: ${winners.length}, Comm: ${commissionPercentage}%`);
                if (!this.client || !this.wallet) {
                    logger.warn("TON Client or Wallet not initialized for payout (mocking logic)");
                    // return "mock_tx_hash"; 
                }
                // In a real implementation:
                // 1. Create a transfer message to the contract with the 'Payout' opcode
                // 2. Sign and send
                return `ton_tx_${Date.now()}`;
            }), (e) => blockchainError('Failed to payout winners on TON', String(e)));
        };
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Initialize TON Client
                // For mainnet: https://toncenter.com/api/v2/jsonRPC
                // For testnet: https://testnet.toncenter.com/api/v2/jsonRPC
                this.client = new TonClient({
                    endpoint: this.endpoint,
                    // apiKey: 'YOUR_API_KEY' // Optional if using basic access
                });
                if (this.mnemonic) {
                    const key = yield mnemonicToPrivateKey(this.mnemonic.split(" "));
                    this.walletKey = key;
                    this.wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
                }
                logger.info("TonBlockchainService initialized");
            }
            catch (error) {
                logger.error(`Failed to initialize TonBlockchainService: ${error}`);
            }
        });
    }
    getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error("TON Client not initialized");
            try {
                const balance = yield this.client.getBalance(address);
                // Note: address needs to be parsed if not string compatible, 
                // but client.getBalance usually takes Address object. 
                // We might need strict parsing if using @ton/core Address.parse(address)
                // For simplicity in this scaffold, passing as is or assume Address type is handled by caller or wrapper.
                // Let's refine to be type safe:
                const { Address } = yield import("@ton/core");
                const addr = Address.parse(address);
                const bal = yield this.client.getBalance(addr);
                return bal.toString();
            }
            catch (error) {
                logger.error(`Error getting balance for ${address}: ${error}`);
                throw error;
            }
        });
    }
}
export function createTonBlockchainService(endpoint, mnemonic) {
    return new TonBlockchainService(endpoint, mnemonic);
}
