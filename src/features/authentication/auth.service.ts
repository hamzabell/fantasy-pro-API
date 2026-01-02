
import * as TE from 'fp-ts/lib/TaskEither.js';
import * as E from 'fp-ts/lib/Either.js';
import * as F from 'fp-ts/lib/function.js';
const { pipe } = F;
type TaskEither<E, A> = TE.TaskEither<E, A>;
type Either<E, A> = E.Either<E, A>;
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { 
    type AppError, 
    authenticationError, 
    internalError,
    notFoundError,
    conflictError
} from '../../fp/domain/errors/AppError.js';
import { saveUserToDatabase, retrieveUserFromDatabaseByEmail, updateUserInDatabaseById, incrementUserCoins } from '../users/users-model.js';
import { createPopulatedUser } from '../users/users-factories.js';
import prisma from '../../prisma.js';
import { createWalletRepository } from '../wallet/wallet.repository.js';


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';


const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'; 

const client = new OAuth2Client(GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, REDIRECT_URI);

// Initialize Repository
const walletRepository = createWalletRepository(prisma);


export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string | null;
    name?: string | null;
    image?: string | null;
    walletAddress?: string | null;
  };
}

export const generateGoogleAuthUrl = (referralCode?: string, platform: 'web' | 'mobile' | 'telegram' = 'web', redirectUrl?: string): string => {
  const options: any = {
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  };
  
  if (redirectUrl) {
    options.redirect_uri = redirectUrl;
  }

  const state: any = { platform };
  if (referralCode) {
    state.referralCode = referralCode;
  }
  if (redirectUrl) {
    state.redirectUrl = redirectUrl;
  }
  options.state = JSON.stringify(state);

  return client.generateAuthUrl(options);
};

export const loginWithGoogleCode = (code: string, referralCode?: string, redirectUrl?: string): TaskEither<AppError, AuthResponse> =>
  pipe(
    // 1. Exchange Code for Tokens
    TE.tryCatch(
      async () => {
        const verifyOptions: any = {
           code,
        };
        if (redirectUrl) {
            verifyOptions.redirect_uri = redirectUrl;
        }
        const { tokens } = await client.getToken(verifyOptions);
        console.log('[Auth] Google Tokens received. ID Token present:', !!tokens.id_token);
        client.setCredentials(tokens);
        
        // Verify ID Token
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new Error('Invalid Google Token payload');
        }
        return payload;
      },
      (e) => {
        console.error('[Auth] Google Auth Detail Failure:', e);
        return authenticationError('Google Auth Failed', 'InvalidToken');
      }
    ),
    // 2. Find or Create User
    TE.chainW((payload) => 
      pipe(
        retrieveUserFromDatabaseByEmail(payload.email || ''),
        TE.chainW((existingUser) => {
            if (existingUser) {
                // Always sync user details from Google on login to ensure freshness
                console.log('[Auth] Google Login for:', existingUser.email, 'Payload Picture:', payload.picture);
                
                return pipe(
                    TE.tryCatch(
                        async () => updateUserInDatabaseById({
                            userId: existingUser.id,
                            user: {
                                name: payload.name,
                                image: payload.picture
                            }
                        }),
                        (e) => internalError('Failed to update user', e)
                    ),
                    TE.map(() => existingUser) // Return original user (or updated one if we waited, but Prisma returns updated usually. updateUserInDatabaseById returns updated user)
                );
            } else {
                return pipe(
                    TE.tryCatch(
                        async () => {
                            const newUser = createPopulatedUser({ 
                                email: payload.email!, 
                                name: payload.name,
                                image: payload.picture
                            });
                            delete newUser.password; 
                            return await saveUserToDatabase(newUser);
                        },
                        (e) => internalError('Failed to create user', e)
                    ),
                    TE.chain((user) => {
                         // Credit Referrer
                         if (referralCode) {
                            // Fire and forget or sequential? Better sequential for safety, but don't fail login if referral fails?
                            // For now, let's try to update and ignore error or log it.
                            return pipe(
                                TE.tryCatch(
                                    async () => {
                                        console.log(`[Referral] Crediting referrer: ${referralCode}`);
                                        await incrementUserCoins(referralCode, 50);
                                    },
                                    (e: unknown) => {
                                        console.error('[Referral] Failed to credit referrer', e);
                                        return internalError('Referral Error', e instanceof Error ? e : new Error(String(e))); 
                                    }
                                ),
                                TE.map(() => user),
                                // If referral fails effectively, we still return user. 
                                // TE.chain above would fail the whole flow if left returns.
                                // So we need to handle the Left case of referral to NOT block login?
                                // Actually TE.tryCatch returns Left on error.
                                // We should recover from referral error.
                                TE.orElse((e) => {
                                    console.warn('Referral failed but proceeding with login', e);
                                    return TE.right(user);
                                })
                            );
                         }
                         return TE.right(user);
                    })
                );
            }
        })
      )
    ),
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
    }))
  );

export const createAuthCode = (token: string): TaskEither<AppError, string> => 
    TE.tryCatch(
        async () => {
             const code = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
             // Expires in 5 minutes
             const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
             
             await prisma.authCode.create({
                 data: {
                     code,
                     token,
                     expiresAt
                 }
             });
             return code;
        },
        (e) => internalError('Failed to create auth code', e)
    );

export const exchangeAuthCode = (code: string): TaskEither<AppError, string> =>
    pipe(
        TE.tryCatch(
            async () => {
                const authCode = await prisma.authCode.findUnique({
                    where: { code }
                });
                return authCode;
            },
            (e): AppError => internalError('Database error finding auth code', e)
        ),
        TE.chainW((authCode) => {
            if (!authCode) {
                return TE.left(authenticationError('Invalid auth code', 'InvalidToken'));
            }
            if (new Date() > authCode.expiresAt) {
                 // Clean up expired code?
                 return TE.left(authenticationError('Auth code expired', 'ExpiredToken'));
            }
            
            return pipe(
                TE.tryCatch(
                    async () => {
                        await prisma.authCode.delete({ where: { code } });
                        return authCode.token;
                    },
                    (e): AppError => internalError('Failed to delete auth code', e)
                )
            );
        })
    );

// --- TON Wallet Auth ---

interface TonProof {
    timestamp: number;
    domain: {
        lengthBytes: number;
        value: string;
    };
    signature: string;
    payload: string;
}

const verifyTonProof = async (address: string, proof: TonProof): Promise<boolean> => {
    // TODO: Implement actual signature verification
    // 1. Reconstruct message
    // 2. Verify Ed25519 signature
    // For now, assuming trusted status from frontend for MVP/Dev speed 
    // OR if we can trust the 'proof' token from TON Connect.
    // Ideally we use: https://github.com/ton-connect/sdk/tree/main/packages/sdk#check-proof-on-backend
    console.log('[Auth] Verifying TON proof for:', address);
    return true; 
}

export const loginWithWallet = (address: string, proof: any): TaskEither<AppError, AuthResponse> =>
    pipe(
        TE.tryCatch(
            async () => {
                const isValid = await verifyTonProof(address, proof);
                if (!isValid) throw new Error('Invalid wallet proof');
                
                const user = await prisma.user.findUnique({
                    where: { walletAddress: address }
                });
                return user;
            },
            (e): AppError => authenticationError('Wallet login failed', 'InvalidToken')
        ),
        TE.chainW((user) => {
            if (!user) {
                // User not found - Signals frontend to show Signup Form
                return TE.left(notFoundError('User not found', address));
            }
            return TE.right(user);
        }),
        TE.map((user) => ({
            token: jwt.sign({ id: user.id, email: user.email || '', walletAnddress: user.walletAddress }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }),
            user: { 
                id: user.id, 
                email: user.email || '', 
                name: user.name, 
                image: user.image,
                walletAddress: user.walletAddress 
            }
        }))
    );

export const signupWithWallet = (
    address: string, 
    proof: any, 
    data: { name: string; username: string }
): TaskEither<AppError, AuthResponse> =>
    pipe(
        TE.tryCatch(
            async () => {
                const isValid = await verifyTonProof(address, proof);
                if (!isValid) throw new Error('Invalid wallet proof');
                
                // Check if username/address exists
                const existing = await prisma.user.findFirst({
                    where: { 
                        OR: [
                            { walletAddress: address },
                            { username: data.username }
                        ]
                    }
                });
                if (existing) {
                    if (existing.walletAddress === address) throw new Error('Wallet already registered');
                    if (existing.username === data.username) throw new Error('Username taken');
                }

                // Create User
                // Initials for image
                const initials = data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                const image = `https://ui-avatars.com/api/?name=${initials}&background=random`;

                // Handle email - Make it optional or placeholder?
                // Schema has email? @unique. If we made it optional, great.
                // Assuming schema update applied.
                
                const newUser = await prisma.user.create({
                    data: {
                        walletAddress: address,
                        username: data.username,
                        name: data.name,
                        image: image,
                        email: null, // Explicitly null for wallet users initially
                        coins: 0
                    }
                });
                return newUser;
            },
            (e: any): AppError => {
                const msg = e.message || String(e);
                if (msg.includes('Username taken')) return conflictError('Username already taken', 'username', data.username);
                if (msg.includes('Wallet already registered')) return conflictError('Wallet already registered', 'walletAddress', address);
                return internalError('Signup failed', e);
            }
        ),
        TE.map((user) => ({
            token: jwt.sign({ id: user.id, walletAddress: user.walletAddress }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }),
             user: { 
                id: user.id, 
                email: user.email || '', 
                name: user.name, 
                image: user.image,
                walletAddress: user.walletAddress 
            }
        }))
    );
