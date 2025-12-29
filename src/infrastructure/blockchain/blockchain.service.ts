import { TonClient, WalletContractV4, internal, SendMode, toNano, fromNano, Address, beginCell } from '@ton/ton';
import { mnemonicToWalletKey, keyPairFromSecretKey } from '@ton/crypto';
import * as TE from 'fp-ts/lib/TaskEither.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { blockchainError } from '../../fp/domain/errors/AppError.js';

// OpCodes for the Escrow Contract (Placeholder values - needs update when contract is deployed)
const OP_JOIN_LEAGUE = 0x5fcc3d14; 
const OP_DISTRIBUTE_WINNINGS = 0x82b42f3c; // Random placeholders
const OP_FUND_ESCROW = 0x93a2b1c4;

export interface BlockchainService {
  getBalance: (address: string) => TE.TaskEither<AppError, string>;
  transferTON: (secretKeyHex: string, toAddress: string, amount: string) => TE.TaskEither<AppError, string>;
  joinLeagueOnChain: (secretKeyHex: string, leagueId: string, userAddress: string) => TE.TaskEither<AppError, string>;
  fundEscrow: (secretKeyHex: string, amount: string) => TE.TaskEither<AppError, string>;
  getGasCost: (toAddress: string, amount: string) => TE.TaskEither<AppError, string>;
  distributeWinnings: (secretKeyHex: string, leagueId: string, winners: string[], amounts: string[], platformCommission: string, creatorWallet: string | null, creatorCommission: string) => TE.TaskEither<AppError, string>;
}

export const createBlockchainService = (
  endpoint: string,
  apiKey: string,
  escrowAddress: string,
  serverMnemonic: string // Optional if needed for server operations
): BlockchainService => {
  
  const client = new TonClient({
    endpoint,
    apiKey: apiKey || undefined
  });

  // Helper to open a wallet from secret key (hex string)
  const getWallet = async (secretKeyHex: string) => {
    const secretKey = Buffer.from(secretKeyHex, 'hex');
    const keyPair = keyPairFromSecretKey(secretKey);
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
    const contract = client.open(wallet);
    return { contract, keyPair };
  };

  return {
    getBalance: (address) => 
      TE.tryCatch(
        async () => {
          const bal = await client.getBalance(Address.parse(address));
          return fromNano(bal);
        },
        (e) => blockchainError('Failed to get balance', String(e))
      ),

    transferTON: (secretKeyHex, toAddress, amount) =>
      TE.tryCatch(
        async () => {
          const { contract, keyPair } = await getWallet(secretKeyHex);
          
          // Create a transfer
          const seqno = await contract.getSeqno();
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

          await contract.send(transfer);
          
          // TON doesn't return tx hash immediately in the same way, usually we wait or return seqno/msg hash
          // For simplicity we return a placeholder or wait slightly
          return `seqno_${seqno + 1}`; 
        },
        (e) => blockchainError('Failed to transfer TON', String(e))
      ),

    getGasCost: (toAddress, amount) => 
        TE.tryCatch(
            async () => {
                // Estimating fees in TON is different. 
                // We can assume a standard fee for a transfer (e.g. 0.005 TON) or use runMethod to estimate
                // For now returning a static estimate as estimating via API requires more setup
                return "0.01"; 
            },
             (e) => blockchainError('Failed to estimate gas cost', String(e))
        ),

    joinLeagueOnChain: (secretKeyHex, leagueId, userAddress) =>
      TE.tryCatch(
        async () => {
          const { contract, keyPair } = await getWallet(secretKeyHex);
          const seqno = await contract.getSeqno();

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

          await contract.send(transfer);
          return `join_league_seqno_${seqno}`;
        },
        (e) => blockchainError('Failed to join league on-chain', String(e))
      ),

    fundEscrow: (secretKeyHex, amount) =>
      TE.tryCatch(
        async () => {
          // Simply sending TON to escrow address with a "fund" op or just transfer
          const { contract, keyPair } = await getWallet(secretKeyHex);
          const seqno = await contract.getSeqno();
          
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

          await contract.send(transfer);
          return `fund_escrow_seqno_${seqno}`;
        },
        (e) => blockchainError('Failed to fund escrow', String(e))
      ),

    distributeWinnings: (secretKeyHex, leagueId, winners, amounts, platformCommission, creatorWallet, creatorCommission) =>
      TE.tryCatch(
        async () => {
          const { contract, keyPair } = await getWallet(secretKeyHex);
          const seqno = await contract.getSeqno();

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

          await contract.send(transfer);
          return `distribute_seqno_${seqno}`;
        },
        (e) => blockchainError('Failed to distribute winnings', String(e))
      )
  };
};
