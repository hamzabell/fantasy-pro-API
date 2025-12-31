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
import { ethers } from 'ethers';
import { updateFantasyLeagueInDatabaseById, updateFantasyLeagueMembershipInDatabaseById, retrieveFantasyLeagueMembershipByLeagueAndUser, retrieveFantasyLeagueFromDatabaseById } from '../../features/fantasy-leagues/fantasy-leagues-model.js';
const ABI = [
    "function payoutWinners(string calldata leagueId, address[] calldata winners, uint256[] calldata amounts) external",
    "event LeagueCreated(string leagueId, string userId, uint256 commissionPercentage, address indexed creator, uint256 feePaid)",
    "event Stake(address indexed user, uint256 amount, string userId, string leagueId)",
    "event PayoutCompleted(string leagueId, uint256 totalPayout, uint256 commission)"
];
export const createBlockchainService = (rpcEndpoint, contractAddress, privateKey) => {
    return {
        payoutWinners: (leagueId, winners, percentages, commissionPercentage) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
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
            const tx = yield contract.payoutWinners(leagueId, addresses, percentages, commissionPercentage);
            yield tx.wait();
            return tx.hash;
        }), (e) => blockchainError('Failed to payout winners on Polygon', String(e))),
    };
};
