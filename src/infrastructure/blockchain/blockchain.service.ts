import * as TE from 'fp-ts/lib/TaskEither.js';
type TaskEither<E, A> = TE.TaskEither<E, A>;
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { blockchainError } from '../../fp/domain/errors/AppError.js';

export interface BlockchainService {
  payoutWinners: (leagueId: string, winners: { address: string; amount: string }[]) => TaskEither<AppError, string>;
}

import { ethers } from 'ethers';

const ABI = [
    "function payoutWinners(string calldata leagueId, address[] calldata winners, uint256[] calldata amounts) external"
];

export const createBlockchainService = (
  rpcEndpoint: string,
  apiKey: string, // Kept for interface compatibility, though might be unused if RPC URL contains key
  contractAddress: string,
  privateKey: string 
): BlockchainService => {
  
  return {
    payoutWinners: (leagueId, winners) => 
      TE.tryCatch(
        async () => {
            if (process.env.NODE_ENV === 'test') {
                 console.log(`[POLYGON] Mock paying out winners for league ${leagueId}`);
                 return `0xmocktxhash_${Date.now()}`;
            }

            const provider = new ethers.JsonRpcProvider(rpcEndpoint);
            const wallet = new ethers.Wallet(privateKey, provider);
            const contract = new ethers.Contract(contractAddress, ABI, wallet);
            
            // Convert amounts to Wei (assuming input is POL string)
            const addresses = winners.map(w => w.address);
            const amounts = winners.map(w => ethers.parseEther(w.amount));

            const tx = await contract.payoutWinners(leagueId, addresses, amounts);
            await tx.wait(); // Wait for confirmation? Or return hash immediately? 
            // Webhook confirms it later? 
            // If we wait here, we block. The previous design was async webhook confirmation.
            // But we can return the hash so the system knows a tx was sent.
            
            return tx.hash;
        },
        (e) => blockchainError('Failed to payout winners on Polygon', String(e))
      )
  };
};
