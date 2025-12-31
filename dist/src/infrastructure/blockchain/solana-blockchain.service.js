var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as TE from 'fp-ts/lib/TaskEither.js';
import { blockchainError } from '../../fp/domain/errors/AppError.js';
import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import bs58 from 'bs58';
// Minimal IDL definition for payoutWinners
const IDL = {
    "version": "0.1.0",
    "name": "league_payout",
    "metadata": {
        "address": "GnJfcroEEbhkUcrCKoV7UB3iBJ97kyeefxHnLFqBqMMC"
    },
    "instructions": [
        {
            "name": "payoutWinners",
            "accounts": [
                { "name": "league", "isMut": true, "isSigner": false },
                { "name": "signer", "isMut": true, "isSigner": true },
                { "name": "admin", "isMut": true, "isSigner": false },
                { "name": "systemProgram", "isMut": false, "isSigner": false }
            ],
            "args": [
                { "name": "leagueId", "type": "string" },
                { "name": "winningPercentages", "type": { "vec": "u64" } },
                { "name": "commissionPercentage", "type": "u64" }
            ]
        }
    ]
};
const PROGRAM_ID = new PublicKey(process.env.SOLANA_PROGRAM_ID || "Gcmwe5hEZEqJk5JANLRUByw8rq9Nn1ti7ie6eicxPqtN");
export const createSolanaBlockchainService = (rpcEndpoint, privateKey) => {
    return {
        payoutWinners: (leagueId, winners, percentages, commissionPercentage) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'test' && !process.env.FORCE_REAL_BLOCKCHAIN_LOGIC) {
                console.log(`[SOLANA] Mock paying out winners for league ${leagueId}`);
                return `signature_mock_${Date.now()}`;
            }
            const connection = new Connection(rpcEndpoint, 'confirmed');
            const secretKey = bs58.decode(privateKey);
            const keypair = Keypair.fromSecretKey(secretKey);
            const wallet = new Wallet(keypair);
            const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
            // Initialize Program
            // Anchor Program constructor: new Program(idl, provider)
            // Address is in IDL.metadata.address
            const program = new Program(IDL, provider);
            const [leaguePda] = PublicKey.findProgramAddressSync([Buffer.from("league"), Buffer.from(leagueId)], PROGRAM_ID);
            // Convert BigInts to BN (Anchor uses BN.js)
            const winningPercentagesBN = percentages.map(p => new anchor.BN(p.toString()));
            const commissionPercentageBN = new anchor.BN(commissionPercentage.toString());
            // Create remaining accounts list for winners
            // The order MUST match the `percentages` array
            const remainingAccounts = winners.map(w => ({
                pubkey: new PublicKey(w.address),
                isWritable: true,
                isSigner: false
            }));
            const tx = yield program.methods
                .payoutWinners(leagueId, winningPercentagesBN, commissionPercentageBN)
                .accounts({
                league: leaguePda,
                signer: keypair.publicKey,
                admin: keypair.publicKey, // Assuming admin is same as signer
                systemProgram: anchor.web3.SystemProgram.programId,
            })
                .remainingAccounts(remainingAccounts)
                .rpc();
            console.log(`[SOLANA] Payout transaction signature: ${tx}`);
            return tx;
        }), (e) => blockchainError('Failed to payout winners on Solana', String(e))),
    };
};
