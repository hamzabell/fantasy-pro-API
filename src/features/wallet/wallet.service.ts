import { ethers } from 'ethers';
import * as TE from 'fp-ts/lib/TaskEither.js';
import { pipe } from 'fp-ts/lib/function.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { internalError, paymentError, insufficientBalanceError } from '../../fp/domain/errors/AppError.js';
import type { WalletRepository } from './wallet.repository.js';
import { encrypt, decrypt } from './encryption.js';
import type { Wallet, Transaction } from '../../generated/prisma/index.js';
import type { BlockchainService } from '../../infrastructure/blockchain/blockchain.service.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';

export interface WalletService {
  createWalletForUser: (userId: string) => TE.TaskEither<AppError, Wallet>;
  getWalletBalance: (userId: string) => TE.TaskEither<AppError, string>;
  getUserWallet: (userId: string) => TE.TaskEither<AppError, Wallet>;
  transferFunds: (userId: string, toAddress: string, amount: string) => TE.TaskEither<AppError, string>;
  getUserTransactions: (userId: string) => TE.TaskEither<AppError, Transaction[]>;
}

export const createWalletService = (repo: WalletRepository, blockchainService: BlockchainService): WalletService => ({
  createWalletForUser: (userId) => 
    pipe(
      TE.tryCatch(
          async () => {
             const wallet = ethers.Wallet.createRandom();
             return { address: wallet.address, privateKey: wallet.privateKey };
          },
          (e) => internalError('Failed to generate wallet', e)
      ),
      TE.chain(({ address, privateKey }) => {
        const encryptedPrivateKey = encrypt(privateKey);
        return repo.create({ userId, address, encryptedPrivateKey });
      })
    ),

  getWalletBalance: (userId) => 
    pipe(
      repo.findByUserId(userId),
      TE.map((wallet) => wallet.balance.toString())
    ),

  getUserWallet: (userId) => repo.findByUserId(userId),

  transferFunds: (userId, toAddress, amount) =>
    pipe(
        repo.findByUserId(userId),
        TE.chain((wallet) => {
            // decrypt private key
            const privateKey = decrypt(wallet.encryptedPrivateKey);
            
            // Validate balance > amount + cost
            return pipe(
                blockchainService.getGasCost(toAddress, amount),
                TE.chain((gasCost) => {
                    const amountDec = new Decimal(amount);
                    const gasCostDec = new Decimal(gasCost);
                    const totalCost = amountDec.add(gasCostDec);
                    
                    if (wallet.balance.lessThan(totalCost)) {
                        return TE.left(insufficientBalanceError(totalCost.toNumber(), wallet.balance.toNumber()));
                    }
                    
                    // Proceed with transfer
                    return pipe(
                        blockchainService.transferMATIC(privateKey, toAddress, amount),
                        TE.chain((txHash) => 
                            // Update balance in DB - simplified sync
                            // ideally we wait for event or have a worker, but for now we subtract immediately
                            pipe(
                                repo.updateBalance(userId, wallet.balance.minus(totalCost)),
                                TE.map(() => txHash)
                            )
                        )
                    );
                })
            )
        })
    ),

  getUserTransactions: (userId) => repo.getTransactions(userId)
});
