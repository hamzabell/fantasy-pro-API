import type { PrismaClient, Wallet, Transaction } from '../../generated/prisma/index.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { notFoundError } from '../../fp/domain/errors/AppError.js';
import { safePrisma } from '../../fp/utils/fp-utils.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';

export interface WalletRepository {
  create: (data: { userId: string; address: string; encryptedPrivateKey: string }) => Promise<Wallet>;
  findByUserId: (userId: string) => Promise<Wallet>;
  updateBalance: (userId: string, newBalance: Decimal) => Promise<Wallet>;
  getTransactions: (userId: string) => Promise<Transaction[]>;
}

export const createWalletRepository = (prisma: PrismaClient): WalletRepository => ({
  create: (data) =>
    safePrisma(
      () => prisma.wallet.create({ data }),
      'createWallet'
    ),

  findByUserId: async (userId) => {
    const wallet = await safePrisma(
      () => prisma.wallet.findUnique({ where: { userId } }),
      'findWalletByUserId'
    );
    if (!wallet) {
      throw notFoundError('Wallet', userId);
    }
    return wallet;
  },

  updateBalance: (userId, newBalance) =>
    safePrisma(
      () => prisma.wallet.update({
        where: { userId },
        data: { 
          balance: newBalance,
          lastBalanceUpdate: new Date()
        }
      }),
      'updateWalletBalance'
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
