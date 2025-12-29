import type { PrismaClient, Wallet, Transaction } from '../../generated/prisma/index.js';
import { taskEither as TE, function as F } from 'fp-ts';
const { pipe } = F;
type TaskEither<E, A> = TE.TaskEither<E, A>;
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { notFoundError } from '../../fp/domain/errors/AppError.js';
import { safePrisma } from '../../fp/utils/fp-utils.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';

export interface WalletRepository {
  create: (data: { userId: string; address: string; encryptedPrivateKey: string }) => TaskEither<AppError, Wallet>;
  findByUserId: (userId: string) => TaskEither<AppError, Wallet>;
  updateBalance: (userId: string, newBalance: Decimal) => TaskEither<AppError, Wallet>;
  getTransactions: (userId: string) => TaskEither<AppError, Transaction[]>;
}

export const createWalletRepository = (prisma: PrismaClient): WalletRepository => ({
  create: (data) =>
    safePrisma(
      () => prisma.wallet.create({ data }),
      'createWallet'
    ),

  findByUserId: (userId) =>
    pipe(
      safePrisma(
        () => prisma.wallet.findUnique({ where: { userId } }),
        'findWalletByUserId'
      ),
      TE.chain((wallet) => 
        wallet 
          ? TE.right(wallet) 
          : TE.left(notFoundError('Wallet', userId))
      )
    ),

  updateBalance: (userId, newBalance) =>
    pipe(
      safePrisma(
        () => prisma.wallet.update({
          where: { userId },
          data: { 
            balance: newBalance,
            lastBalanceUpdate: new Date()
          }
        }),
        'updateWalletBalance'
      )
    ),

  getTransactions: (userId) =>
    safePrisma(
      () => prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      }),
      'getTransactions'
    )
});
