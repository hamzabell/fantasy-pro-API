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
import * as E from 'fp-ts/lib/Either.js';
import { pipe } from 'fp-ts/lib/function.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { authenticationError, internalError } from '../../fp/domain/errors/AppError.js';
import { saveUserToDatabase, retrieveUserFromDatabaseByEmail } from '../users/users-model.js';
import { createPopulatedUser } from '../users/users-factories.js';
import prisma from '../../prisma.js';
import { createWalletRepository } from '../wallet/wallet.repository.js';
// Initialize Wallet Service
import { createBlockchainService } from '../../infrastructure/blockchain/blockchain.service.js';
import { createWalletService } from '../wallet/wallet.service.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';
const client = new OAuth2Client(GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, REDIRECT_URI);
const blockchainService = createBlockchainService(process.env.POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com', process.env.USDC_ADDRESS || '0x0', process.env.LEAGUE_ESCROW_ADDRESS || '0x0');
const walletRepository = createWalletRepository(prisma);
const walletService = createWalletService(walletRepository, blockchainService);
export const generateGoogleAuthUrl = () => {
    return client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ],
    });
};
export const loginWithGoogleCode = (code) => pipe(
// 1. Exchange Code for Tokens
TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
    const { tokens } = yield client.getToken(code);
    client.setCredentials(tokens);
    // Verify ID Token
    const ticket = yield client.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
        throw new Error('Invalid Google Token payload');
    }
    return payload;
}), (e) => authenticationError('Google Auth Failed', e)), 
// 2. Find or Create User
TE.chain((payload) => pipe(retrieveUserFromDatabaseByEmail(payload.email || ''), TE.chain((existingUser) => {
    if (existingUser) {
        return TE.right(existingUser);
    }
    else {
        return pipe(TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = createPopulatedUser({
                email: payload.email,
                name: payload.name,
                image: payload.picture
            });
            delete newUser.password;
            return yield saveUserToDatabase(newUser);
        }), (e) => internalError('Failed to create user', e)), TE.chain((user) => pipe(walletService.createWalletForUser(user.id), TE.map(() => user))));
    }
}))), 
// 3. Generate Token & Return Response
TE.map((user) => ({
    token: jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }),
    user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        walletAddress: user.walletAddress
    }
})));
