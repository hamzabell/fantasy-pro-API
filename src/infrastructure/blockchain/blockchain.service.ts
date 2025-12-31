
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
  
  listenForEvents: () => void;
}

const ABI = [
    "function payoutWinners(string calldata leagueId, address[] calldata winners, uint256[] calldata amounts) external",
    "event LeagueCreated(string leagueId, string userId, uint256 commissionPercentage, address indexed creator, uint256 feePaid)",
    "event Stake(address indexed user, uint256 amount, string userId, string leagueId)",
    "event PayoutCompleted(string leagueId, uint256 totalPayout, uint256 commission)"
];

export const createBlockchainService = (
  rpcEndpoint: string,
  apiKey: string, 
  contractAddress: string,
  privateKey: string,
  websocketEndpoint?: string // Optional WebSocket endpoint
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

    listenForEvents: () => {
        // Removed hard process.env.NODE_ENV === 'test' return to allow E2E testing of this method.
        // In real app, we likely control this via a flag in `createBlockchainService` or call it explicitly in index.ts only.
        
        let provider: ethers.Provider;
        
        if (websocketEndpoint && websocketEndpoint.startsWith('wss')) {
            console.log('Using WebSocket Provider for events');
            try {
                provider = new ethers.WebSocketProvider(websocketEndpoint);
                
                // Prevent crash on connection error (e.g. 401 Unauthorized)
                (provider as any).websocket.on('error', (err: any) => {
                    console.error('[BlockchainService] WebSocket connection error:', err.message);
                    // Optionally fallback to RPC or retry logic here
                });
                
                 (provider as any).websocket.on('close', (code: any, reason: any) => {
                    console.error(`[BlockchainService] WebSocket connection closed: ${code} ${reason}`);
                });

            } catch (e) {
                console.error('[BlockchainService] Failed to initialize WebSocketProvider:', e);
                console.log('Falling back to JsonRpcProvider');
                provider = new ethers.JsonRpcProvider(rpcEndpoint);
            }
        } else {
            console.log('Using JsonRpcProvider for events (polling)');
            provider = new ethers.JsonRpcProvider(rpcEndpoint);
        }
        
        // Note: For events to work reliably without polling lag, WebSocketProvider is better, 
        // but JsonRpcProvider supports polling.
        const contract = new ethers.Contract(contractAddress, ABI, provider);

        // Keep listener active
        if (provider instanceof ethers.WebSocketProvider) {
             // Optional: Add keep-alive logic or error handlers here if needed for robust connection
             (provider as any).websocket.onclose = () => {
                 console.error('WebSocket connection closed. Reconnecting...');
                 // Logic to reconnect could go here, or handled by process restart
             };
        }

        contract.on("LeagueCreated", async (leagueId, userId, commission, creator, feePaid, event) => {
            console.log(`Event: LeagueCreated ${leagueId} by ${userId}`);
            try {
                // Update League status to OPEN
               await updateFantasyLeagueInDatabaseById({
                   id: leagueId,
                   league: { status: "open", ownerId: userId } // Ensure owner is set
               });
            } catch (e) {
                console.error("Error handling LeagueCreated:", e);
            }
        });

        contract.on("Stake", async (user, amount, userId, leagueId, event) => {
            console.log(`Event: Stake ${amount} for league ${leagueId} user ${userId}`);
            try {
                const membership = await retrieveFantasyLeagueMembershipByLeagueAndUser(leagueId, userId);
                if (membership) {
                    await updateFantasyLeagueMembershipInDatabaseById({
                        id: membership.id,
                        membership: { status: "active" } // or "paid" depending on enum
                    });
                } else {
                    console.warn(`Membership not found for stake: ${leagueId} / ${userId}`);
                }
            } catch (e) {
                console.error("Error handling Stake:", e);
            }
        });

        contract.on("PayoutCompleted", async (leagueId, totalPayout, commission, event) => {
            console.log(`Event: PayoutCompleted ${leagueId}`);
             try {
               await updateFantasyLeagueInDatabaseById({
                   id: leagueId,
                   league: { status: "completed" } 
               });
            } catch (e) {
                console.error("Error handling PayoutCompleted:", e);
            }
        });
        
        console.log(`Listening for blockchain events on ${contractAddress} via ${websocketEndpoint ? 'WebSocket' : 'RPC'}`);
    }
  };
};
