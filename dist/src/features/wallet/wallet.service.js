var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as TE from 'fp-ts/lib/TaskEither.js';
import * as F from 'fp-ts/lib/function.js';
const { pipe } = F;
import { internalError, paymentError, insufficientBalanceError } from '../../fp/domain/errors/AppError.js';
import { encrypt, decrypt } from './encryption.js';
import { Decimal } from '../../generated/prisma/runtime/library.js';
export const createWalletService = (repo, blockchainService) => ({
    createWalletForUser: (userId) => pipe(TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
        // Generate new TON wallet
        // We use @ton/crypto for mnemonic
        const { mnemonicNew, mnemonicToWalletKey } = yield import('@ton/crypto');
        const { WalletContractV4 } = yield import('@ton/ton');
        const mnemonics = yield mnemonicNew();
        const keyPair = yield mnemonicToWalletKey(mnemonics);
        const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
        // We store the Secret Key (Hex) as the "privateKey". 
        // Ideally we store Mnemonic but for compatibility with existing "privateKey" field we use secret key.
        const secretKeyHex = keyPair.secretKey.toString('hex');
        return { address: wallet.address.toString(), privateKey: secretKeyHex };
    }), (e) => internalError('Failed to generate wallet', e)), TE.chain(({ address, privateKey }) => {
        const encryptedPrivateKey = encrypt(privateKey);
        return repo.create({ userId, address, encryptedPrivateKey });
    })),
    getWalletBalance: (userId) => pipe(repo.findByUserId(userId), TE.map((wallet) => wallet.balance.toString())),
    getUserWallet: (userId) => repo.findByUserId(userId),
    transferFunds: (userId, toAddress, amount) => pipe(repo.findByUserId(userId), TE.chain((wallet) => {
        // decrypt private key
        const privateKey = decrypt(wallet.encryptedPrivateKey);
        // Validate balance > amount + cost
        return pipe(blockchainService.getGasCost(toAddress, amount), TE.chain((gasCost) => {
            const amountDec = new Decimal(amount);
            const gasCostDec = new Decimal(gasCost);
            const totalCost = amountDec.add(gasCostDec);
            if (wallet.balance.lessThan(totalCost)) {
                return TE.left(insufficientBalanceError(totalCost.toNumber(), wallet.balance.toNumber()));
            }
            // Proceed with transfer
            return pipe(blockchainService.transferTON(privateKey, toAddress, amount), TE.chain((txHash) => 
            // Update balance in DB - simplified sync
            // ideally we wait for event or have a worker, but for now we subtract immediately
            pipe(repo.updateBalance(userId, wallet.balance.minus(totalCost)), TE.map(() => txHash))));
        }));
    })),
    getUserTransactions: (userId) => repo.getTransactions(userId),
    creditUser: (userId, amount) => pipe(repo.findByUserId(userId), TE.chain((wallet) => {
        const current = wallet.balance;
        const toAdd = new Decimal(amount);
        const newBalance = current.add(toAdd);
        return pipe(repo.updateBalance(userId, newBalance), TE.map(() => newBalance.toString()));
    }))
});
