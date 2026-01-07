import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as E from 'fp-ts/lib/Either.js';
type Either<E, A> = E.Either<E, A>;
import { retrieveUserStats } from '../users/users-model.js';
import prisma from '../../prisma.js';
import { createWalletRepository } from '../wallet/wallet.repository.js';
import { createWalletService } from '../wallet/wallet.service.js';
import { createTonBlockchainService } from '../../infrastructure/blockchain/ton-blockchain.service.js';
import type { AppError } from '../../fp/domain/errors/AppError.js';
import type { User } from '../../generated/prisma/index.js';

const app = new OpenAPIHono<{ Variables: { user: User | null } }>();

app.get('/test', (c) => c.text('Auth test working'));

// Schemas
const GoogleLoginRequestSchema = z.object({
  token: z.string().describe('Google ID Token')
}).openapi('GoogleLoginRequest');

const ExchangeAuthCodeSchema = z.object({
    code: z.string()
}).openapi('ExchangeAuthCodeSchema');

const TelegramUserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.number().optional(),
  hash: z.string().optional()
}).openapi('TelegramUser');

const WalletLoginRequestSchema = z.object({
  address: z.string(),
  proof: z.any(),
  telegramUser: TelegramUserSchema.optional()
}).openapi('WalletLoginRequest');

const WalletSignupRequestSchema = z.object({
  address: z.string(),
  proof: z.any(),
  name: z.string(),
  username: z.string(),
  telegramUser: TelegramUserSchema.optional()
}).openapi('WalletSignupRequest');

const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().nullable().optional(),
    name: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    walletAddress: z.string().optional().nullable()
  })
}).openapi('AuthResponse');

const ErrorResponseSchema = z.object({
  error: z.string()
}).openapi('ErrorResponse');

const UserResponseSchema = z.object({
  id: z.string().openapi({ example: '123' }),
  email: z.string().email().openapi({ example: 'user@example.com' }),
  name: z.string().optional().nullable().openapi({ example: 'Data Boy' }),
  image: z.string().optional().nullable().openapi({ example: 'https://lh3.googleusercontent.com/...' }),
  walletAddress: z.string().optional().nullable().openapi({ example: '0x123...' }),
  matches: z.number().optional().openapi({ example: 5 }),
  points: z.number().optional().openapi({ example: 150 }),
  trophies: z.number().optional().openapi({ example: 2 }),
  referralId: z.string().openapi({ example: '123' }),
  referralLink: z.string().openapi({ example: 'http://localhost:8100/signup?ref=123' }),
  coins: z.number().openapi({ example: 50 }),
}).openapi('UserResponse');

const GoogleAuthUrlResponseSchema = z.object({
  url: z.string()
}).openapi('GoogleAuthUrlResponse');

// Helper to convert AppError to HTTP status
const toHttpStatus = (error: AppError): number => {
  switch (error._tag) {
    case 'AuthenticationError':
      return 401;
    case 'NotFoundError':
      return 404;
    case 'ValidationError':
      return 400;
    case 'DatabaseError':
      return 500;
    default:
      return 500;
  }
};

const getErrorMessage = (error: AppError): string => {
  if ('message' in error) return error.message;
  if (error._tag === 'NotFoundError') return `${error.resource} not found`;
  if (error._tag === 'DatabaseError') return 'Database error';
  return 'Unknown error';
};

import { generateGoogleAuthUrl, loginWithGoogleCode, createAuthCode, exchangeAuthCode, loginWithWallet, signupWithWallet } from './auth.service.js';
import jwt from 'jsonwebtoken';
import { retrieveUserFromDatabaseByEmail } from '../users/users-model.js';

// 1. GET /auth/google/url - Generate Auth URL
const getGoogleAuthUrlRoute = createRoute({
  method: 'get',
  path: '/google/url',
  summary: 'Get Google Auth URL for redirect',
  request: {
    query: z.object({
      referralCode: z.string().optional(),
      platform: z.enum(['web', 'mobile', 'telegram']).optional().default('web'),
      redirectUrl: z.string().optional()
    })
  },
  responses: {
     200: {
       content: { 'application/json': { schema: GoogleAuthUrlResponseSchema } },
       description: 'Google Auth URL'
     }
  }
});

app.openapi(getGoogleAuthUrlRoute, async (c) => {
    const { referralCode, platform, redirectUrl } = c.req.valid('query');
    console.log('[Auth] Generating Google URL. Platform:', platform, 'Referral:', referralCode, 'Redirect:', redirectUrl);
    const url = generateGoogleAuthUrl(referralCode, platform as any, redirectUrl);
    return c.json({ url });
});

// Duplicate removed

// ... existing code ...

// 2. GET /auth/google/callback - Handle Redirect Code
const googleCallbackRoute = createRoute({
  method: 'get',
  path: '/google/callback',
  summary: 'Google Auth Callback',
  request: {
    query: z.object({
        code: z.string(),
        state: z.string().optional()
    })
  },
  responses: {
    302: {
      description: 'Redirect to Frontend'
    },
    400: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Authentication Failed'
    }
  }
});

app.openapi(googleCallbackRoute, async (c) => {
    const { code, state } = c.req.valid('query');
    console.log('[Auth] Google Callback received. Code:', code ? 'present' : 'missing', 'State:', state);
    let referralCode: string | undefined;
    let platform: 'web' | 'mobile' | 'telegram' = 'web';
    let redirectUrl: string | undefined;

    if (state) {
        try {
            const parsedState = JSON.parse(state);
            console.log('[Auth] Parsed State:', parsedState);
            referralCode = parsedState.referralCode;
            if (parsedState.platform) platform = parsedState.platform;
            if (parsedState.redirectUrl) redirectUrl = parsedState.redirectUrl;
        } catch (e) {
            console.error('[Auth] Failed to parse state:', e);
            // Ignore state parsing error
        }
    }
    console.log('[Auth] Processing callback for platform:', platform);

    const result = await loginWithGoogleCode(code, referralCode, redirectUrl)();

    if (E.isRight(result)) {
        const { token } = result.right;
        console.log('[Auth] Login successful. Token generated.');
        
        if (platform === 'mobile') {
            return c.redirect(`fantasypro://auth/callback?token=${token}`);
        }
        
        if (platform === 'telegram') {
            // Create Short Code
            console.log('[Auth] Telegram platform detected. Creating auth code...');
            const codeResult = await createAuthCode(token)();
            if (E.isRight(codeResult)) {
                const authCode = codeResult.right;
                const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'FantasyProBot'; 
                console.log('[Auth] Auth Code created:', authCode, 'Redirecting to bot:', botUsername);
                // Redirect to Telegram Mini App with startapp param
                return c.redirect(`https://t.me/${botUsername}/app?startapp=${authCode}`);
            } else {
                 console.error('[Auth] Failed to generate auth code:', codeResult.left);
                 return c.json({ error: 'Failed to generate auth code' }, 500);
            }
        }
        
        const frontendUrl = redirectUrl || process.env.FRONTEND_URL || 'http://localhost:8100';
        return c.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } else {
        const error = result.left;
        console.error('[Auth] Login failed:', error);
        const msg = getErrorMessage(error);
        // Return HTML with error for visibility
        return c.html(`
            <html>
                <body style="font-family: sans-serif; padding: 20px; text-align: center;">
                    <h1>Authentication Failed</h1>
                    <p style="color: red; font-size: 18px;">${msg}</p>
                    <p>Referral: ${referralCode || 'None'}</p>
                    <p>Platform: ${platform}</p>
                    <p>Redirect: ${redirectUrl || 'None'}</p>
                    <p>Full Error: ${JSON.stringify(error)}</p>
                    <a href="https://t.me/${process.env.TELEGRAM_BOT_USERNAME || 'FantasyProBot'}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #3390ec; color: white; text-decoration: none; border-radius: 5px;">Return to Telegram</a>
                </body>
            </html>
        `, 400); 
    }
});

// 2.5 POST /auth/exchange - Exchange Auth Code for Token
const exchangeAuthCodeRoute = createRoute({
    method: 'post',
    path: '/exchange',
    summary: 'Exchange Auth Code for Token',
    request: {
        body: {
            content: {
                'application/json': { schema: ExchangeAuthCodeSchema }
            }
        }
    },
    responses: {
        200: {
            content: { 'application/json': { schema: AuthResponseSchema } },
            description: 'Auth Success'
        },
        400: {
            content: { 'application/json': { schema: ErrorResponseSchema } },
            description: 'Invalid Code'
        }
    }
});

app.openapi(exchangeAuthCodeRoute, async (c) => {
    const { code } = c.req.valid('json');
    const result = await exchangeAuthCode(code)();
    
    if (E.isRight(result)) {
        const token = result.right; 
        const decoded = jwt.decode(token) as any;
        const email = decoded.email;
        const userResult = await retrieveUserFromDatabaseByEmail(email)();
        
        if (E.isRight(userResult) && userResult.right) {
             const user = userResult.right;
             return c.json({
                 token,
                 user: {
                     id: user.id,
                     email: user.email,
                     name: user.name,
                     image: user.image,
                     walletAddress: user.walletAddress
                 }
             }, 200);
        }
        
        return c.json({ error: 'User not found' }, 400);

    } else {
         return c.json({ error: getErrorMessage(result.left) }, 400);
    }
});

// 2.6 POST /auth/login-wallet
const loginWalletRoute = createRoute({
    method: 'post',
    path: '/login-wallet',
    summary: 'Login with TON Wallet',
    request: {
        body: {
            content: { 'application/json': { schema: WalletLoginRequestSchema } }
        }
    },
    responses: {
        200: {
            content: { 'application/json': { schema: AuthResponseSchema } },
            description: 'Login Success'
        },
        404: {
            content: { 'application/json': { schema: ErrorResponseSchema } },
            description: 'User Not Found (Redirect to Signup)' 
        },
        400: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: 'Bad Request' },
        500: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: 'Internal Error' }
    }
});

app.openapi(loginWalletRoute, async (c) => {
    const { address, proof } = c.req.valid('json');
    console.time(`[Performance] LoginWallet ${address}`);
    const result = await loginWithWallet(address, proof)();
    console.timeEnd(`[Performance] LoginWallet ${address}`);
    
    if (E.isRight(result)) {
        return c.json(result.right, 200);
    } else {
        const error = result.left;
        const status = toHttpStatus(error);
        return c.json({ error: getErrorMessage(error) }, status as any); 
    }
});

// 2.7 POST /auth/signup-wallet
const signupWalletRoute = createRoute({
    method: 'post',
    path: '/signup-wallet',
    summary: 'Signup with TON Wallet',
    request: {
        body: {
            content: { 'application/json': { schema: WalletSignupRequestSchema } }
        }
    },
    responses: {
        200: {
            content: { 'application/json': { schema: AuthResponseSchema } },
            description: 'Signup Success'
        },
        409: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: 'Conflict (User/Wallet exists)' },
        400: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: 'Bad Request' }
    }
});

app.openapi(signupWalletRoute, async (c) => {
    const { address, proof, name, username, telegramUser } = c.req.valid('json');
    const result = await signupWithWallet(address, proof, { name, username, telegramUser })();
    
    if (E.isRight(result)) {
        return c.json(result.right, 200);
    } else {
        const error = result.left;
        let status = toHttpStatus(error);
        if (getErrorMessage(error).includes('taken') || getErrorMessage(error).includes('registered')) {
            status = 409;
        }
        return c.json({ error: getErrorMessage(error) }, status as any);
    }
});


// 3. GET /user - Get Authenticated User
const getUserRoute = createRoute({
  method: 'get',
  path: '/user',
  summary: 'Get authenticated user details',
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'User details',
      content: { 'application/json': { schema: UserResponseSchema } }
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } }
    }
  }
});

app.openapi(getUserRoute, async (c) => {
  const user = c.get('user') as any; // Cast to any to access custom properties added by passport or schema
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  // Return user info from DB
  // TODO: WalletService needs refactor to accept SolanaService or we just use simple balance check here?
  // For 'getUserWallet' in legacy, it returned address and balance.
  // We can just return what's in DB for address. Balance might need a quick RPC call if we want it live.
  
  let walletAddress: string | undefined | null = user.walletAddress;
  
  // If we really need balance, we should implement it in SolanaService or here.
  // Legacy logic:
  // const walletResult = await walletService.getUserWallet(user.id)();
  // if (E.isRight(walletResult)) { walletAddress = walletResult.right.address; }
  
  // New Logic: Just use DB address for now or simple Solana check if address exists.
  // If user has no address in DB, they haven't connected.


  const statsResult = await retrieveUserStats(user.id)();
  let matches = 0;
  let points = 0;
  let trophies = 0;

  if (E.isRight(statsResult)) {
      matches = statsResult.right.matches;
      points = statsResult.right.points;
      trophies = statsResult.right.trophies;
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8100';

  return c.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      image: user.image, 
      walletAddress,
      matches,
      points,
      trophies,
      referralId: user.id,
      referralLink: `${frontendUrl}/signup?ref=${user.id}`,
      coins: user.coins || 0
  }, 200);
});

export default app;
