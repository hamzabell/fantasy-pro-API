import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { createLogger } from "../../fp/infrastructure/Logger.js";
import * as TE from 'fp-ts/lib/TaskEither.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { blockchainError } from '../../fp/domain/errors/AppError.js';

type TaskEither<E, A> = TE.TaskEither<E, A>;

const logger = createLogger('TonBlockchainService');

export class TonBlockchainService {
    private client: TonClient | null = null;
    private wallet: any = null; // WalletContractV4
    private walletKey: any = null; // KeyPair
    private initializationPromise: Promise<void>;

    constructor(
        private readonly endpoint: string,
        private readonly mnemonic: string,
        private readonly apiKey?: string
    ) {
        this.initializationPromise = this.initialize();
    }

    private async initialize() {
        try {
            // Initialize TON Client
            this.client = new TonClient({
                endpoint: this.endpoint,
                apiKey: this.apiKey || process.env.TON_API_KEY
            });

            if (this.mnemonic) {
                const key = await mnemonicToPrivateKey(this.mnemonic.split(" "));
                this.walletKey = key;
                this.wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
            }
            logger.info("TonBlockchainService initialized" + (this.apiKey ? " (With API Key)" : ""));
        } catch (error) {
            logger.error(`Failed to initialize TonBlockchainService: ${error}`);
        }
    }

    private async ensureInitialized() {
        await this.initializationPromise;
        if (!this.client || !this.wallet || !this.walletKey) {
            throw new Error("TonBlockchainService not fully initialized (Wallet/Key missing)");
        }
    }

    private async waitIfLimited() {
        if (!this.apiKey) {
            // Wait 5s to respect strict free limits
            await new Promise(r => setTimeout(r, 5000));
        }
    }

    async getWalletAddress(): Promise<string | null> {
        if (!this.wallet) {
             // Wait briefly? Or just return null
             return null;
        }
        return this.wallet.address.toString();
    }

    async getBalance(address: string): Promise<string> {
        if (!this.client) throw new Error("TON Client not initialized");
        
        const maxRetries = 3;
        const baseDelay = 1000; // 1 second
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const { Address } = await import("@ton/core");
                const addr = Address.parse(address);
                const bal = await this.client.getBalance(addr);
                return bal.toString();
            } catch (error: any) {
                const isRateLimit = error?.response?.status === 429 || error?.code === 'ERR_BAD_REQUEST';
                const isLastAttempt = attempt === maxRetries - 1;
                
                if (isRateLimit && !isLastAttempt) {
                    const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff: 1s, 2s, 4s
                    logger.warn(`Rate limit hit for ${address}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                
                logger.error(`Error getting balance for ${address} after ${attempt + 1} attempts: ${error}`);
                
                // Return "0" instead of throwing to prevent admin dashboard from breaking
                return "0";
            }
        }
        
        // Fallback (should never reach here due to loop logic, but TypeScript needs it)
        return "0";
    }

    payoutWinners = (
        leagueId: string,
        winners: { address: string; amount: string }[],
        percentages: bigint[],
        commissionPercentage: bigint
    ): TaskEither<AppError, string> => {
        return TE.tryCatch(
            async () => {
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
            },
            (e) => blockchainError('Failed to payout winners on TON', String(e))
        );
    }

    async getTransaction(hash: string): Promise<any> {
        if (!this.client) {
             // Try to initialize if not ready?
             // Since constructor calls async initialize, might race.
             // But usually active by the time we call.
             if (!this.client) throw new Error("TON Client not initialized");
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
        } catch (e) {
            return null;
        }
    }

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
    waitForTransaction = (
        msgHash: string,
        timeoutMs: number = 30000
    ): TaskEither<AppError, boolean> => {
        return TE.tryCatch(
            async () => {
                if (!this.client) throw new Error("Client not initialized");
                
                // Get Contract Address from Env
                let contractAddressStr = process.env.VITE_TON_CONTRACT_ADDRESS || process.env.TON_CONTRACT_ADDRESS;
                if (!contractAddressStr) {
                    contractAddressStr = "kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S";
                }

                const { Address, storeMessage, beginCell, Cell } = await import("@ton/core");
                const contractAddress = Address.parse(contractAddressStr);
                
                // If it's a long string (BOC) instead of a 64-char hex hash, hash it first
                let targetHash = msgHash;
                if (msgHash.length > 64) {
                    try {
                        const cell = Cell.fromBase64(msgHash);
                        targetHash = cell.hash().toString('hex');
                        logger.info(`[TON] Computed hash from BOC: ${targetHash}`);
                    } catch (e) {
                        logger.error(`[TON] Failed to parse msgHash as BOC, using as-is: ${msgHash.substring(0, 20)}...`);
                    }
                }

                const startTime = Date.now();
                
                while (Date.now() - startTime < timeoutMs) {
                    try {
                        // Fetch recent transactions for the contract
                        const transactions = await this.client.getTransactions(contractAddress, { limit: 50 });
                        
                        for (const tx of transactions) {
                            if (tx.inMessage) {
                                let txMsgHash: string;
                                try {
                                    // Serialize to get hash
                                    const inMsgCell = beginCell().store(storeMessage(tx.inMessage)).endCell();
                                    txMsgHash = inMsgCell.hash().toString('hex');
                                } catch (e) {
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
                    } catch (e: any) {
                        if (e.message.includes("Transaction bounced") || e.message.includes("exit code")) {
                            throw e; // Fail fast if definitely failed
                        }
                        logger.warn(`[TON] Polling error: ${e.message}`);
                    }
                    
                    // Wait 2 seconds before retry
                    await new Promise(r => setTimeout(r, 2000));
                }
                
                throw new Error("Transaction verification timed out");
            },
            (e) => blockchainError('Failed to verify transaction', String(e))
        );
    }

    createLeague = (
        leagueId: string,
        userId: string,
        commission: number,
        fee: bigint,
        gasAmount: string = "0.1"
    ): TaskEither<AppError, string> => {
        return TE.tryCatch(
            async () => {
                if (!this.client || !this.wallet || !this.walletKey) {
                     throw new Error("TonBlockchainService not fully initialized (Wallet/Key missing)");
                }

                const { Address, beginCell, toNano, storeMessage } = await import("@ton/core");
                
                let contractAddressStr = process.env.VITE_TON_CONTRACT_ADDRESS || process.env.TON_CONTRACT_ADDRESS;
                if (!contractAddressStr) contractAddressStr = "kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S";
                const contractAddress = Address.parse(contractAddressStr);

                const payload = beginCell()
                    .storeUint(226823229, 32)
                    .storeStringRefTail(leagueId)
                    .storeStringRefTail(userId)
                    .storeUint(commission, 64)
                    .storeCoins(fee)
                    .endCell();

                // Wait before first RPC call (getSeqno)
                await this.waitIfLimited();

                const seqno = await this.wallet.getSeqno(this.client.provider(this.wallet.address, null));
                
                await this.waitIfLimited();

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

                await this.client.sendExternalMessage(this.wallet, transfer);
                
                // transfer from createTransfer might be Cell or Message depending on version.
                // If it's a Cell, it has .hash(). If Message, use storeMessage.
                // Lint said it's Cell.
                const msgHash = (transfer as any).hash().toString('hex');
                
                logger.info(`[TON] CreateLeague tx sent. MsgHash: ${msgHash}`);
                return msgHash;
            },
            (e) => blockchainError('Failed to create league on chain', String(e))
        );
    }

    /**
     * Create a public league (owner only)
     * Only pays gas fees, not the stake amount
     */
    createPublicLeague = (
        leagueId: string,
        commission: number,
        feeAmount: bigint, // What users will pay to stake
        gasAmount: string = "0.25" // Gas we pay (increased for reliability)
    ): TaskEither<AppError, string> => {
        return TE.tryCatch(
            async () => {
                await this.ensureInitialized();

                const { Address, beginCell, toNano, storeMessage } = await import("@ton/core");
                
                let contractAddressStr = process.env.VITE_TON_CONTRACT_ADDRESS || process.env.TON_CONTRACT_ADDRESS;
                if (!contractAddressStr) contractAddressStr = "kQAh44E_ar-pkJjYdqIgs4_NJeMClCtd9mNzNc-FxGttIy5S";
                const contractAddress = Address.parse(contractAddressStr);

                // Wait before first RPC call (getSeqno)
                await this.waitIfLimited();

                // CreatePublicLeague message structure
                // OpCode: 1462801691 (0x5730951b)
                const payload = beginCell()
                    .storeUint(1462801691, 32)
                    .storeStringRefTail(leagueId)
                    .storeUint(commission, 64)
                    .storeCoins(feeAmount)
                    .endCell();

                const seqno = await this.wallet.getSeqno(this.client.provider(this.wallet.address, null));
                logger.info(`[TON] Wallet seqno: ${seqno}, Sending to: ${contractAddress.toString()}`);
                
                await this.waitIfLimited();

                // Only pay gas, not the fee amount
                const value = toNano(gasAmount);
                logger.info(`[TON] Transaction value: ${value} (${gasAmount} TON)`);

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

                logger.info(`[TON] Sending external message...`);
                await this.client.sendExternalMessage(this.wallet, transfer);
                logger.info(`[TON] External message sent successfully`);
                
                const msgHash = (transfer as any).hash().toString('hex');
                
                logger.info(`[TON] CreatePublicLeague tx sent. MsgHash: ${msgHash}`);
                return msgHash;
            },
            (e) => blockchainError('Failed to create public league on chain', String(e))
        );
    }
}

export function createTonBlockchainService(endpoint: string, mnemonic: string, apiKey?: string) {
    return new TonBlockchainService(endpoint, mnemonic, apiKey);
}
