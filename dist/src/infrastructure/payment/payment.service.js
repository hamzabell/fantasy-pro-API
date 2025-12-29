import * as TE from 'fp-ts/lib/TaskEither.js';
import { paymentError } from '../../fp/domain/errors/AppError.js';
export const createPaymentService = () => ({
    initiateDeposit: (userId, amount, currency) => TE.fromIO(() => ({
        paymentUrl: `https://checkout.yellowcard.io/mock/${Math.random().toString(36).substring(7)}`,
        orderId: `yc_dep_${Date.now()}_${userId.substring(0, 5)}`
    })),
    requestWithdrawal: (userId, amount, currency, destination) => TE.right({
        orderId: `yc_wit_${Date.now()}_${userId.substring(0, 5)}`
    })
});
