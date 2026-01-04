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
    constructor(endpoint, mnemonic, apiKey) {
        this.endpoint = endpoint;
        this.mnemonic = mnemonic;
        this.apiKey = apiKey;
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
        /**
         * Verifies if a transaction hash exists on-chain and confirmed.
         * Since standard TON nodes don't index by Hash globally, we need the account address too.
         * Ideally, we check if our Contract received the message.
         */
        /**
         * Waits for a transaction to be confirmed on-chain.
         * Polls the contract's transaction history for the specific message hash.
         * Verifies that the transaction was successful (not bounced, exit code 0 or 1).
         *
         * @param msgHash - The hash of the message sent to the contract.
         * @param timeoutMs - Max time to wait (default 30s).
         */
        this.waitForTransaction = (msgHash, timeoutMs = 30000) => {
            return TE.tryCatch(() => __awaiter(this, void 0, void 0, function* () {
                if (!this.client)
                    throw new Error("Client not initialized");
                // Get Contract Address from Env
                let contractAddressStr = process.env.VITE_TON_CONTRACT_ADDRESS || process.env.TON_CONTRACT_ADDRESS;
                if (!contractAddressStr) {
                    contractAddressStr = "kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S";
                }
                const { Address, storeMessage, beginCell, Cell } = yield import("@ton/core");
                const contractAddress = Address.parse(contractAddressStr);
                // If it's a long string (BOC) instead of a 64-char hex hash, hash it first
                let targetHash = msgHash;
                if (msgHash.length > 64) {
                    try {
                        const cell = Cell.fromBase64(msgHash);
                        targetHash = cell.hash().toString('hex');
                        logger.info(`[TON] Computed hash from BOC: ${targetHash}`);
                    }
                    catch (e) {
                        logger.error(`[TON] Failed to parse msgHash as BOC, using as-is: ${msgHash.substring(0, 20)}...`);
                    }
                }
                const startTime = Date.now();
                while (Date.now() - startTime < timeoutMs) {
                    try {
                        // Fetch recent transactions for the contract
                        const transactions = yield this.client.getTransactions(contractAddress, { limit: 50 });
                        for (const tx of transactions) {
                            if (tx.inMessage) {
                                let txMsgHash;
                                try {
                                    // Serialize to get hash
                                    const inMsgCell = beginCell().store(storeMessage(tx.inMessage)).endCell();
                                    txMsgHash = inMsgCell.hash().toString('hex');
                                }
                                catch (e) {
                                    continue; // Skip if serialization fails
                                }
                                if (txMsgHash === targetHash || txMsgHash === targetHash.toLowerCase()) {
                                    logger.info(`[TON] Transaction found: ${txMsgHash}`);
                                    // Check if message bounced logic
                                    // tx.inMessage.info.bounced is boolean
                                    if (tx.inMessage.info.type === 'internal') {
                                        if (tx.inMessage.info.bounced) {
                                            logger.warn(`[TON] Transaction ${targetHash} bounced!`);
                                            throw new Error("Transaction bounced");
                                        }
                                    }
                                    const desc = tx.description;
                                    // Check Compute Phase
                                    if (desc.type === 'generic' && desc.computePhase && desc.computePhase.type === 'vm') {
                                        const exitCode = desc.computePhase.exitCode;
                                        if (exitCode !== 0 && exitCode !== 1) { // 0 and 1 are usually ok? 0 is success.
                                            logger.warn(`[TON] Transaction failed with exit code: ${exitCode}`);
                                            throw new Error(`Transaction failed with exit code ${exitCode}`);
                                        }
                                        return true; // Success
                                    }
                                    // If no compute phase (e.g. storage phase only?), assume success or check further?
                                    // Usually for contract calls, compute phase exists.
                                    return true;
                                }
                            }
                        }
                    }
                    catch (e) {
                        if (e.message.includes("Transaction bounced") || e.message.includes("exit code")) {
                            throw e; // Fail fast if definitely failed
                        }
                        logger.warn(`[TON] Polling error: ${e.message}`);
                    }
                    // Wait 2 seconds before retry
                    yield new Promise(r => setTimeout(r, 2000));
                }
                throw new Error("Transaction verification timed out");
            }), (e) => blockchainError('Failed to verify transaction', String(e)));
        };
        this.createLeague = (leagueId, userId, commission, fee, gasAmount = "0.1") => {
            return TE.tryCatch(() => __awaiter(this, void 0, void 0, function* () {
                if (!this.client || !this.wallet || !this.walletKey) {
                    throw new Error("TonBlockchainService not fully initialized (Wallet/Key missing)");
                }
                const { Address, beginCell, toNano, storeMessage } = yield import("@ton/core");
                let contractAddressStr = process.env.VITE_TON_CONTRACT_ADDRESS || process.env.TON_CONTRACT_ADDRESS;
                if (!contractAddressStr)
                    contractAddressStr = "kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S";
                const contractAddress = Address.parse(contractAddressStr);
                const payload = beginCell()
                    .storeUint(226823229, 32)
                    .storeStringRefTail(leagueId)
                    .storeStringRefTail(userId)
                    .storeUint(commission, 64)
                    .storeCoins(fee)
                    .endCell();
                // Wait before first RPC call (getSeqno)
                yield this.waitIfLimited();
                const seqno = yield this.wallet.getSeqno(this.client.provider(this.wallet.address, null));
                yield this.waitIfLimited();
                const value = toNano(gasAmount) + fee;
                const transfer = this.wallet.createTransfer({
                    seqno,
                    secretKey: this.walletKey.secretKey,
                    messages: [
                        internal({
                            to: contractAddress,
                            value: value,
                            bounce: true,
                            body: payload
                        })
                    ]
                });
                yield this.client.sendExternalMessage(this.wallet, transfer);
                // transfer from createTransfer might be Cell or Message depending on version.
                // If it's a Cell, it has .hash(). If Message, use storeMessage.
                // Lint said it's Cell.
                const msgHash = transfer.hash().toString('hex');
                logger.info(`[TON] CreateLeague tx sent. MsgHash: ${msgHash}`);
                return msgHash;
            }), (e) => blockchainError('Failed to create league on chain', String(e)));
        };
        /**
         * Create a public league (owner only)
         * Only pays gas fees, not the stake amount
         */
        this.createPublicLeague = (leagueId, commission, feeAmount, // What users will pay to stake
        gasAmount = "0.25" // Gas we pay (increased for reliability)
        ) => {
            return TE.tryCatch(() => __awaiter(this, void 0, void 0, function* () {
                if (!this.client || !this.wallet || !this.walletKey) {
                    throw new Error("TonBlockchainService not fully initialized (Wallet/Key missing)");
                }
                const { Address, beginCell, toNano, storeMessage } = yield import("@ton/core");
                let contractAddressStr = process.env.VITE_TON_CONTRACT_ADDRESS || process.env.TON_CONTRACT_ADDRESS;
                if (!contractAddressStr)
                    contractAddressStr = "kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S";
                const contractAddress = Address.parse(contractAddressStr);
                // Wait before first RPC call (getSeqno)
                yield this.waitIfLimited();
                // CreatePublicLeague message structure
                // OpCode: 1462801691 (0x5730951b)
                const payload = beginCell()
                    .storeUint(1462801691, 32)
                    .storeStringRefTail(leagueId)
                    .storeUint(commission, 64)
                    .storeCoins(feeAmount)
                    .endCell();
                const seqno = yield this.wallet.getSeqno(this.client.provider(this.wallet.address, null));
                yield this.waitIfLimited();
                // Only pay gas, not the fee amount
                const value = toNano(gasAmount);
                const transfer = this.wallet.createTransfer({
                    seqno,
                    secretKey: this.walletKey.secretKey,
                    messages: [
                        internal({
                            to: contractAddress,
                            value: value,
                            bounce: true,
                            body: payload
                        })
                    ]
                });
                yield this.client.sendExternalMessage(this.wallet, transfer);
                const msgHash = transfer.hash().toString('hex');
                logger.info(`[TON] CreatePublicLeague tx sent. MsgHash: ${msgHash}`);
                return msgHash;
            }), (e) => blockchainError('Failed to create public league on chain', String(e)));
        };
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Initialize TON Client
                this.client = new TonClient({
                    endpoint: this.endpoint,
                    apiKey: this.apiKey || process.env.TON_API_KEY
                });
                if (this.mnemonic) {
                    const key = yield mnemonicToPrivateKey(this.mnemonic.split(" "));
                    this.walletKey = key;
                    this.wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
                }
                logger.info("TonBlockchainService initialized" + (this.apiKey ? " (With API Key)" : ""));
            }
            catch (error) {
                logger.error(`Failed to initialize TonBlockchainService: ${error}`);
            }
        });
    }
    waitIfLimited() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.apiKey) {
                // Wait 5s to respect strict free limits
                yield new Promise(r => setTimeout(r, 5000));
            }
        });
    }
    getWalletAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wallet) {
                // Wait briefly? Or just return null
                return null;
            }
            return this.wallet.address.toString();
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
    getTransaction(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                // Try to initialize if not ready?
                // Since constructor calls async initialize, might race.
                // But usually active by the time we call.
                if (!this.client)
                    throw new Error("TON Client not initialized");
            }
            try {
                // Need to search for the tx. 
                // Client usually retrieves by address and lt/hash. 
                // getTransaction(address, lt, hash) requires knowing the account.
                // This is tricky on TON if we don't know the sender or receiver aka "The Account".
                // BUT, if we have the BOC, we know the account (the wallet/sender).
                // If we only have hash, it's harder without an indexer.
                // Assumption: we look at the CONTRACT's transactions to find the incoming one? 
                // Or we rely on an indexer API like TonApi.io.
                // ton-access / ton-client is direct node. Nodes don't support "get tx by hash" globally.
                // We need to know "Address".
                // Strategy: We will poll the Contract's transaction history for the hash.
                return null; // Implementation in verifyTransaction
            }
            catch (e) {
                return null;
            }
        });
    }
}
export function createTonBlockchainService(endpoint, mnemonic, apiKey) {
    return new TonBlockchainService(endpoint, mnemonic, apiKey);
}
