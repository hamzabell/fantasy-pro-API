
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { 
    type AppError, 
    authenticationError, 
    internalError
} from '../../fp/domain/errors/AppError.js';
import { saveUserToDatabase, retrieveUserFromDatabaseByEmail, updateUserInDatabaseById, incrementUserCoins } from '../users/users-model.js';
import { createPopulatedUser } from '../users/users-factories.js';
import prisma from '../../prisma.js';
import { createWalletRepository } from '../wallet/wallet.repository.js';
import { createBlockchainService } from '../../infrastructure/blockchain/blockchain.service.js';
import { createWalletService } from '../wallet/wallet.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';

const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'; 

const client = new OAuth2Client(GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, REDIRECT_URI);

const blockchainService = createBlockchainService(
    process.env.TON_RPC_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC',
    process.env.TON_API_KEY || '',
    process.env.LEAGUE_ESCROW_ADDRESS || '0x0',
    process.env.SERVER_MNEMONIC || ''
);
const walletRepository = createWalletRepository(prisma);
const walletService = createWalletService(walletRepository, blockchainService);

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    walletAddress?: string | null;
  };
}

export const generateGoogleAuthUrl = (referralCode?: string): string => {
  const options: any = {
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  };
  
  if (referralCode) {
    options.state = JSON.stringify({ referralCode });
  }

  return client.generateAuthUrl(options);
};

export const loginWithGoogleCode = async (code: string, referralCode?: string): Promise<AuthResponse> => {
    // 1. Exchange Code for Tokens
    let payload;
    try {
        const { tokens } = await client.getToken(code);
        console.log('[Auth] Google Tokens received. ID Token present:', !!tokens.id_token);
        client.setCredentials(tokens);
        
        // Verify ID Token
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new Error('Invalid Google Token payload');
        }
    } catch (e: any) {
        console.error('[Auth] Google Auth Detail Failure:', e);
        throw authenticationError('Google Auth Failed', 'InvalidToken');
    }

    // 2. Find or Create User
    let user = await retrieveUserFromDatabaseByEmail(payload.email);
    
    if (user) {
        // Always sync user details from Google on login
        console.log('[Auth] Google Login for:', user.email, 'Payload Picture:', payload.picture);
        try {
             user = await updateUserInDatabaseById({
                userId: user.id,
                user: {
                    name: payload.name,
                    image: payload.picture
                }
            });
        } catch (e) {
            throw internalError('Failed to update user', e);
        }
    } else {
        try {
            const newUser = createPopulatedUser({ 
                email: payload.email!, 
                name: payload.name,
                image: payload.picture
            });
            delete newUser.password; 
            user = await saveUserToDatabase(newUser);
            
            // Create Wallet
            await walletService.createWalletForUser(user.id);
            
            // Referrer Credit
            if (referralCode) {
                 try {
                     console.log(`[Referral] Crediting referrer: ${referralCode}`);
                     await incrementUserCoins(referralCode, 50);
                 } catch (e) {
                     console.error('[Referral] Failed to credit referrer', e);
                     // Ignore referral error to not block login
                 }
            }
        } catch (e) {
            throw internalError('Failed to create user', e);
        }
    }

    // 3. Generate Token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    return {
      token,
      user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          image: user.image,
          walletAddress: user.walletAddress 
      }
    };
};
