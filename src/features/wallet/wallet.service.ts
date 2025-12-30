import * as TE from 'fp-ts/lib/TaskEither.js';
import * as F from 'fp-ts/lib/function.js';
const { pipe } = F;
type TaskEither<E, A> = TE.TaskEither<E, A>;
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { internalError, paymentError, insufficientBalanceError } from '../../fp/domain/errors/AppError.js';
import type { WalletRepository } from './wallet.repository.js';
import type { Wallet, Transaction } from '../../generated/prisma/index.js';
import type { BlockchainService } from '../../infrastructure/blockchain/blockchain.service.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';

export interface WalletService {
  createWalletForUser: (userId: string) => TaskEither<AppError, Wallet>;
  getWalletBalance: (userId: string) => TaskEither<AppError, string>;
  getUserWallet: (userId: string) => TaskEither<AppError, Wallet>;
  transferFunds: (userId: string, toAddress: string, amount: string) => TaskEither<AppError, string>;
  getUserTransactions: (userId: string) => TaskEither<AppError, Transaction[]>;
  creditUser: (userId: string, amount: string) => TaskEither<AppError, string>;
}

export const createWalletService = (repo: WalletRepository, blockchainService: BlockchainService): WalletService => ({
  createWalletForUser: (userId: string) => TE.left(internalError('Custodial wallet creation is deprecated', new Error('Deprecated'))),

  getWalletBalance: (userId) => 
    pipe(
      repo.findByUserId(userId),
      TE.map((wallet) => wallet.balance.toString())
    ),

  getUserWallet: (userId) => repo.findByUserId(userId),

  transferFunds: (userId: string, toAddress: string, amount: string) => TE.left(internalError('Custodial transfers are deprecated', new Error('Deprecated'))),

  getUserTransactions: (userId) => repo.getTransactions(userId),

  creditUser: (userId, amount) =>
    pipe(
      repo.findByUserId(userId),
      TE.chain((wallet) => {
        const current = wallet.balance;
        const toAdd = new Decimal(amount);
        const newBalance = current.add(toAdd);
        
        return pipe(
          repo.updateBalance(userId, newBalance),
          TE.map(() => newBalance.toString())
        );
      })
    )
});
