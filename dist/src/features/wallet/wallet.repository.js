import * as TE from 'fp-ts/es6/TaskEither.js';
import { pipe } from 'fp-ts/es6/function.js';
import { notFoundError } from '../../fp/domain/errors/AppError.js';
import { safePrisma } from '../../fp/utils/fp-utils.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';
export const createWalletRepository = (prisma) => ({
    create: (data) => safePrisma(() => prisma.wallet.create({ data }), 'createWallet'),
    findByUserId: (userId) => pipe(safePrisma(() => prisma.wallet.findUnique({ where: { userId } }), 'findWalletByUserId'), TE.chain((wallet) => wallet
        ? TE.right(wallet)
        : TE.left(notFoundError('Wallet', userId)))),
    updateBalance: (userId, newBalance) => pipe(safePrisma(() => prisma.wallet.update({
        where: { userId },
        data: {
            balance: newBalance,
            lastBalanceUpdate: new Date()
        }
    }), 'updateWalletBalance')),
    getTransactions: (userId) => safePrisma(() => prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    }), 'getTransactions')
});
