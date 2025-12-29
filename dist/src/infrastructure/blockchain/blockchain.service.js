var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TonClient, WalletContractV4, internal, SendMode, toNano, fromNano, Address, beginCell } from '@ton/ton';
import { mnemonicToWalletKey, keyPairFromSecretKey } from '@ton/crypto';
import * as TE from 'fp-ts/es6/TaskEither.js';
import { blockchainError } from '../../fp/domain/errors/AppError.js';
// OpCodes for the Escrow Contract (Placeholder values - needs update when contract is deployed)
const OP_JOIN_LEAGUE = 0x5fcc3d14;
const OP_DISTRIBUTE_WINNINGS = 0x82b42f3c; // Random placeholders
const OP_FUND_ESCROW = 0x93a2b1c4;
export const createBlockchainService = (endpoint, apiKey, escrowAddress, serverMnemonic // Optional if needed for server operations
) => {
    const client = new TonClient({
        endpoint,
        apiKey: apiKey || undefined
    });
    // Helper to open a wallet from secret key (hex string)
    const getWallet = (secretKeyHex) => __awaiter(void 0, void 0, void 0, function* () {
        const secretKey = Buffer.from(secretKeyHex, 'hex');
        const keyPair = keyPairFromSecretKey(secretKey);
        const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
        const contract = client.open(wallet);
        return { contract, keyPair };
    });
    return {
        getBalance: (address) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            const bal = yield client.getBalance(Address.parse(address));
            return fromNano(bal);
        }), (e) => blockchainError('Failed to get balance', String(e))),
        transferTON: (secretKeyHex, toAddress, amount) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            const { contract, keyPair } = yield getWallet(secretKeyHex);
            // Create a transfer
            const seqno = yield contract.getSeqno();
            const transfer = contract.createTransfer({
                seqno,
                secretKey: keyPair.secretKey,
                messages: [internal({
                        to: toAddress,
                        value: toNano(amount),
                        bounce: false,
                        body: 'FantasyPro Transfer'
                    })],
                sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
            });
            yield contract.send(transfer);
            // TON doesn't return tx hash immediately in the same way, usually we wait or return seqno/msg hash
            // For simplicity we return a placeholder or wait slightly
            return `seqno_${seqno + 1}`;
        }), (e) => blockchainError('Failed to transfer TON', String(e))),
        getGasCost: (toAddress, amount) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            // Estimating fees in TON is different. 
            // We can assume a standard fee for a transfer (e.g. 0.005 TON) or use runMethod to estimate
            // For now returning a static estimate as estimating via API requires more setup
            return "0.01";
        }), (e) => blockchainError('Failed to estimate gas cost', String(e))),
        joinLeagueOnChain: (secretKeyHex, leagueId, userAddress) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            const { contract, keyPair } = yield getWallet(secretKeyHex);
            const seqno = yield contract.getSeqno();
            // Construct body for Join League
            // OP + QueryID + LeagueID (string/hash) + UserAddress
            // leagueId as String Ref or Hash? Assuming Hash/Uint256 for now or StringRef
            // If leagueId is a UUID string, we can store it as a string cell.
            const body = beginCell()
                .storeUint(OP_JOIN_LEAGUE, 32)
                .storeUint(0, 64) // query id
                .storeStringTail(leagueId)
                .storeAddress(Address.parse(userAddress))
                .endCell();
            const transfer = contract.createTransfer({
                seqno,
                secretKey: keyPair.secretKey,
                messages: [internal({
                        to: escrowAddress,
                        value: toNano("0.05"), // Gas for the execution
                        bounce: true,
                        body: body
                    })],
                sendMode: SendMode.PAY_GAS_SEPARATELY,
            });
            yield contract.send(transfer);
            return `join_league_seqno_${seqno}`;
        }), (e) => blockchainError('Failed to join league on-chain', String(e))),
        fundEscrow: (secretKeyHex, amount) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            // Simply sending TON to escrow address with a "fund" op or just transfer
            const { contract, keyPair } = yield getWallet(secretKeyHex);
            const seqno = yield contract.getSeqno();
            const body = beginCell()
                .storeUint(OP_FUND_ESCROW, 32)
                .storeUint(0, 64)
                .endCell();
            const transfer = contract.createTransfer({
                seqno,
                secretKey: keyPair.secretKey,
                messages: [internal({
                        to: escrowAddress,
                        value: toNano(amount),
                        bounce: false,
                        body: body
                    })],
                sendMode: SendMode.PAY_GAS_SEPARATELY,
            });
            yield contract.send(transfer);
            return `fund_escrow_seqno_${seqno}`;
        }), (e) => blockchainError('Failed to fund escrow', String(e))),
        distributeWinnings: (secretKeyHex, leagueId, winners, amounts, platformCommission, creatorWallet, creatorCommission) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            const { contract, keyPair } = yield getWallet(secretKeyHex);
            const seqno = yield contract.getSeqno();
            // Construct complex body
            // Updated to include commissions
            const body = beginCell()
                .storeUint(OP_DISTRIBUTE_WINNINGS, 32)
                .storeUint(0, 64)
                .storeStringTail(leagueId)
                // Store Platform Commission Amount
                .storeCoins(toNano(platformCommission))
                // Store Creator Commission Info
                .storeAddress(creatorWallet ? Address.parse(creatorWallet) : undefined) // undefined for null address in some internal tools, but storeAddress usually takes Address | null.
                // create-ton-app / ton-core usually allows null? 
                // beginCell().storeAddress(null) stores a null address (00).
                // Let's verify type. Address from @ton/ton.
                .storeCoins(toNano(creatorCommission))
                .endCell();
            // TODO: Add winners data. 
            const transfer = contract.createTransfer({
                seqno,
                secretKey: keyPair.secretKey,
                messages: [internal({
                        to: escrowAddress,
                        value: toNano("0.1"), // Gas
                        bounce: true,
                        body: body
                    })],
                sendMode: SendMode.PAY_GAS_SEPARATELY,
            });
            yield contract.send(transfer);
            return `distribute_seqno_${seqno}`;
        }), (e) => blockchainError('Failed to distribute winnings', String(e)))
    };
};
