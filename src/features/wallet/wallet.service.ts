import type { AppError } from '../../fp/domain/errors/AppError.js';
import { internalError, paymentError, insufficientBalanceError } from '../../fp/domain/errors/AppError.js';
import type { WalletRepository } from './wallet.repository.js';
import { encrypt, decrypt } from './encryption.js';
import type { Wallet, Transaction } from '../../generated/prisma/index.js';
import type { BlockchainService } from '../../infrastructure/blockchain/blockchain.service.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';

export interface WalletService {
  createWalletForUser: (userId: string) => Promise<Wallet>;
  getWalletBalance: (userId: string) => Promise<string>;
  getUserWallet: (userId: string) => Promise<Wallet>;
  transferFunds: (userId: string, toAddress: string, amount: string) => Promise<string>;
  getUserTransactions: (userId: string) => Promise<Transaction[]>;
  creditUser: (userId: string, amount: string) => Promise<string>;
}

export const createWalletService = (repo: WalletRepository, blockchainService: BlockchainService): WalletService => ({
  createWalletForUser: async (userId) => {
    try {
       // Generate new TON wallet
       // We use @ton/crypto for mnemonic
       const { mnemonicNew, mnemonicToWalletKey } = await import('@ton/crypto');
       const { WalletContractV4 } = await import('@ton/ton');
       
       const mnemonics = await mnemonicNew();
       const keyPair = await mnemonicToWalletKey(mnemonics);
       
       const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
       
       // We store the Secret Key (Hex) as the "privateKey". 
       const secretKeyHex = keyPair.secretKey.toString('hex');
       
       const encryptedPrivateKey = encrypt(secretKeyHex);
       return await repo.create({ userId, address: wallet.address.toString(), encryptedPrivateKey });
    } catch (e: any) {
        throw internalError('Failed to generate wallet', e);
    }
  },

  getWalletBalance: async (userId) => {
    const wallet = await repo.findByUserId(userId);
    return wallet.balance.toString();
  },

  getUserWallet: (userId) => repo.findByUserId(userId),

  transferFunds: async (userId, toAddress, amount) => {
      const wallet = await repo.findByUserId(userId);
      // decrypt private key
      const privateKey = decrypt(wallet.encryptedPrivateKey);
      
      // Validate balance > amount + cost
      const gasCost = await blockchainService.getGasCost(toAddress, amount);
      const amountDec = new Decimal(amount);
      const gasCostDec = new Decimal(gasCost);
      const totalCost = amountDec.add(gasCostDec);
      
      if (wallet.balance.lessThan(totalCost)) {
          throw insufficientBalanceError(totalCost.toNumber(), wallet.balance.toNumber());
      }
      
      // Proceed with transfer
      const txHash = await blockchainService.transferTON(privateKey, toAddress, amount);
      
      // Update balance in DB - simplified sync
      await repo.updateBalance(userId, wallet.balance.minus(totalCost));
      
      return txHash;
  },

  getUserTransactions: (userId) => repo.getTransactions(userId),

  creditUser: async (userId, amount) => {
    const wallet = await repo.findByUserId(userId);
    const current = wallet.balance;
    const toAdd = new Decimal(amount);
    const newBalance = current.add(toAdd);
    
    await repo.updateBalance(userId, newBalance);
    return newBalance.toString();
  }
});
