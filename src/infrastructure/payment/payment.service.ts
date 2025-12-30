import type { AppError } from '../../fp/domain/errors/AppError.js';
import { paymentError } from '../../fp/domain/errors/AppError.js';

export interface PaymentService {
  initiateDeposit: (userId: string, amount: number, currency: string) => Promise<{ paymentUrl: string; orderId: string }>;
  requestWithdrawal: (userId: string, amount: number, currency: string, destination: string) => Promise<{ orderId: string }>;
}

export const createPaymentService = (): PaymentService => ({
  initiateDeposit: async (userId, amount, currency) => ({
      paymentUrl: `https://checkout.yellowcard.io/mock/${Math.random().toString(36).substring(7)}`,
      orderId: `yc_dep_${Date.now()}_${userId.substring(0, 5)}`
  }),

  requestWithdrawal: async (userId, amount, currency, destination) => ({
      orderId: `yc_wit_${Date.now()}_${userId.substring(0, 5)}`
  })
});
