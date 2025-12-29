var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ethers } from 'ethers';
import * as TE from 'fp-ts/lib/TaskEither.js';
import { pipe } from 'fp-ts/lib/function.js';
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
export const createBlockchainService = (rpcUrl, usdcAddress, escrowAddress) => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    // Helper to get signer
    const getSigner = (privateKey) => new ethers.Wallet(privateKey, provider);
    return {
        getBalance: (address) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield provider.getBalance(address);
            return ethers.formatEther(balance);
        }), (e) => blockchainError('Failed to get balance', String(e))),
        transferUSDC: (privateKey, toAddress, amount) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            const signer = getSigner(privateKey);
            const usdc = new ethers.Contract(usdcAddress, ERC20_ABI, signer);
            const amtWei = ethers.parseUnits(amount, 6); // USDC has 6 decimals
            const tx = yield usdc.transfer(toAddress, amtWei);
            yield tx.wait(1); // Wait for 1 confirmation
            return tx.hash;
        }), (e) => blockchainError('Failed to transfer USDC', String(e))),
        approveEscrow: (privateKey, amount) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            const signer = getSigner(privateKey);
            const usdc = new ethers.Contract(usdcAddress, ERC20_ABI, signer);
            const amtWei = ethers.parseUnits(amount, 6);
            const tx = yield usdc.approve(escrowAddress, amtWei);
            yield tx.wait(1);
            return tx.hash;
        }), (e) => blockchainError('Failed to approve Escrow', String(e))),
        joinLeagueOnChain: (privateKey, leagueId, userAddress) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            const signer = getSigner(privateKey);
            const escrow = new ethers.Contract(escrowAddress, LEAGUE_ESCROW_ABI, signer);
            // leagueId must be bytes32
            const leagueIdBytes32 = ethers.id(leagueId);
            const tx = yield escrow.joinLeague(leagueIdBytes32, userAddress);
            yield tx.wait(1);
            return tx.hash;
        }), (e) => blockchainError('Failed to join league on-chain', String(e))),
        fundEscrow: (privateKey, amount) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            const signer = getSigner(privateKey);
            // Transfer MATIC (native token) to escrow address
            const tx = yield signer.sendTransaction({
                to: escrowAddress,
                value: ethers.parseEther(amount)
            });
            yield tx.wait(1);
            return tx.hash;
        }), (e) => blockchainError('Failed to fund escrow', String(e))),
        transferMATIC: (privateKey, toAddress, amount) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            const signer = getSigner(privateKey);
            const tx = yield signer.sendTransaction({
                to: toAddress,
                value: ethers.parseEther(amount)
            });
            yield tx.wait(1);
            return tx.hash;
        }), (e) => blockchainError('Failed to transfer MATIC', String(e))),
        // Changing estimateGas to return the cost in ETH/MATIC directly to keep it simple for service
        getGasCost: (toAddress, amount) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const feeData = yield provider.getFeeData();
            const gasPrice = (_a = feeData.gasPrice) !== null && _a !== void 0 ? _a : BigInt(1000000000); // fallback 1 gwei
            const gasUnits = yield provider.estimateGas({
                to: toAddress,
                value: ethers.parseEther(amount)
            });
            const costWei = gasUnits * gasPrice;
            return ethers.formatEther(costWei);
        }), (e) => blockchainError('Failed to estimate gas cost', String(e))),
        distributeWinnings: (privateKey, leagueId, winners, amounts) => TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
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
            const tx = yield escrow.distributeWinnings(leagueIdBytes32, winners, amountsWei);
            yield tx.wait(1);
            return tx.hash;
        }), (e) => blockchainError('Failed to distribute winnings', String(e)))
    };
};
