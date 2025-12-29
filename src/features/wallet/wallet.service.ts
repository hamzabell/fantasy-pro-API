import { taskEither as TE, function as F } from 'fp-ts';
const { pipe } = F;
type TaskEither<E, A> = TE.TaskEither<E, A>;
import type { AppError } from '../../fp/domain/errors/AppError.js';
import { internalError, paymentError, insufficientBalanceError } from '../../fp/domain/errors/AppError.js';
import type { WalletRepository } from './wallet.repository.js';
import { encrypt, decrypt } from './encryption.js';
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
  createWalletForUser: (userId) => 
    pipe(
      TE.tryCatch(
          async () => {
             // Generate new TON wallet
             // We use @ton/crypto for mnemonic
             const { mnemonicNew, mnemonicToWalletKey } = await import('@ton/crypto');
             const { WalletContractV4 } = await import('@ton/ton');
             
             const mnemonics = await mnemonicNew();
             const keyPair = await mnemonicToWalletKey(mnemonics);
             
             const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
             
             // We store the Secret Key (Hex) as the "privateKey". 
             // Ideally we store Mnemonic but for compatibility with existing "privateKey" field we use secret key.
             const secretKeyHex = keyPair.secretKey.toString('hex');
             
             return { address: wallet.address.toString(), privateKey: secretKeyHex };
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
                        blockchainService.transferTON(privateKey, toAddress, amount),
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
