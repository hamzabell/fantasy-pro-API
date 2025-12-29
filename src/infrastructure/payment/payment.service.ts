import * as TE from 'fp-ts/lib/TaskEither.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { paymentError } from '../../fp/domain/errors/AppError.js';

export interface PaymentService {
  initiateDeposit: (userId: string, amount: number, currency: string) => TE.TaskEither<AppError, { paymentUrl: string; orderId: string }>;
  requestWithdrawal: (userId: string, amount: number, currency: string, destination: string) => TE.TaskEither<AppError, { orderId: string }>;
}

export const createPaymentService = (): PaymentService => ({
  initiateDeposit: (userId, amount, currency) =>
    TE.fromIO(() => ({
      paymentUrl: `https://checkout.yellowcard.io/mock/${Math.random().toString(36).substring(7)}`,
      orderId: `yc_dep_${Date.now()}_${userId.substring(0, 5)}`
    })),

  requestWithdrawal: (userId, amount, currency, destination) =>
    TE.right({
      orderId: `yc_wit_${Date.now()}_${userId.substring(0, 5)}`
    })
});
