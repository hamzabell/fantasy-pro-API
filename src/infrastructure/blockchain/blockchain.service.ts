import { ethers } from 'ethers';
import * as TE from 'fp-ts/lib/TaskEither.js';
import { pipe } from 'fp-ts/lib/function.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { blockchainError } from '../../fp/domain/errors/AppError.js';

// Minimal ABI for ERC20 and LeagueEscrow
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transfer(address recipient, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)'
];

const LEAGUE_ESCROW_ABI = [
  'function joinLeague(bytes32 leagueId, address user) external',
  'function distributeWinnings(bytes32 leagueId, address[] calldata winners, uint256[] calldata amounts) external'
];

export interface BlockchainService {
  getBalance: (address: string) => TE.TaskEither<AppError, string>;
  transferUSDC: (privateKey: string, toAddress: string, amount: string) => TE.TaskEither<AppError, string>;
  approveEscrow: (privateKey: string, amount: string) => TE.TaskEither<AppError, string>;
  joinLeagueOnChain: (privateKey: string, leagueId: string, userAddress: string) => TE.TaskEither<AppError, string>;
  fundEscrow: (privateKey: string, amount: string) => TE.TaskEither<AppError, string>;
  transferMATIC: (privateKey: string, toAddress: string, amount: string) => TE.TaskEither<AppError, string>;
  getGasCost: (toAddress: string, amount: string) => TE.TaskEither<AppError, string>;
  distributeWinnings: (privateKey: string, leagueId: string, winners: string[], amounts: string[]) => TE.TaskEither<AppError, string>;
}

export const createBlockchainService = (
  rpcUrl: string,
  usdcAddress: string,
  escrowAddress: string
): BlockchainService => {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Helper to get signer
  const getSigner = (privateKey: string) => new ethers.Wallet(privateKey, provider);

  return {
    getBalance: (address) => 
      TE.tryCatch(
        async () => {
          const balance = await provider.getBalance(address);
          return ethers.formatEther(balance);
        },
        (e) => blockchainError('Failed to get balance', String(e))
      ),

    transferUSDC: (privateKey, toAddress, amount) =>
      TE.tryCatch(
        async () => {
          const signer = getSigner(privateKey);
          const usdc = new ethers.Contract(usdcAddress, ERC20_ABI, signer);
          const amtWei = ethers.parseUnits(amount, 6); // USDC has 6 decimals
          const tx = await usdc.transfer(toAddress, amtWei);
          await tx.wait(1); // Wait for 1 confirmation
          return tx.hash;
        },
        (e) => blockchainError('Failed to transfer USDC', String(e))
      ),

    approveEscrow: (privateKey, amount) =>
      TE.tryCatch(
        async () => {
          const signer = getSigner(privateKey);
          const usdc = new ethers.Contract(usdcAddress, ERC20_ABI, signer);
          const amtWei = ethers.parseUnits(amount, 6);
          const tx = await usdc.approve(escrowAddress, amtWei);
          await tx.wait(1);
          return tx.hash;
        },
        (e) => blockchainError('Failed to approve Escrow', String(e))
      ),

    joinLeagueOnChain: (privateKey, leagueId, userAddress) =>
      TE.tryCatch(
        async () => {
          const signer = getSigner(privateKey);
          const escrow = new ethers.Contract(escrowAddress, LEAGUE_ESCROW_ABI, signer);
          // leagueId must be bytes32
          const leagueIdBytes32 = ethers.id(leagueId); 
          const tx = await escrow.joinLeague(leagueIdBytes32, userAddress);
          await tx.wait(1);
          return tx.hash;
        },
        (e) => blockchainError('Failed to join league on-chain', String(e))
      ),

    fundEscrow: (privateKey, amount) =>
      TE.tryCatch(
        async () => {
          const signer = getSigner(privateKey);
          // Transfer MATIC (native token) to escrow address
          const tx = await signer.sendTransaction({
            to: escrowAddress,
            value: ethers.parseEther(amount)
          });
          await tx.wait(1);
          return tx.hash;
        },
        (e) => blockchainError('Failed to fund escrow', String(e))
      ),

    transferMATIC: (privateKey: string, toAddress: string, amount: string) =>
        TE.tryCatch(
          async () => {
            const signer = getSigner(privateKey);
            const tx = await signer.sendTransaction({
              to: toAddress,
              value: ethers.parseEther(amount)
            });
            await tx.wait(1);
            return tx.hash;
          },
          (e) => blockchainError('Failed to transfer MATIC', String(e))
        ),
    
    // Changing estimateGas to return the cost in ETH/MATIC directly to keep it simple for service
    getGasCost: (toAddress: string, amount: string) => 
        TE.tryCatch(
            async () => {
                const feeData = await provider.getFeeData();
                const gasPrice = feeData.gasPrice ?? BigInt(1000000000); // fallback 1 gwei
                
                const gasUnits = await provider.estimateGas({
                    to: toAddress,
                    value: ethers.parseEther(amount)
                });
                
                const costWei = gasUnits * gasPrice;
                return ethers.formatEther(costWei);
            },
             (e) => blockchainError('Failed to estimate gas cost', String(e))
        )
      ,

    distributeWinnings: (privateKey, leagueId, winners, amounts) =>
      TE.tryCatch(
        async () => {
          const signer = getSigner(privateKey);
          const escrow = new ethers.Contract(escrowAddress, LEAGUE_ESCROW_ABI, signer);
          const leagueIdBytes32 = ethers.id(leagueId);
          // Amounts need to be in Wei/lowest denomination if they are passed as strings of native units?
          // The contract expects uint256[] amounts. Assuming input amounts are strings of "ether" (MATIC).
          // We need to verify if amounts are USDC (6 decimals) or MATIC (18 decimals).
          // Based on context, entry fees were MATIC? Wait, user said entryPoolUsd but then paid in MATIC?
          // The early conversation said "charge 1500 Naira... in MATIC".
          // And "charge 10 MATIC".
          // So the pool is in MATIC.
          const amountsWei = amounts.map(a => ethers.parseEther(a));
          
          const tx = await escrow.distributeWinnings(leagueIdBytes32, winners, amountsWei);
          await tx.wait(1);
          return tx.hash;
        },
        (e) => blockchainError('Failed to distribute winnings', String(e))
      )
  };
};
