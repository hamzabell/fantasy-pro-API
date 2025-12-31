
import * as TE from 'fp-ts/lib/TaskEither.js';
type TaskEither<E, A> = TE.TaskEither<E, A>;
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { blockchainError } from '../../fp/domain/errors/AppError.js';
import { ethers } from 'ethers';
import { 
    updateFantasyLeagueInDatabaseById, 
    updateFantasyLeagueMembershipInDatabaseById, 
    retrieveFantasyLeagueMembershipByLeagueAndUser,
    retrieveFantasyLeagueFromDatabaseById
} from '../../features/fantasy-leagues/fantasy-leagues-model.js';

export interface BlockchainService {
  payoutWinners: (
      leagueId: string, 
      winners: { address: string; amount: string }[],
      percentages: bigint[],
      commissionPercentage: bigint
  ) => TaskEither<AppError, string>;
  

}

const ABI = [
    "function payoutWinners(string calldata leagueId, address[] calldata winners, uint256[] calldata amounts) external",
    "event LeagueCreated(string leagueId, string userId, uint256 commissionPercentage, address indexed creator, uint256 feePaid)",
    "event Stake(address indexed user, uint256 amount, string userId, string leagueId)",
    "event PayoutCompleted(string leagueId, uint256 totalPayout, uint256 commission)"
];

export const createBlockchainService = (
  rpcEndpoint: string,
   contractAddress: string,
   privateKey: string
 ): BlockchainService => {
  
  return {
    payoutWinners: (leagueId, winners, percentages, commissionPercentage) => 
      TE.tryCatch(
        async () => {
            if (process.env.NODE_ENV === 'test' && !process.env.FORCE_REAL_BLOCKCHAIN_LOGIC) {
                 console.log(`[POLYGON] Mock paying out winners for league ${leagueId}`);
                 return `0xmocktxhash_${Date.now()}`;
            }

            const provider = new ethers.JsonRpcProvider(rpcEndpoint);
            const wallet = new ethers.Wallet(privateKey, provider);
            const contract = new ethers.Contract(contractAddress, ABI, wallet);
            
            const addresses = winners.map(w => w.address);
            // We don't necessarily need amounts in the SC call if it uses percentages, 
            // BUT the original signature used amounts? 
            // User requirement: "send ... with commission as percentage".
            // Confirmed SC signature via user voice: "payoutWinners(..., percentages, ...)"
            // So we pass the percentages array we calculated.
            
            // Note: 'percentages' is BigInt[] (basis points).
            const tx = await contract.payoutWinners(leagueId, addresses, percentages, commissionPercentage);
            await tx.wait();
            return tx.hash;
        },
        (e) => blockchainError('Failed to payout winners on Polygon', String(e))
      ),

  };
};
