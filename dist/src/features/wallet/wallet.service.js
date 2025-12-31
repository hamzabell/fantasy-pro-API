import * as TE from 'fp-ts/lib/TaskEither.js';
import * as F from 'fp-ts/lib/function.js';
const { pipe } = F;
import { internalError, paymentError, insufficientBalanceError } from '../../fp/domain/errors/AppError.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';
export const createWalletService = (repo, blockchainService) => ({
    createWalletForUser: (userId) => TE.left(internalError('Custodial wallet creation is deprecated', new Error('Deprecated'))),
    getWalletBalance: (userId) => pipe(repo.findByUserId(userId), TE.map((wallet) => wallet.balance.toString())),
    getUserWallet: (userId) => repo.findByUserId(userId),
    transferFunds: (userId, toAddress, amount) => TE.left(internalError('Custodial transfers are deprecated', new Error('Deprecated'))),
    getUserTransactions: (userId) => repo.getTransactions(userId),
    creditUser: (userId, amount) => pipe(repo.findByUserId(userId), TE.chain((wallet) => {
        const current = wallet.balance;
        const toAdd = new Decimal(amount);
        const newBalance = current.add(toAdd);
        return pipe(repo.updateBalance(userId, newBalance), TE.map(() => newBalance.toString()));
    }))
});
